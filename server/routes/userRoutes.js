const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    verifyOTP, 
    getMe, 
    getUserProfile, 
    googleAuth,
    forgotPassword, 
    resetPassword,
    getUploadSignature, // <--- 1. IMPORT THIS
    updateUserProfile   // <--- 2. IMPORT THIS
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// ==============================
// PUBLIC ROUTES
// ==============================
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/google', googleAuth);

// --- PASSWORD RESET ROUTES ---
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// ==============================
// PROTECTED ROUTES
// ==============================

// 1. Get Secure Upload Signature (Must be before /:id)
router.get('/sign-upload', protect, getUploadSignature); // <--- NEW ROUTE

// 2. Update Personal Profile (Must be before /:id)
router.put('/profile', protect, updateUserProfile);      // <--- NEW ROUTE

// 3. Get Current User Data
router.get('/me', protect, getMe);

// 4. Get Any User Profile (ID based)
// NOTE: Keep this LAST so "me", "profile" or "sign-upload" aren't treated as IDs
router.get('/:id', protect, getUserProfile);

module.exports = router;