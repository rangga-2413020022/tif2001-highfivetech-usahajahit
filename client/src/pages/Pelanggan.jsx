
import React, { useCallback, useEffect, useState } from "react";
import {
  getPelanggan,
  tambahPelanggan,
} from "../services/pelangganService";

export default function Pelanggan({ onJumlahPelanggan }) {
  const [pelanggan, setPelanggan] = useState([]);
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [error, setError] = useState("");
  const [pesan, setPesan] = useState("");

  const muatPelanggan = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPelanggan();
      setPelanggan(data);
      onJumlahPelanggan?.(data.length);
    } catch (err) {
      setError(
        err.message ||
          "Gagal mengambil data pelanggan. Pastikan backend berjalan."
      );
    } finally {
      setLoading(false);
    }
  }, [onJumlahPelanggan]);

  useEffect(() => {
    muatPelanggan();
  }, [muatPelanggan]);

  async function handleSubmit(event) {
    event.preventDefault();
    setPesan("");
    setError("");

    if (!nama.trim()) {
      setPesan("Nama pelanggan wajib diisi.");
      return;
    }

    setMenyimpan(true);

    try {
      await tambahPelanggan({
        nama: nama.trim(),
        telepon: telepon.trim(),
        alamat: alamat.trim(),
      });

      setNama("");
      setTelepon("");
      setAlamat("");
      setPesan("Pelanggan berhasil ditambahkan!");

      await muatPelanggan();
    } catch (err) {
      setError(err.message || "Gagal menyimpan pelanggan.");
    } finally {
      setMenyimpan(false);
    }
  }

  const pelangganTersaring = pelanggan.filter((item) =>
    `${item.nama} ${item.telepon || ""} ${item.alamat || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="pelanggan-page">
      <section className="content-card pelanggan-form-card">
        <div className="section-heading">
          <div>
            <h2>Tambah Pelanggan</h2>
            <p>Masukkan informasi pelanggan baru</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pelanggan-form">
          <div className="form-group">
            <label htmlFor="nama">Nama Pelanggan *</label>
            <input
              id="nama"
              type="text"
              placeholder="Masukkan nama pelanggan"
              value={nama}
              onChange={(event) => setNama(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telepon">Nomor Telepon</label>
            <input
              id="telepon"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={telepon}
              onChange={(event) => setTelepon(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="alamat">Alamat</label>
            <textarea
              id="alamat"
              rows="3"
              placeholder="Masukkan alamat pelanggan"
              value={alamat}
              onChange={(event) => setAlamat(event.target.value)}
            />
          </div>

          {pesan && (
            <p className="form-message" role="status">
              {pesan}
            </p>
          )}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={menyimpan}
          >
            {menyimpan ? "Menyimpan..." : "+ Simpan Pelanggan"}
          </button>
        </form>
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Daftar Pelanggan</h2>
            <p>{pelanggan.length} pelanggan tersimpan di database</p>
          </div>

          <button
            className="outline-button"
            type="button"
            onClick={muatPelanggan}
            disabled={loading}
          >
            {loading ? "Memuat..." : "↻ Muat Ulang"}
          </button>
        </div>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Cari nama, telepon, atau alamat..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading && (
          <p className="table-message">Memuat data pelanggan...</p>
        )}

        {!loading && error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Pelanggan</th>
                  <th>Telepon</th>
                  <th>Alamat</th>
                </tr>
              </thead>
              <tbody>
                {pelangganTersaring.map((item) => (
                  <tr key={item.id}>
                    <td className="order-id">{item.id}</td>
                    <td>{item.nama}</td>
                    <td>{item.telepon || "-"}</td>
                    <td>{item.alamat || "-"}</td>
                  </tr>
                ))}

                {pelangganTersaring.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      {pelanggan.length === 0
                        ? "Belum ada data pelanggan."
                        : "Pelanggan tidak ditemukan."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
