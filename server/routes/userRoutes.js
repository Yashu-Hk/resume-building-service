// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById); // Get user by ID
router.post('/', userController.createUser); // Post user details
router.put('/:id', userController.updateUserById); //Put user details by ID
router.delete('/:id', userController.deleteUserById); //Delete user by ID

module.exports = router;