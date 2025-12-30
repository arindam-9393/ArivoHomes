const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

// Routes
const bookingRouter = require('./routes/bookingRoutes');
const propertyRouter = require('./routes/propertyRoutes');
const userRouter = require('./routes/userRoutes');

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// 1. Finalized CORS Configuration
// This allows both your local dev environment and your live Vercel site to talk to this backend.
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://arivo-homes-nir0xtba8-arivo-homes.vercel.app" 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Crucial for sending JWT tokens in headers/cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
    res.send("ArivoHomes API is running...");
});

// Using your routes
app.use('/booking', bookingRouter);
app.use('/property', propertyRouter);
app.use('/user', userRouter); 

// Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});