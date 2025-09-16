const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerRest);
router.post('/login', authController.loginRest);
router.get('/ping', authController.pingRest);
router.get('/metrics', authController.metricsRest);
router.get('/health', authController.healthRest);

module.exports = router;
