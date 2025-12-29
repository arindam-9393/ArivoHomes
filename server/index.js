const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors'); // <--- 1. Import CORS

// Routes
const bookingRouter = require('./routes/bookingRoutes');
const propertyRouter = require('./routes/propertyRoutes');
const userRouter = require('./routes/userRoutes');

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// <--- 2. Configure CORS (Must be before routes)
app.use(cors({
  origin: "*", // <--- Allow any domain (Change this back to your specific URL later if you want)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
    res.send("ArivoHomes API is running...");
});

// Note: This matches your frontend call: https://arivohomes.onrender.com/user/google
app.use('/booking', bookingRouter);
app.use('/property', propertyRouter);
app.use('/user', userRouter); 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
