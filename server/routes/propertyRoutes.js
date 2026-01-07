const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import ALL controller functions
const { 
    getProperties, 
    createProperty, 
    getProperty, 
    updateProperty, 
    deleteProperty,
    vacateProperty,       // <--- Essential for your fix
    getUploadSignature    
} = require('../controllers/propertyController');

// =================================================================
// ROUTE DEFINITIONS
// =================================================================

// 1. Signature Route 
// (Must define this BEFORE /:id so "upload-signature" isn't treated as an ID)
router.get('/upload-signature', protect, getUploadSignature);


// 2. Vacate Route
// PUT /api/property/:id/vacate
// Matches your Frontend: API.put(`/property/${propertyId}/vacate`)
router.put('/:id/vacate', protect, vacateProperty);


// 3. General Routes (Root)
// GET /api/property  -> Get All (Search/Filter)
// POST /api/property -> Create New (Protected)
router.route('/')
    .get(getProperties)
    .post(protect, createProperty);


// 4. Single Property Routes (ID based)
// GET /api/property/:id    -> Get Single Details
// PUT /api/property/:id    -> Update Property (Protected)
// DELETE /api/property/:id -> Delete Property (Protected)
router.route('/:id')
    .get(getProperty)
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;