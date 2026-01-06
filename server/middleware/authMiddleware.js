const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get user from DB
            req.user = await User.findById(decoded.id).select('-password');

            // 🛑 CRITICAL FIX: Check if user actually exists
            if (!req.user) {
                return res.status(401).json({ message: 'User not found (Account may be deleted)' });
            }

            next(); // Only proceed if user exists
        } catch (error) {
            console.error("Auth Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };