const db = require('../config/db');

// 1. Ambil semua data pelanggan
exports.getAllPelanggan = (req, res) => {
    const query = 'SELECT * FROM pelanggan ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Berhasil mengambil data pelanggan', data: results });
    });
};

// 2. Tambah pelanggan baru (no_hp sebagai PK)
exports.createPelanggan = (req, res) => {
    const { 
        no_hp, 
        nama_pelanggan, 
        alamat, 
        ukuran_panjang_baju, 
        ukuran_lingkar_dada, 
        ukuran_panjang_lengan, 
        ukuran_lebar_pundak, 
        catatan_ukuran 
    } = req.body;

    if (!no_hp || !nama_pelanggan) {
        return res.status(400).json({ message: 'Nomor HP dan Nama Pelanggan wajib diisi!' });
    }

    const query = `
        INSERT INTO pelanggan (no_hp, nama_pelanggan, alamat, ukuran_panjang_baju, ukuran_lingkar_dada, ukuran_panjang_lengan, ukuran_lebar_pundak, catatan_ukuran) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        no_hp, 
        nama_pelanggan, 
        alamat || null, 
        ukuran_panjang_baju || null, 
        ukuran_lingkar_dada || null, 
        ukuran_panjang_lengan || null, 
        ukuran_lebar_pundak || null, 
        catatan_ukuran || null
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Nomor HP sudah terdaftar sebagai pelanggan lain!' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pelanggan berhasil ditambahkan', data: { no_hp, nama_pelanggan } });
    });
};

// 3. Update data pelanggan berdasarkan no_hp
exports.updatePelanggan = (req, res) => {
    const { no_hp } = req.params;
    const { 
        nama_pelanggan, 
        alamat, 
        ukuran_panjang_baju, 
        ukuran_lingkar_dada, 
        ukuran_panjang_lengan, 
        ukuran_lebar_pundak, 
        catatan_ukuran 
    } = req.body;

    const query = `
        UPDATE pelanggan 
        SET nama_pelanggan = ?, alamat = ?, ukuran_panjang_baju = ?, ukuran_lingkar_dada = ?, ukuran_panjang_lengan = ?, ukuran_lebar_pundak = ?, catatan_ukuran = ? 
        WHERE no_hp = ?
    `;

    const values = [
        nama_pelanggan, 
        alamat || null, 
        ukuran_panjang_baju || null, 
        ukuran_lingkar_dada || null, 
        ukuran_panjang_lengan || null, 
        ukuran_lebar_pundak || null, 
        catatan_ukuran || null, 
        no_hp
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelanggan tidak ditemukan!' });
        }
        res.json({ message: 'Data pelanggan berhasil diperbarui' });
    });
};

// 4. Hapus pelanggan berdasarkan no_hp
exports.deletePelanggan = (req, res) => {
    const { no_hp } = req.params;
    const query = 'DELETE FROM pelanggan WHERE no_hp = ?';

    db.query(query, [no_hp], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelanggan tidak ditemukan!' });
        }
        res.json({ message: 'Data pelanggan berhasil dihapus' });
    });
};