const express = require('express');
const router = express.Router();
const PiggybankController = require('../controllers/piggybankController');
const UserController = require('../controllers/userController');
const Middleware = require('../middlewares/middleware');

router.get('/', PiggybankController.getAllPiggybanks)
router.get('/:piggybankId', PiggybankController.getPiggybankById)
router.post('/:userId/create', PiggybankController.createPiggybankByUserId)
router.patch('/:piggybankId', PiggybankController.updatePiggybankById);
router.delete('/:piggybankId', PiggybankController.deletePiggybankById)

module.exports = router;