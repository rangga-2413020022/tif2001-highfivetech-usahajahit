const express = require('express');
const router = express.Router();
const pelangganController = require('../controllers/pelangganController');

// Endpoint: /api/pelanggan
router.get('/', pelangganController.getAllPelanggan);
router.post('/', pelangganController.createPelanggan);
router.put('/:no_hp', pelangganController.updatePelanggan);
router.delete('/:no_hp', pelangganController.deletePelanggan);

module.exports = router;