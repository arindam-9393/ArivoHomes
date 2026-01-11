// const mongoose = require('mongoose');

// const userSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String, default: '' },
//     role: { type: String, enum: ['owner', 'tenant'], default: 'tenant' },
//     provider: { type: String, default: 'local' },

//     isVerified: { type: Boolean, default: false },
    
//     // --- OTP FIELDS ---
//     otp: String,
//     otpExpire: Date,
    
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // UPDATED: Made phone required since you ask for it now
    phone: { type: String, required: true }, 
    
    role: { type: String, enum: ['owner', 'tenant'], default: 'tenant' },
    provider: { type: String, default: 'local' },

    isVerified: { type: Boolean, default: false },
    
    // --- OTP FIELDS ---
    otp: String,
    otpExpire: Date,
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);