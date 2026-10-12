
const db = require("../config/db");

// Mengambil semua data pesanan beserta nama pelanggan
async function getAllPesanan() {
  const [rows] = await db.query(`
    SELECT
      pesanan.id,
      pesanan.kode_pesanan,
      pesanan.pelanggan_id,
      pelanggan.nama AS nama_pelanggan,
      pesanan.jenis_jahitan,
      pesanan.tanggal_masuk,
      pesanan.tanggal_selesai,
      pesanan.status,
      pesanan.catatan,
      pesanan.created_at
    FROM pesanan
    INNER JOIN pelanggan
      ON pesanan.pelanggan_id = pelanggan.id
    ORDER BY pesanan.id DESC
  `);

  return rows;
}

// Menambahkan pesanan baru
async function createPesanan(data) {
  const {
    kode_pesanan,
    pelanggan_id,
    jenis_jahitan,
    tanggal_masuk,
    tanggal_selesai,
    status,
    catatan,
  } = data;

  const [result] = await db.query(
    `INSERT INTO pesanan (
      kode_pesanan,
      pelanggan_id,
      jenis_jahitan,
      tanggal_masuk,
      tanggal_selesai,
      status,
      catatan
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      kode_pesanan,
      pelanggan_id,
      jenis_jahitan,
      tanggal_masuk,
      tanggal_selesai || null,
      status || "Menunggu",
      catatan || null,
    ]
  );

  return {
    id: result.insertId,
    kode_pesanan,
    pelanggan_id,
    jenis_jahitan,
    tanggal_masuk,
    tanggal_selesai: tanggal_selesai || null,
    status: status || "Menunggu",
    catatan: catatan || null,
  };
}

module.exports = {
  getAllPesanan,
  createPesanan,
};
