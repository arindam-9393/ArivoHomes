const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const Booking = require('../models/Booking'); 
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2; // <--- 1. ADDED CLOUDINARY IMPORT

// --- Helper Function: Generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ==========================================
// REGISTRATION & OTP VERIFICATION
// ==========================================

// @desc    Register a new user (Sends 6-digit OTP)
// @route   POST /user/register
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

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create User (isVerified: false by default)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            role: role || 'tenant',
            otp: otp,
            otpExpire: Date.now() + 10 * 60 * 1000 // Expires in 10 mins
        });

        if (user) {
            // Send OTP Email
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

                res.status(201).json({ 
                    message: "OTP sent to your email!",
                    email: user.email 
                });
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

// @desc    Verify OTP
// @route   POST /user/verify-otp
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isVerified) return res.status(400).json({ message: "User already verified" });

        // Check OTP match and Expiry
        if (user.otp === otp && user.otpExpire > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;       // Clear OTP
            user.otpExpire = undefined; // Clear Expiry
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
// LOGIN & AUTH
// ==========================================

// @desc    Login user (With Verification Check)
// @route   POST /user/login
// @desc    Login user (With Verification Check & Google Guard)
// @route   POST /user/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });

        // If no user found
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. --- NEW CHECK: BLOCK GOOGLE USERS ---
        // If the user registered via Google, 'provider' will be 'google'
        if (user.provider === 'google') {
            return res.status(400).json({ 
                message: "You registered using Google. Please click 'Continue with Google' to login." 
            });
        }

        // 3. Check password matches
        if (await bcrypt.compare(password, user.password)) {
            
            // 4. Verification Check
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
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Auth with Google
// @route   POST /user/google
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
                name: name,
                email: email,
                password: randomPassword, 
                role: role || 'tenant', 
                phone: '',
                photo: photo,
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
// USER DATA & PROFILE
// ==========================================

// @desc    Get user data
// @route   GET /user/me
const getMe = async (req, res) => {
    res.status(200).json(req.user);
}

// @desc    Get Public Profile
// @route   GET /user/:id
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId).select('name email phone role createdAt');
        if (!user) return res.status(404).json({ message: 'User not found' });

        let history = [];

        if (user.role === 'tenant') {
            try {
                history = await Booking.find({ 
                    user: userId, 
                    status: { $in: ['Booked', 'Moved Out'] } 
                })
                .populate({
                    path: 'property',
                    select: 'title location',
                    populate: { path: 'owner', select: 'name email' }
                })
                .sort({ moveInDate: -1 });
            } catch (err) {
                console.log("Booking model likely missing or empty, skipping history.");
            }
        }

        res.status(200).json({ user, history });

    } catch (error) {
        console.error("History Fetch Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CLOUDINARY UPLOAD SIGNATURE (NEW)
// ==========================================

// @desc    Get Cloudinary Signature for secure upload
// @route   GET /user/sign-upload
const getUploadSignature = (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: 'user_profiles', // Must match frontend
    }, process.env.CLOUDINARY_API_SECRET);

    res.json({ timestamp, signature });
};

// @desc    Update User Profile (Name, Phone, Photo)
// @route   PUT /user/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.photo = req.body.photo || user.photo; // Cloudinary URL

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
// PASSWORD RESET LOGIC
// ==========================================

// @desc    Forgot Password
// @route   POST /user/forgot-password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.provider === 'google') {
        return res.status(400).json({ 
            message: "You registered with Google. Please login with Google." 
        });
      }
  
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
      await user.save();
  
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  
      const message = `
        <h1>You requested a password reset</h1>
        <p>Please go to this link to reset your password:</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
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
  
// @desc    Reset Password
// @route   PUT /user/reset-password/:token
const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  
    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid Token or Token Expired' });
      }
  
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
    getUploadSignature, // <--- 3. ADDED TO EXPORTS
    updateUserProfile
};