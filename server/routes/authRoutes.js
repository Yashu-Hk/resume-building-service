// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/user', authController.getCurrentUser);

module.exports = router;