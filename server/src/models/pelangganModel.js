
const db = require("../config/db");

// Mengambil semua data pelanggan
async function getAllPelanggan() {
  const [rows] = await db.query(
    "SELECT * FROM pelanggan ORDER BY id DESC"
  );

  return rows;
}

// Menambahkan pelanggan baru
async function createPelanggan(data) {
  const { nama, telepon, alamat } = data;

  const [result] = await db.query(
    "INSERT INTO pelanggan (nama, telepon, alamat) VALUES (?, ?, ?)",
    [nama, telepon || null, alamat || null]
  );

  return {
    id: result.insertId,
    nama,
    telepon: telepon || null,
    alamat: alamat || null,
  };
}

module.exports = {
  getAllPelanggan,
  createPelanggan,
};
