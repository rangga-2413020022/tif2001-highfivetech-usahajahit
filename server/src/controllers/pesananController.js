const db = require('../config/db');

// 1. Ambil semua data pesanan (digabung / JOIN dengan data pelanggan)
exports.getAllPesanan = (req, res) => {
    const query = `
        SELECT pesanan.*, pelanggan.nama_pelanggan, pelanggan.alamat 
        FROM pesanan 
        JOIN pelanggan ON pesanan.no_hp = pelanggan.no_hp 
        ORDER BY pesanan.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Berhasil mengambil data pesanan', data: results });
    });
};

// 2. Tambah pesanan baru
exports.createPesanan = (req, res) => {
    const { 
        no_hp, 
        jenis_jahitan, 
        deskripsi_model, 
        biaya_total, 
        status_pelunasan, 
        status_barang, 
        prioritas, 
        tanggal_masuk, 
        tanggal_deadline 
    } = req.body;

    if (!no_hp || !jenis_jahitan || !biaya_total || !tanggal_masuk || !tanggal_deadline) {
        return res.status(400).json({ message: 'Data wajib (No HP, Jenis Jahitan, Biaya, Tanggal Masuk & Deadline) harus diisi!' });
    }

    const query = `
        INSERT INTO pesanan (no_hp, jenis_jahitan, deskripsi_model, biaya_total, status_pelunasan, status_barang, prioritas, tanggal_masuk, tanggal_deadline) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        no_hp, 
        jenis_jahitan, 
        deskripsi_model || null, 
        biaya_total, 
        status_pelunasan || 'Belum Lunas', 
        status_barang || 'Belum Diambil', 
        prioritas || 'Biasa', 
        tanggal_masuk, 
        tanggal_deadline
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            // Jika no_hp belum terdaftar di tabel pelanggan
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: 'Nomor HP pelanggan belum terdaftar! Daftarkan pelanggan terlebih dahulu.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'Pesanan berhasil ditambahkan', 
            data: { id_pesanan: result.insertId, no_hp, jenis_jahitan } 
        });
    });
};

// 3. Update data pesanan berdasarkan id_pesanan
exports.updatePesanan = (req, res) => {
    const { id } = req.params;
    const { 
        jenis_jahitan, 
        deskripsi_model, 
        biaya_total, 
        status_pelunasan, 
        status_barang, 
        prioritas, 
        tanggal_masuk, 
        tanggal_deadline 
    } = req.body;

    const query = `
        UPDATE pesanan 
        SET jenis_jahitan = ?, deskripsi_model = ?, biaya_total = ?, status_pelunasan = ?, status_barang = ?, prioritas = ?, tanggal_masuk = ?, tanggal_deadline = ? 
        WHERE id_pesanan = ?
    `;

    const values = [
        jenis_jahitan, 
        deskripsi_model || null, 
        biaya_total, 
        status_pelunasan, 
        status_barang, 
        prioritas, 
        tanggal_masuk, 
        tanggal_deadline, 
        id
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan!' });
        }
        res.json({ message: 'Data pesanan berhasil diperbarui' });
    });
};

// 4. Hapus pesanan berdasarkan id_pesanan
exports.deletePesanan = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pesanan WHERE id_pesanan = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan!' });
        }
        res.json({ message: 'Data pesanan berhasil dihapus' });
    });
};