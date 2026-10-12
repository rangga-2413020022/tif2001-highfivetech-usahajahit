
const pelangganModel = require("../models/pelangganModel");

// Menampilkan semua pelanggan
async function getAllPelanggan(req, res) {
  try {
    const pelanggan = await pelangganModel.getAllPelanggan();

    res.json({
      status: "success",
      data: pelanggan,
    });
  } catch (error) {
    console.error("Gagal mengambil pelanggan:", error.message);

    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pelanggan.",
    });
  }
}

// Menambahkan pelanggan
async function createPelanggan(req, res) {
  try {
    const { nama, telepon, alamat } = req.body;

    if (!nama || !nama.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Nama pelanggan wajib diisi.",
      });
    }

    const pelanggan = await pelangganModel.createPelanggan({
      nama: nama.trim(),
      telepon,
      alamat,
    });

    res.status(201).json({
      status: "success",
      message: "Pelanggan berhasil ditambahkan.",
      data: pelanggan,
    });
  } catch (error) {
    console.error("Gagal menambahkan pelanggan:", error.message);

    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan data pelanggan.",
    });
  }
}

module.exports = {
  getAllPelanggan,
  createPelanggan,
};
