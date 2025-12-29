const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true }, // 'rent' or 'sale'
    category: { type: String, required: true }, // 'Apartment', 'Villa', etc.
    
    // --- NEW IMAGE LOGIC ---
    mainImage: { 
        type: String, 
        required: true 
    },
    galleryImages: {
        type: [String], // Array of URLs
        required: false
    },
    // -----------------------

    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    furnished: { type: Boolean, default: false },
    parking: {
        type: String, // <--- Change from Boolean to String
        required: true,
    },

    // ... rest of your schema
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);