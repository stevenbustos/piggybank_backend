const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login
router.get('/login', AuthController.userLogin);

// Sign up
router.post('/signup', AuthController.userSignup);

module.exports = router;