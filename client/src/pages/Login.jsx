import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login gagal.");
        return;
      }

      onLogin(data.user);
    } catch (error) {
      console.error("Error login:", error);
      setError(
        "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan."
      );
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">J</div>

        <p className="login-eyebrow">ADMINISTRASI TOKO JAHIT</p>

        <h1>Selamat Datang!</h1>

        <p className="login-description">
          Masuk untuk mengelola pelanggan dan pesanan jahitan.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <div className="login-password">
              <input
                id="password"
                type={lihatPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setLihatPassword(!lihatPassword)}
              >
                {lihatPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-submit" type="submit">
            Masuk ke Dashboard
          </button>
        </form>

        <p className="login-footer">
          Administrasi Toko Jahit · Kelola usaha lebih mudah
        </p>
      </div>
    </div>
  );
}