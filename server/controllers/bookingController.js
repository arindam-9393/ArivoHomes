const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification'); 
const sendEmail = require('../utils/sendEmail'); 

// ==========================================
// 1. Request a Visit (Notify Owner)
// ==========================================
const createBooking = async (req, res) => {
    try {
        const { propertyId, moveInDate, visitTime, message } = req.body;
        
        // Fetch Property AND Owner details
        const property = await Property.findById(propertyId).populate('owner');
        
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // 🛑 ZOMBIE CHECK
        if (!property.owner) {
            return res.status(400).json({ message: "This property is invalid (No Owner)." });
        }

        // Block booking if already rented
        if (property.status === 'Rented') {
            return res.status(400).json({ message: "Property is already rented!" });
        }

        const booking = await Booking.create({
            property: propertyId,
            user: req.user._id,
            moveInDate,
            visitTime,
            message,
            status: 'Pending'
        });

        // 🔔 Database Notification
        await Notification.create({
            user: property.owner._id,
            message: `New Visit Request for ${property.title} by ${req.user.name}`,
            type: 'info',
            relatedId: booking._id
        });

        // 📧 Email Notification
        try {
            await sendEmail({
                email: property.owner.email,
                subject: `🔔 New Visit Request: ${property.title}`,
                html: `
                    <h3>New Visit Request!</h3>
                    <p>Hi <strong>${property.owner.name}</strong>,</p>
                    <p>A tenant (${req.user.name}) wants to visit your property.</p>
                    <div style="background:#f3f4f6; padding:15px; border-radius:8px; margin:10px 0;">
                        <p><strong>Property:</strong> ${property.title}</p>
                        <p><strong>Date:</strong> ${new Date(moveInDate).toDateString()}</p>
                        <p><strong>Time:</strong> ${visitTime}</p>
                        <p><strong>Message:</strong> "${message}"</p>
                    </div>
                    <a href="https://arivohomes.onrender.com/dashboard">Go to Dashboard</a>
                `
            });
        } catch (emailError) {
            console.error("⚠️ Email failed:", emailError.message);
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error("❌ CREATE BOOKING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. Get All User Bookings (Received & Sent)
// ==========================================
const getUserBookings = async (req, res) => {
    try {
        const myProperties = await Property.find({ owner: req.user._id });
        const myPropertyIds = myProperties.map(p => p._id);

        const bookings = await Booking.find({
            $or: [
                { property: { $in: myPropertyIds } }, 
                { user: req.user._id }               
            ]
        })
        .populate({
            path: 'property',
            populate: { path: 'owner', select: 'name email phone' }
        })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ GET BOOKINGS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. Update Status (Finalize / Schedule / Reject)
// ==========================================
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId)
            .populate('user') 
            .populate({ path: 'property', populate: { path: 'owner' } }); 

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const owner = booking.property.owner;
        const tenant = booking.user;
        const propertyTitle = booking.property.title;

        // Verify Ownership
        if (!owner || owner._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized." });
        }

        // --- SCENARIO A: SCHEDULE VISIT ---
        if (status === 'Visit Scheduled') {
            booking.status = 'Visit Scheduled';
            await booking.save();

            await Notification.create({
                user: tenant._id,
                message: `Visit Confirmed for ${propertyTitle}!`,
                type: 'success'
            });

            sendEmail({
                email: tenant.email,
                subject: `✅ Visit Confirmed: ${propertyTitle}`,
                html: `<h3>Good News!</h3><p>The owner accepted your visit for <strong>${propertyTitle}</strong>.</p>`
            }).catch(e => console.log("Email fail:", e.message));

            return res.status(200).json({ message: "Visit Scheduled Successfully!" });
        }

        // --- SCENARIO B: FINALIZE TENANT (RENTED) ---
        if (status === 'Booked') {
            // 1. Update Booking
            booking.status = 'Booked';
            await booking.save();

            // 2. Update Property Status to RENTED
            const property = await Property.findById(booking.property._id);
            if (property) {
                property.status = 'Rented'; // This requires your Property.js to have the status field!
                await property.save();
                console.log(`✅ DATABASE: Property ${property.title} set to Rented.`);
            }

            // 3. Reject other seekers for this property
            await Booking.updateMany(
                { property: property._id, _id: { $ne: bookingId }, status: 'Pending' },
                { status: 'Rejected' }
            );

            await Notification.create({
                user: tenant._id,
                message: `🎉 Congratulations! ${propertyTitle} is yours.`,
                type: 'success'
            });

            sendEmail({
                email: tenant.email,
                subject: `🎉 New Home: ${propertyTitle}`,
                html: `<h3>You got the home! 🏠</h3><p>You are the finalized tenant for <strong>${propertyTitle}</strong>.</p>`
            }).catch(e => console.log("Email fail:", e.message));

            return res.status(200).json({ message: "Tenant Finalized!" });
        }

        // --- SCENARIO C: REJECT / OTHERS ---
        booking.status = status; 
        await booking.save();

        if (status === 'Rejected') {
            await Notification.create({
                user: tenant._id,
                message: `Request for ${propertyTitle} was not accepted.`,
                type: 'error'
            });
        }

        res.status(200).json({ message: `Status updated to ${status}` });

    } catch (error) {
        console.error("❌ UPDATE STATUS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. Vacate Property
// ==========================================
const vacateProperty = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const property = await Property.findById(propertyId);
        
        if (!property) return res.status(404).json({ message: "Property not found" });
        if (property.owner.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

        // Reset to Available
        property.status = 'Available';
        await property.save();

        // Update booking history
        const activeBooking = await Booking.findOne({ property: propertyId, status: 'Booked' });
        if (activeBooking) {
            activeBooking.status = 'Vacated';
            activeBooking.moveOutDate = Date.now();
            await activeBooking.save();
        }

        res.status(200).json({ message: "Property Vacated." });
    } catch (error) {
        console.error("❌ VACATE ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getUserBookings, updateBookingStatus, vacateProperty };