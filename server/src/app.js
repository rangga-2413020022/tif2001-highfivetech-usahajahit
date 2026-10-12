
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pelangganRoutes = require("./routes/pelangganRoutes");
const pesananRoutes = require("./routes/pesananRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Route API
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/pesanan", pesananRoutes);

// Halaman pemeriksaan server
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend Administrasi Toko Jahit aktif!",
  });
});

// Endpoint pemeriksaan API
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server berjalan dengan baik",
  });
});

// Pemeriksaan koneksi database
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS hasil");

    res.json({
      status: "success",
      message: "Koneksi database berhasil!",
      data: rows,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      status: "error",
      message: "Koneksi database gagal.",
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
