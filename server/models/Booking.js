const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moveInDate: { type: Date, required: true }, // Acts as Visit Date
    
    // --- NEW FIELD: VISIT TIME ---
    visitTime: { type: String, required: true },
    
    moveOutDate: { type: Date },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Visit Scheduled', 'Booked', 'Rejected', 'Cancelled', 'Moved Out'], 
        default: 'Pending' 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);