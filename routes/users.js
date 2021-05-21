const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const Middleware = require('../middlewares/middleware');

router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.patch('/:userId', UserController.updateUserById);
router.delete('/:userId', UserController.deleteUserById);
router.get('/:userId/piggybanks', UserController.getAllPiggybanksByUserId)

module.exports = router;