// const Property = require('../models/Property'); // <--- Corrected Model Name

// // @desc    Get all properties (Smart Search + Advanced Filters)
// // @route   GET /property
// // @access  Public
// const getProperties = async (req, res) => {
//     try {
//         const { 
//             location, category, minPrice, maxPrice, 
//             tenantPreference, parking, amenities,
//             furnishingStatus, furnishingItems,
//             search // Added generic search param just in case
//         } = req.query;

//         let query = {};

//         // 1. Smart Search (Location/Tags/Title)
//         // Checks 'location' param OR 'search' param
//         const searchTerm = location || search;
//         if (searchTerm) {
//             const searchTerms = searchTerm.split(' ').map(term => term.trim()).filter(term => term);
//             const regexQueries = searchTerms.map(term => new RegExp(term, 'i'));
//             query.$or = [
//                 { location: { $in: regexQueries } },
//                 { title: { $in: regexQueries } },
//                 { tags: { $in: regexQueries } }
//             ];
//         }

//         // 2. Basic Filters
//         if (category && category !== 'All') query.category = category;
        
//         if (minPrice || maxPrice) {
//             query.price = {};
//             if (minPrice) query.price.$gte = Number(minPrice);
//             if (maxPrice) query.price.$lte = Number(maxPrice);
//         }

//         if (tenantPreference && tenantPreference !== 'All') {
//             query.tenantPreference = { $in: [tenantPreference, 'All'] };
//         }

//         if (parking && parking !== 'Any') {
//             if (parking === 'Bike') query.parking = { $in: ['Bike', 'Both'] };
//             else if (parking === 'Car') query.parking = { $in: ['Car', 'Both'] };
//             else if (parking === 'Both') query.parking = 'Both';
//         }

//         if (amenities) {
//             const amenityList = amenities.split(',');
//             query.amenities = { $all: amenityList }; 
//         }

//         // 3. Furnishing Filters
//         if (furnishingStatus && furnishingStatus !== 'Any') {
//             query.furnishingStatus = furnishingStatus;
//         }

//         if (furnishingItems) {
//             const itemsList = furnishingItems.split(',');
//             query.furnishingItems = { $all: itemsList }; 
//         }

//         const properties = await Property.find(query).sort({ createdAt: -1 }); // Sort by newest
//         res.status(200).json(properties);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Create a new property
// // @route   POST /property
// // @access  Private
// const createProperty = async (req, res) => {
//     try {
//         // 1. Get all data from frontend
//         const { 
//             title, description, price, location, category, 
//             mainImage, galleryImages, // <--- CHANGED: Split 'images' into main and gallery
//             amenities, furnishingStatus, furnishingItems,
//             tenantPreference, parking, tags,
//             bedrooms, bathrooms, type // Added basic fields
//         } = req.body;

//         if (!title || !description || !price || !location || !category || !mainImage) {
//             return res.status(400).json({ message: "Please fill all required fields and add a Main Image" });
//         }

//         // 2. Create the property
//         const property = await Property.create({
//             owner: req.user._id, // Comes from the 'protect' middleware
//             title,
//             description,
//             price,
//             location,
//             category,
//             type: type || 'rent',
//             bedrooms: bedrooms || 1,
//             bathrooms: bathrooms || 1,
            
//             // --- NEW IMAGE LOGIC ---
//             mainImage,       // Single String URL
//             galleryImages,   // Array of URL Strings
//             // -----------------------

//             amenities,
//             furnishingStatus, 
//             furnishingItems,  
//             tenantPreference,
//             parking,
//             tags
//         });

//         res.status(201).json(property);
//     } catch (error) {
//         console.error("Error creating property:", error);
//         res.status(500).json({ message: "Server Error: " + error.message });
//     }
// };

// // @desc    Get single property
// // @route   GET /property/:id
// // @access  Public
// const getProperty = async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
//         if(property) {
//             res.status(200).json(property);
//         } else {
//             res.status(404).json({ message: "Property not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Update a property
// // @route   PUT /property/:id
// // @access  Private (Owner only)
// const updateProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);

//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }

//     // Check if the user is the owner
//     if (property.owner.toString() !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     // UNIVERSAL UPDATE: This takes EVERYTHING sent from the frontend 
//     // and updates it in the database (Title, Price, Images, Amenities, etc.)
//     const updatedProperty = await Property.findByIdAndUpdate(
//       req.params.id,
//       req.body, 
//       { new: true } // Return the updated document
//     );

//     res.status(200).json(updatedProperty);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // @desc    Delete a property
// // @route   DELETE /property/:id
// // @access  Private (Owner only)
// const deleteProperty = async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id);

//         if (!property) {
//             return res.status(404).json({ message: "Property not found" });
//         }

//         // Check if the user is the owner
//         if (property.owner.toString() !== req.user.id) {
//             return res.status(401).json({ message: "Not authorized" });
//         }

//         await property.deleteOne();

//         res.status(200).json({ id: req.params.id, message: "Property removed" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // ... existing imports ...

// // @desc    Get Signature for Upload
// // @route   GET /api/properties/upload-signature
// // @access  Private
// const getUploadSignature = (req, res) => {
//   const timestamp = Math.round((new Date()).getTime() / 1000);

//   const signature = cloudinary.utils.api_sign_request({
//     timestamp: timestamp,
//     folder: 'arivo_homes', // Optional: Organize photos in a folder
//   }, process.env.CLOUDINARY_API_SECRET);

//   res.status(200).json({ timestamp, signature });
// };

// // ... existing functions (getProperties, createProperty, etc.) ...

// module.exports = {
//   getProperties,
//   getProperty,
//   createProperty,
//   updateProperty,
//   deleteProperty,
//   getUploadSignature // <--- Don't forget to export this!
// };


const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all properties (Optimized for Speed)
// @route   GET /property
// @access  Public
// @desc    Get all properties (Optimized for Speed)
// @route   GET /property
// @access  Public
const getProperties = async (req, res) => {
    try {
        const { 
            location, category, minPrice, maxPrice, 
            tenantPreference, parking, amenities,
            furnishingStatus, furnishingItems,
            search 
        } = req.query;

        let query = {};

        // 1. Smart Search
        const searchTerm = location || search;
        if (searchTerm) {
            const searchTerms = searchTerm.split(' ').map(term => term.trim()).filter(term => term);
            const regexQueries = searchTerms.map(term => new RegExp(term, 'i'));
            query.$or = [
                { location: { $in: regexQueries } },
                { title: { $in: regexQueries } },
                { tags: { $in: regexQueries } }
            ];
        }

        // 2. Basic Filters
        if (category && category !== 'All') query.category = category;
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (tenantPreference && tenantPreference !== 'All') {
            query.tenantPreference = { $in: [tenantPreference, 'All'] };
        }

        if (parking && parking !== 'Any') {
            if (parking === 'Bike') query.parking = { $in: ['Bike', 'Both'] };
            else if (parking === 'Car') query.parking = { $in: ['Car', 'Both'] };
            else if (parking === 'Both') query.parking = 'Both';
        }

        if (amenities) {
            const amenityList = amenities.split(',');
            query.amenities = { $all: amenityList }; 
        }

        if (furnishingStatus && furnishingStatus !== 'Any') {
            query.furnishingStatus = furnishingStatus;
        }

        if (furnishingItems) {
            const itemsList = furnishingItems.split(',');
            query.furnishingItems = { $all: itemsList }; 
        }

        // --- FIX IS HERE: Added 'owner' and 'status' ---
        const properties = await Property.find(query)
            .select('title price location mainImage category type bedrooms bathrooms tenantPreference parking furnishingStatus furnishingItems createdAt owner status') 
            .sort({ createdAt: -1 });

        res.status(200).json(properties);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new property
// @route   POST /property
// @access  Private
const createProperty = async (req, res) => {
    try {
        const { 
            title, description, price, location, category, 
            mainImage, galleryImages,
            amenities, furnishingStatus, furnishingItems,
            tenantPreference, parking, tags,
            bedrooms, bathrooms, type 
        } = req.body;

        if (!title || !description || !price || !location || !category || !mainImage) {
            return res.status(400).json({ message: "Please fill all required fields and add a Main Image" });
        }

        const property = await Property.create({
            owner: req.user._id,
            title, description, price, location, category,
            type: type || 'rent',
            bedrooms: bedrooms || 1,
            bathrooms: bathrooms || 1,
            mainImage, galleryImages,
            amenities, furnishingStatus, furnishingItems,
            tenantPreference, parking, tags
        });

        res.status(201).json(property);
    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// @desc    Get single property
// @route   GET /property/:id
// @access  Public
const getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
        if(property) {
            res.status(200).json(property);
        } else {
            res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a property
// @route   PUT /property/:id
// @access  Private (Owner only)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a property
// @route   DELETE /property/:id
// @access  Private (Owner only)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await property.deleteOne();
        res.status(200).json({ id: req.params.id, message: "Property removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Signature for Upload
// @route   GET /api/properties/upload-signature
// @access  Private
const getUploadSignature = (req, res) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'arivo_homes',
  }, process.env.CLOUDINARY_API_SECRET);

  res.status(200).json({ timestamp, signature });
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getUploadSignature
};