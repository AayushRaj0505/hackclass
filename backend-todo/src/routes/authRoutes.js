const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected auth route
router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;
