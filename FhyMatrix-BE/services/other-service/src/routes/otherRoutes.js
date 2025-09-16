const express = require('express');
const router = express.Router();
const otherController = require('../controllers/otherController');

router.get('/ping', otherController.pingRest);
router.get('/metrics', otherController.metricsRest);
router.get('/health', otherController.healthRest);

module.exports = router;
