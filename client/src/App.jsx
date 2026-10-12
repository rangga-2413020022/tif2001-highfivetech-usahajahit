
import React, { useState } from "react";
import "./App.css";
import Pelanggan from "./pages/pelanggan";
import Pesanan from "./pages/Pesanan";
import Login from "./pages/Login";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "pelanggan", label: "Pelanggan", icon: "♙" },
  { id: "pesanan", label: "Pesanan Jahitan", icon: "▤" },
  { id: "pengaturan", label: "Pengaturan", icon: "⚙" },
];

function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [jumlahPelanggan, setJumlahPelanggan] = useState(0);
  const [user, setUser] = useState(null);

  const pageTitle =
    menuItems.find((item) => item.id === activeMenu)?.label ||
    "Dashboard";

  function pindahMenu(menu) {
    setActiveMenu(menu);
  }

  function handleLogin(dataUser) {
    setUser(dataUser);
    setActiveMenu("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setActiveMenu("dashboard");
  }

  // Jika belum login, tampilkan halaman login.
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">J</div>
          <div>
            <strong>JahitKu</strong>
            <span>Administrasi Toko</span>
          </div>
        </div>

        <p className="sidebar-label">MENU UTAMA</p>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activeMenu === item.id ? "active" : ""
              }`}
              onClick={() => pindahMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">
            {(user.nama || user.username || "A")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div>
            <strong>{user.nama || user.username}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Administrasi / {pageTitle}
            </p>
            <h1>{pageTitle}</h1>
          </div>

          <div className="topbar-actions">
            <div className="topbar-date">
              <span>◷</span>{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Keluar ↗
            </button>
          </div>
        </header>

        {activeMenu === "dashboard" && (
          <>
            <section className="welcome-banner">
              <div>
                <p className="banner-eyebrow">
                  DASHBOARD TOKO JAHIT
                </p>
                <h2>Selamat datang kembali! 👋</h2>
                <p>
                  Pantau pesanan dan aktivitas toko jahit Anda
                  di satu tempat.
                </p>
              </div>
              <div className="banner-decoration">✂</div>
            </section>

            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-icon purple">▤</div>
                <p>Total Pesanan</p>
                <strong>—</strong>
                <span>Lihat data pada menu Pesanan</span>
              </article>

              <article className="stat-card">
                <div className="stat-icon orange">◷</div>
                <p>Dalam Pengerjaan</p>
                <strong>—</strong>
                <span>Status pesanan jahitan</span>
              </article>

              <article className="stat-card">
                <div className="stat-icon green">✓</div>
                <p>Pesanan Selesai</p>
                <strong>—</strong>
                <span>Status pesanan jahitan</span>
              </article>

              <article className="stat-card">
                <div className="stat-icon blue">♙</div>
                <p>Total Pelanggan</p>
                <strong>{jumlahPelanggan}</strong>
                <span>Pelanggan dari database</span>
              </article>
            </section>

            <section className="content-card">
              <div className="section-heading">
                <div>
                  <h2>Mulai Kelola Pesanan</h2>
                  <p>
                    Buka halaman pesanan untuk melihat dan
                    menambah pesanan jahitan.
                  </p>
                </div>

                <button
                  className="outline-button"
                  type="button"
                  onClick={() => pindahMenu("pesanan")}
                >
                  Lihat Pesanan →
                </button>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Data Pelanggan</h2>
                  <p>
                    Kelola daftar pelanggan toko jahit Anda.
                  </p>
                </div>

                <button
                  className="outline-button"
                  type="button"
                  onClick={() => pindahMenu("pelanggan")}
                >
                  Lihat Pelanggan →
                </button>
              </div>
            </section>
          </>
        )}

        {activeMenu === "pelanggan" && (
          <Pelanggan
            onJumlahPelanggan={setJumlahPelanggan}
          />
        )}

        {activeMenu === "pesanan" && <Pesanan />}

        {activeMenu === "pengaturan" && (
          <section className="content-card placeholder-page">
            <div className="placeholder-icon">⚙</div>
            <h2>Pengaturan</h2>
            <p>
              Pengaturan profil toko dan akun administrator
              akan ditambahkan setelah fitur utama selesai.
            </p>
            <span className="feature-tag">
              Tahap berikutnya
            </span>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
