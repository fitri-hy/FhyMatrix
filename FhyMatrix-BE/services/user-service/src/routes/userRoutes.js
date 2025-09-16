const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.listUsersRest);
router.get('/:id', userController.getUserRest);
router.get('/ping', userController.pingRest);
router.get('/metrics', userController.metricsRest);
router.get('/health', userController.healthRest);

module.exports = router;
