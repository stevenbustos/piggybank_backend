const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Login
router.get('/login', UserController.userLogin);

// Sign up
router.post('/signup', UserController.createUser);

module.exports = router;