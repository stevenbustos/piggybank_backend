const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const Middleware = require('../middlewares/middleware');

// Login
router.post('/login', AuthController.userLogin);

// Sign up
router.post('/signup', AuthController.userSignup);

// Veryfy Token
router.get('/token', Middleware.verify, (req, res) =>{
    res.status(200).json(req.user)
})

module.exports = router;