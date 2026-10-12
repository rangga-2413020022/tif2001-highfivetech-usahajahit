
const db = require("../config/db");
const bcrypt = require("bcrypt");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi.",
      });
    }

    const [users] = await db.execute(
      "SELECT id, nama, username, password FROM users WHERE username = ? LIMIT 1",
      [username.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Username atau password salah.",
      });
    }

    const user = users[0];
    const passwordCocok = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCocok) {
      return res.status(401).json({
        message: "Username atau password salah.",
      });
    }

    return res.json({
      message: "Login berhasil.",
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
}

module.exports = { login };
