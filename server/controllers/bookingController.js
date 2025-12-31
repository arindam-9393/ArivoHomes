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
const getUserBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'owner') {
            const properties = await Property.find({ owner: req.user._id });
            const propertyIds = properties.map(p => p._id);
            
            // Populate Tenant details for the owner
            bookings = await Booking.find({ property: { $in: propertyIds } })
                .populate('property')
                .populate('user', 'name email phone'); 
        } else {
            // Populate Owner details for the tenant (Hidden unless booked)
            bookings = await Booking.find({ user: req.user._id })
                .populate({
                    path: 'property',
                    populate: { path: 'owner', select: 'name email phone' }
                });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update Status (Visit vs Finalize)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const bookingId = req.params.id;

        console.log(`Updating Booking: ${bookingId} to Status: ${status}`); // Debug Log

        const booking = await Booking.findById(bookingId).populate('property');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if the user is actually the Owner
        if (booking.property.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized. You are not the owner." });
        }

        // --- SCENARIO 1: SCHEDULE VISIT ---
        if (status === 'Visit Scheduled') {
            booking.status = 'Visit Scheduled';
            await booking.save();
            return res.status(200).json({ message: "Visit Scheduled Successfully!" });
        }

        // --- SCENARIO 2: FINALIZE TENANT (The Lock) ---
        if (status === 'Booked') {
            // 1. Update this booking
            booking.status = 'Booked';
            await booking.save();

            // 2. Update Property to 'Rented'
            const property = await Property.findById(booking.property._id);
            property.status = 'Rented';
            await property.save();

            // 3. Reject ALL other applications for this property
            // We find bookings for this property that are NOT the one we just accepted
            await Booking.updateMany(
                { 
                    property: property._id, 
                    _id: { $ne: bookingId } 
                },
                { status: 'Rejected' }
            );

            return res.status(200).json({ message: "Tenant Finalized! Property Locked." });
        }

        // --- SCENARIO 3: REJECT / OTHER ---
        booking.status = status;
        await booking.save();
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