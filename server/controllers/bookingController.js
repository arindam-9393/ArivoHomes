const Booking = require('../models/Booking');
const Property = require('../models/Property');


// 1. Request a Visit
// 1. Request a Visit
const createBooking = async (req, res) => {
    try {
        // --- ADD visitTime TO DESTRUCTURING ---
        const { propertyId, moveInDate, visitTime, message } = req.body;
        
        const property = await Property.findById(propertyId);
        if (property.status === 'Rented') {
            return res.status(400).json({ message: "Property is already rented!" });
        }

        const booking = await Booking.create({
            property: propertyId,
            user: req.user._id,
            moveInDate,
            visitTime, // --- SAVE THE TIME ---
            message,
            status: 'Pending'
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... keep the rest of the file exactly the same

// 2. Get Bookings (With Owner/Tenant Details)
// 2. Get Bookings (Smart: Gets Incoming AND Outgoing)
const getUserBookings = async (req, res) => {
    try {
        // 1. Find properties owned by this user
        const myProperties = await Property.find({ owner: req.user._id });
        const myPropertyIds = myProperties.map(p => p._id);

        // 2. Find ALL related bookings (Incoming OR Outgoing)
        const bookings = await Booking.find({
            $or: [
                { property: { $in: myPropertyIds } }, // Incoming (I am the Landlord)
                { user: req.user._id }                // Outgoing (I am the Visitor)
            ]
        })
        .populate({
            path: 'property',
            populate: { path: 'owner', select: 'name email phone' } // Need owner details
        })
        .populate('user', 'name email phone') // Need tenant details
        .sort({ createdAt: -1 }); // Newest first

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update Status (Visit vs Finalize)
// 3. Update Status (With Debugging Logs)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const bookingId = req.params.id;

        console.log(`[DEBUG] Request to update Booking: ${bookingId} to '${status}'`);
        console.log(`[DEBUG] User Requesting: ${req.user._id}`);

        const booking = await Booking.findById(bookingId).populate('property');

        if (!booking) {
            console.log(`[DEBUG] Error: Booking not found`);
            return res.status(404).json({ message: "Booking not found" });
        }

        // DEBUG: Check Ownership
        const ownerId = booking.property.owner.toString();
        const userId = req.user._id.toString();
        
        console.log(`[DEBUG] Property Owner: ${ownerId}`);
        console.log(`[DEBUG] Current User:   ${userId}`);

        if (ownerId !== userId) {
            console.log(`[DEBUG] Error: User is NOT the owner`);
            return res.status(401).json({ message: "Not authorized. You are not the owner." });
        }

        // --- SCENARIO 1: SCHEDULE VISIT ---
        if (status === 'Visit Scheduled') {
            booking.status = 'Visit Scheduled';
            await booking.save();
            console.log(`[DEBUG] Success: Status updated to Visit Scheduled`);
            return res.status(200).json({ message: "Visit Scheduled Successfully!" });
        }

        // --- SCENARIO 2: FINALIZE TENANT ---
        if (status === 'Booked') {
            booking.status = 'Booked';
            await booking.save();

            const property = await Property.findById(booking.property._id);
            property.status = 'Rented';
            await property.save();

            // Reject others
            await Booking.updateMany(
                { property: property._id, _id: { $ne: bookingId } },
                { status: 'Rejected' }
            );

            console.log(`[DEBUG] Success: Property Rented`);
            return res.status(200).json({ message: "Tenant Finalized!" });
        }

        // --- SCENARIO 3: REJECT/OTHER ---
        booking.status = status;
        await booking.save();
        console.log(`[DEBUG] Success: Status updated to ${status}`);
        res.status(200).json({ message: `Status updated to ${status}` });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 4. Vacate Property (Reset for next tenant)
// 4. Vacate Property (Reset for next tenant)
// Inside server/controllers/bookingController.js

const vacateProperty = async (req, res) => {
    try {
        const { propertyId } = req.body;
        
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        // 1. Mark Property Available
        property.status = 'Available';
        await property.save();

        // 2. Close Booking & Set Move Out Date
        const activeBooking = await Booking.findOne({ property: propertyId, status: 'Booked' });
        
        if (activeBooking) {
            activeBooking.status = 'Moved Out'; 
            activeBooking.moveOutDate = Date.now(); // <--- SAVE DATE
            await activeBooking.save();
        }

        res.status(200).json({ message: "Property Vacated. History Saved." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { createBooking, getUserBookings, updateBookingStatus, vacateProperty };