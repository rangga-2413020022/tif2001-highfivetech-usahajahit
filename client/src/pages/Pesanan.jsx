
import React, { useCallback, useEffect, useState } from "react";
import {
  getAllPesanan,
  getAllPelanggan,
  tambahPesanan,
} from "../services/pesananService";

function tanggalHariIni() {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const nilaiTanggal = String(tanggal).slice(0, 10);
  const bagian = nilaiTanggal.split("-");

  if (bagian.length !== 3) return nilaiTanggal;

  return `${bagian[2]}/${bagian[1]}/${bagian[0]}`;
}

export default function Pesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [error, setError] = useState("");
  const [pesan, setPesan] = useState("");

  const [form, setForm] = useState({
    pelanggan_id: "",
    jenis_jahitan: "",
    tanggal_masuk: tanggalHariIni(),
    tanggal_selesai: "",
    status: "Menunggu",
    catatan: "",
  });

  const muatData = useCallback(async () => {
    setMemuat(true);
    setError("");

    try {
      const [dataPesanan, dataPelanggan] = await Promise.all([
        getAllPesanan(),
        getAllPelanggan(),
      ]);

      setPesanan(dataPesanan);
      setPelanggan(dataPelanggan);
    } catch (err) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  function ubahForm(event) {
    const { name, value } = event.target;

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: value,
    }));
  }

  async function simpanPesanan(event) {
    event.preventDefault();
    setError("");
    setPesan("");

    if (!form.pelanggan_id || !form.jenis_jahitan.trim()) {
      setError("Pilih pelanggan dan isi jenis jahitan.");
      return;
    }

    if (
      form.tanggal_selesai &&
      form.tanggal_selesai < form.tanggal_masuk
    ) {
      setError("Tanggal selesai tidak boleh sebelum tanggal masuk.");
      return;
    }

    setMenyimpan(true);

    try {
      await tambahPesanan({
        ...form,
        pelanggan_id: Number(form.pelanggan_id),
        tanggal_selesai: form.tanggal_selesai || null,
      });

      setForm({
        pelanggan_id: "",
        jenis_jahitan: "",
        tanggal_masuk: tanggalHariIni(),
        tanggal_selesai: "",
        status: "Menunggu",
        catatan: "",
      });

      setPesan("Pesanan berhasil disimpan.");
      await muatData();
    } catch (err) {
      setError(err.message || "Gagal menyimpan pesanan.");
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <div className="pelanggan-page">
      <div className="pelanggan-header">
        <div>
          <h1>Pesanan Jahitan</h1>
          <p>Catat dan pantau pesanan jahitan pelanggan.</p>
        </div>

        <button
          type="button"
          className="btn-tambah"
          onClick={muatData}
          disabled={memuat}
        >
          {memuat ? "Memuat..." : "Muat Ulang"}
        </button>
      </div>

      {error && (
        <div role="alert" className="pesan-error">
          {error}
        </div>
      )}

      {pesan && (
        <div role="status" className="pesan-sukses">
          {pesan}
        </div>
      )}

      <section className="pelanggan-form">
        <h2>Tambah Pesanan Baru</h2>

        {pelanggan.length === 0 && !memuat && (
          <p>
            Belum ada pelanggan. Tambahkan data pelanggan terlebih dahulu.
          </p>
        )}

        <form onSubmit={simpanPesanan}>
          <div className="form-group">
            <label htmlFor="pelanggan_id">Pelanggan *</label>
            <select
              id="pelanggan_id"
              name="pelanggan_id"
              value={form.pelanggan_id}
              onChange={ubahForm}
              required
            >
              <option value="">-- Pilih Pelanggan --</option>
              {pelanggan.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="jenis_jahitan">Jenis Jahitan *</label>
            <input
              id="jenis_jahitan"
              name="jenis_jahitan"
              type="text"
              value={form.jenis_jahitan}
              onChange={ubahForm}
              placeholder="Contoh: Kemeja, celana, kebaya"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tanggal_masuk">Tanggal Masuk *</label>
            <input
              id="tanggal_masuk"
              name="tanggal_masuk"
              type="date"
              value={form.tanggal_masuk}
              onChange={ubahForm}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tanggal_selesai">Target Selesai</label>
            <input
              id="tanggal_selesai"
              name="tanggal_selesai"
              type="date"
              min={form.tanggal_masuk}
              value={form.tanggal_selesai}
              onChange={ubahForm}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status Pengerjaan</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={ubahForm}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Dikerjakan">Dikerjakan</option>
              <option value="Selesai">Selesai</option>
              <option value="Diambil">Diambil</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="catatan">Catatan</label>
            <textarea
              id="catatan"
              name="catatan"
              value={form.catatan}
              onChange={ubahForm}
              placeholder="Contoh: ukuran, warna kain, atau permintaan khusus"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="btn-tambah"
            disabled={menyimpan || pelanggan.length === 0}
          >
            {menyimpan ? "Menyimpan..." : "Simpan Pesanan"}
          </button>
        </form>
      </section>

      <section className="pelanggan-table-container">
        <h2>Daftar Pesanan</h2>

        {memuat ? (
          <p>Memuat data pesanan...</p>
        ) : pesanan.length === 0 ? (
          <p>Belum ada pesanan. Silakan tambahkan pesanan baru.</p>
        ) : (
          <div className="table-responsive">
            <table className="pelanggan-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Pelanggan</th>
                  <th>Jenis Jahitan</th>
                  <th>Tanggal Masuk</th>
                  <th>Target Selesai</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>

              <tbody>
                {pesanan.map((item) => (
                  <tr key={item.id}>
                    <td>{item.kode_pesanan}</td>
                    <td>{item.nama_pelanggan}</td>
                    <td>{item.jenis_jahitan}</td>
                    <td>{formatTanggal(item.tanggal_masuk)}</td>
                    <td>{formatTanggal(item.tanggal_selesai)}</td>
                    <td>{item.status || "Menunggu"}</td>
                    <td>{item.catatan || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
