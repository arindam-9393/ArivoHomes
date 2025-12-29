const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect using the URI from your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails, log the error and stop the server
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;