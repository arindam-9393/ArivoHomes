const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

// --- Helper: Generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ==========================================
// REGISTRATION & OTP (KEPT ORIGINAL)
// ==========================================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            role: role || 'tenant',
            otp: otp,
            otpExpire: Date.now() + 10 * 60 * 1000
        });

        if (user) {
            const message = `
                <h1>Verify Your Account</h1>
                <p>Your verification code is:</p>
                <h2 style="color: #2563eb;">${otp}</h2>
                <p>This code expires in 10 minutes.</p>
            `;
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'ArivoHomes - Verification Code',
                    html: message
                });
                res.status(201).json({ message: "OTP sent to your email!", email: user.email });
            } catch (error) {
                await User.findByIdAndDelete(user._id);
                return res.status(500).json({ message: "Email could not be sent. Registration failed." });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "User already verified" });

        if (user.otp === otp && user.otpExpire > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpire = undefined;
            await user.save();
            res.status(200).json({ message: "Email Verified Successfully! You can now login." });
        } else {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// LOGIN
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (user.provider === 'google') {
            return res.status(400).json({ message: "You registered using Google. Please click 'Continue with Google' to login." });
        }

        if (await bcrypt.compare(password, user.password)) {
            if (!user.isVerified) {
                return res.status(401).json({ message: "Account not verified. Please verify your email first." });
            }
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ==========================================
// GOOGLE AUTH CONTROLLER
// ==========================================
const googleAuth = async (req, res) => {
    try {
        const { name, email, photo, role } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                provider: user.provider,
                token: generateToken(user._id),
            });
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: role || 'tenant',
                photo,
                provider: 'google',
                isVerified: true
            });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ==========================================
// PROFILE & DATA
// ==========================================
const getMe = async (req, res) => {
    res.status(200).json(req.user);
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('name email phone role createdAt');
        if (!user) return res.status(404).json({ message: 'User not found' });

        let history = [];
        if (user.role === 'tenant') {
            try {
                history = await Booking.find({ user: userId, status: { $in: ['Booked', 'Moved Out'] } })
                    .populate({ path: 'property', select: 'title location', populate: { path: 'owner', select: 'name email' } })
                    .sort({ moveInDate: -1 });
            } catch (err) { }
        }
        res.status(200).json({ user, history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUploadSignature = (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: 'user_profiles',
    }, process.env.CLOUDINARY_API_SECRET);
    res.json({ timestamp, signature });
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.photo = req.body.photo || user.photo;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                photo: updatedUser.photo,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// PASSWORD RESET (FIXED LINK HERE) 🔧
// ==========================================
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.provider === 'google') return res.status(400).json({ message: "Login with Google instead." });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // ✅ FIX: Use Vercel Link for production, localhost for dev
        const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
        const resetUrl = `${clientURL}/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset</h1>
            <p>Click below to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'ArivoHomes Password Reset',
                html: message,
            });
            res.status(200).json({ success: true, data: 'Email Sent' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: 'Invalid or Expired Token' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, data: 'Password Updated Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    getMe,
    getUserProfile,
    googleAuth,
    forgotPassword,
    resetPassword,
    getUploadSignature,
    updateUserProfile
};