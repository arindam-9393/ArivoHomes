const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moveInDate: { type: Date, required: true },
    moveOutDate: { type: Date }, // Ensure this exists
    message: { type: String, required: true },
    
    // --- FIX IS HERE: ADD 'Moved Out' TO THIS LIST ---
    status: { 
        type: String, 
        enum: ['Pending', 'Visit Scheduled', 'Booked', 'Rejected', 'Cancelled', 'Moved Out'], 
        default: 'Pending' 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);  