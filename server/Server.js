const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require("./database/conn");
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');

require('dotenv').config();

// Allow requests from the specified origin
const corsOptions = {
    origin: 'http://localhost:3000', // Update with the origin of your frontend
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Set up express-session middleware
app.use(session({
  secret: 'letsresume@1234', // Replace 'your_secret_key' with a secret key for session encryption
  resave: false,
  saveUninitialized: false
}));

// Set up Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

// Allow anonymous access to /api/auth/user route
app.get('/api/auth/user', (req, res) => {
  // If the user is logged in, send the user data
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    // If the user is not logged in, send an anonymous user object
    res.json({
      success: true,
      user: {
        id: 'anonymous',
        username: 'anonymous',
        // Add any other fields that you might need for an anonymous user
      }
    });
  }
});

// Connect to MongoDB
connectDB();

// Example route for logging in
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true // Enable flash messages for failed login attempts
}));

// Example route for protecting a resource
app.get('/dashboard', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('dashboard', { user: req.user });
    } else {
        res.redirect('/login');
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});