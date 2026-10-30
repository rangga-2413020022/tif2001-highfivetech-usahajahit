const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

// Endpoint: /api/pesanan
router.get('/', pesananController.getAllPesanan);
router.post('/', pesananController.createPesanan);

module.exports = router;