const express = require('express');
const router = express.Router();
const PiggybankController = require('../controllers/piggybankController');
const Middleware = require('../middlewares/middleware');

router.post('/:userId/create', PiggybankController.piggybankCreate)
router.get('/', PiggybankController.piggybankRead)
router.delete('/:userId/:piggybankId', PiggybankController.deletePiggybankById)

module.exports = router;