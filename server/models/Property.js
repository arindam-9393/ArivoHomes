const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: "Apartment" },
    description: { type: String, required: true },
    
    // --- ADD THESE NEW FIELDS ---
    tags: { 
        type: [String], 
        default: [] 
    },
    furnishingStatus: { 
        type: String, 
        default: "Unfurnished" 
    },
    furnishingItems: { 
        type: [String], 
        default: [] 
    },
    amenities: { 
        type: [String], 
        default: [] 
    },
    // ---------------------------

    tenantPreference: { type: String, default: "All" },
    parking: { type: String, default: "None" },
    
    mainImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    
}, { timestamps: true });

module.exports = mongoose.model("Property", PropertySchema);