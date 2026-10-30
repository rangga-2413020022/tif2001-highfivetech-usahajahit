const express = require('express');
const router = express.Router();
const pelangganController = require('../controllers/pelangganController');

// Endpoint: /api/pelanggan
router.get('/', pelangganController.getAllPelanggan);
router.post('/', pelangganController.createPelanggan);

module.exports = router;