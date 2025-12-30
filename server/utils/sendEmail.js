const axios = require('axios');

const sendEmail = async (options) => {
    // 1. The Brevo API URL (Port 443 - Always Open on Render)
    const url = "https://api.brevo.com/v3/smtp/email";
    
    // 2. The Data Payload
    const data = {
        sender: { 
            name: "ArivoHomes", 
            email: process.env.EMAIL_USER // Must match your Brevo login email
        }, 
        to: [{ 
            email: options.email,
            name: options.email 
        }],
        subject: options.subject,
        htmlContent: options.html // Note: Brevo API uses 'htmlContent', NOT 'html'
    };

    // 3. The Headers (Authentication)
    const config = {
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY, // Uses the NEW key
            'content-type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, data, config);
        console.log("✅ Email sent via API! ID:", response.data.messageId);
        return true;
    } catch (error) {
        console.error("❌ API Email Failed:", error.response ? error.response.data : error.message);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;