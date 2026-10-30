const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

// Endpoint: /api/pesanan
router.get('/', pesananController.getAllPesanan);
router.post('/', pesananController.createPesanan);
router.put('/:id', pesananController.updatePesanan);
router.delete('/:id', pesananController.deletePesanan);

module.exports = router;