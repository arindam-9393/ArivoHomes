const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,        // Switching to 587 (TLS)
        secure: false,    // Must be false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false
        }
    });

    const message = {
        from: `"ArivoHomes" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;