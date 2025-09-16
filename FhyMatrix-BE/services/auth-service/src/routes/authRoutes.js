const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// REST endpoints
router.post('/register', authController.registerRest); // Register user
router.post('/login', authController.loginRest);       // Login user
router.get('/ping', authController.pingRest);         // Ping service
router.get('/metrics', authController.metricsRest);   // Metrics
router.get('/health', authController.healthRest);     // Health

module.exports = router;
