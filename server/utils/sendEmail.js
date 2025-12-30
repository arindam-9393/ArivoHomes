const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com", // 👈 Pointing to Brevo
        port: 587,
        secure: false, // Must be false for port 587
        auth: {
            user: process.env.EMAIL_USER, // Your Brevo Login Email
            pass: process.env.EMAIL_PASS, // Your Brevo Key (xsmtpsib...)
        },
    });

    const message = {
        from: `"ArivoHomes" <${process.env.EMAIL_USER}>`, // This sender must be verified in Brevo
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;