
const pesananModel = require("../models/pesananModel");

// Menampilkan semua pesanan
async function getAllPesanan(req, res) {
  try {
    const pesanan = await pesananModel.getAllPesanan();

    res.json({
      status: "success",
      data: pesanan,
    });
  } catch (error) {
    console.error("Gagal mengambil pesanan:", error.message);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pesanan.",
    });
  }
}

// Menambahkan pesanan baru
async function createPesanan(req, res) {
  try {
    const {
      pelanggan_id,
      jenis_jahitan,
      tanggal_masuk,
      tanggal_selesai,
      status,
      catatan,
    } = req.body;

    // Validasi data wajib
    if (!pelanggan_id || !jenis_jahitan || !jenis_jahitan.trim() || !tanggal_masuk) {
      return res.status(400).json({
        status: "error",
        message: "Pelanggan, jenis jahitan, dan tanggal masuk wajib diisi.",
      });
    }

    // Buat kode pesanan otomatis
    const kode_pesanan =
      "PSN-" +
      Date.now().toString() +
      "-" +
      Math.floor(Math.random() * 1000).toString().padStart(3, "0");

    const pesanan = await pesananModel.createPesanan({
      kode_pesanan,
      pelanggan_id,
      jenis_jahitan: jenis_jahitan.trim(),
      tanggal_masuk,
      tanggal_selesai: tanggal_selesai || null,
      status: status || "Menunggu",
      catatan,
    });

    res.status(201).json({
      status: "success",
      message: "Pesanan berhasil ditambahkan.",
      data: pesanan,
    });
  } catch (error) {
    console.error("Gagal menambahkan pesanan:", error.message);

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan data pesanan.",
    });
  }
}

module.exports = {
  getAllPesanan,
  createPesanan,
};
