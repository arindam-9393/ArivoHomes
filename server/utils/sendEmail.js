const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1. Create Transporter with "Secure" settings for Production
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,        // <--- CRITICAL: Use 465 for Production
        secure: true,     // <--- CRITICAL: Must be true for port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // 2. Add this "tls" block to prevent certificate errors on some cloud servers
        tls: {
            rejectUnauthorized: false
        }
    });

    // 3. Define the email options
    const message = {
        from: `"ArivoHomes Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 4. Send the email
    const info = await transporter.sendMail(message);
    
    console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;