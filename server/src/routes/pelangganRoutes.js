
const express = require("express");
const router = express.Router();

const pelangganController = require("../controllers/pelangganController");

// GET: mengambil semua pelanggan
router.get("/", pelangganController.getAllPelanggan);

// POST: menambahkan pelanggan
router.post("/", pelangganController.createPelanggan);

module.exports = router;
