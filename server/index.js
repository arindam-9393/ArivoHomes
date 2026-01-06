// const express = require('express');
// const dotenv = require('dotenv').config();
// const connectDB = require('./config/db');
// const cors = require('cors');

// // Routes

// const bookingRouter = require('./routes/bookingRoutes');
// const propertyRouter = require('./routes/propertyRoutes');
// const userRouter = require('./routes/userRoutes');

// // Connect to Database
// connectDB();

// const app = express();
// const port = process.env.PORT || 3000;

// // Inside server.js
// app.use('/api/notifications', require('./routes/notificationRoutes'));

// // Middleware
// // 1. Finalized CORS Configuration
// // This allows both your local dev environment and your live Vercel site to talk to this backend.
// app.use(cors({
//   origin: true, // Allows any origin
//   credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API Routes
// app.get('/', (req, res) => {
//     res.send("ArivoHomes API is running...");
// });

// // Using your routes
// app.use('/booking', bookingRouter);
// app.use('/property', propertyRouter);
// app.use('/user', userRouter); 

// // Start Server
// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });/




const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

// Routes
const bookingRouter = require('./routes/bookingRoutes');
const propertyRouter = require('./routes/propertyRoutes');
const userRouter = require('./routes/userRoutes');
const notificationRouter = require('./routes/notificationRoutes'); // <--- 1. Import it here cleanly

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware (MUST BE AT THE TOP)
app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json()); // <--- This must run BEFORE routes
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
    res.send("ArivoHomes API is running...");
});

// Using your routes
app.use('/booking', bookingRouter);
app.use('/property', propertyRouter);
app.use('/user', userRouter); 

// 2. FIX: Mount it as '/notifications' (No /api prefix)
app.use('/notifications', notificationRouter); 

// Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});