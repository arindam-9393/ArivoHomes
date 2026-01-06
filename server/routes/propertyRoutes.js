// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');

// // Import ALL functions from the controller
// // ... imports ...
// const { 
//     getProperties, 
//     createProperty, 
//     getProperty, 
//     updateProperty, 
//     deleteProperty,
//     getUploadSignature // <--- Import the new function
// } = require('../controllers/propertyController');

// // ... existing routes ...

// // NEW: Route to get signature (Must be protected)
// router.get('/upload-signature', protect, getUploadSignature);

// // Routes for "/" (e.g., /property)
// router.route('/')
//     .get(getProperties)         // Public: Search & Filter properties
//     .post(protect, createProperty); // Private: Create a new listing (Owner only)

// // Routes for "/:id" (e.g., /property/65a...)
// router.route('/:id')
//     .get(getProperty)           // Public: View single property details
//     .put(protect, updateProperty)   // Private: Update property (Owner only)
//     .delete(protect, deleteProperty); // Private: Delete property (Owner only)

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
    getProperties, 
    createProperty, 
    getProperty, 
    updateProperty, 
    deleteProperty,
    getUploadSignature,
    vacateProperty // <--- ✅ Added import
} = require('../controllers/propertyController');

// Route to get signature (Must be protected)
router.get('/upload-signature', protect, getUploadSignature);

// NEW: Route to Vacate Property
router.put('/:id/vacate', protect, vacateProperty); // <--- ✅ Added Route

// Routes for "/" (e.g., /property)
router.route('/')
    .get(getProperties)         // Public: Search & Filter properties
    .post(protect, createProperty); // Private: Create a new listing (Owner only)

// Routes for "/:id" (e.g., /property/65a...)
router.route('/:id')
    .get(getProperty)           // Public: View single property details
    .put(protect, updateProperty)   // Private: Update property (Owner only)
    .delete(protect, deleteProperty); // Private: Delete property (Owner only)

module.exports = router;