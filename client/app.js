const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    loadPelangganSelect();
    loadPesanan();

    // Event Submit Form Pelanggan
    const formPelanggan = document.getElementById('formPelanggan');
    if (formPelanggan) {
        formPelanggan.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const dataPelanggan = {
                no_hp: document.getElementById('pelanggan_no_hp').value,
                nama_pelanggan: document.getElementById('pelanggan_nama').value,
                alamat: document.getElementById('pelanggan_alamat').value,
                ukuran_panjang_baju: document.getElementById('p_baju').value || null,
                ukuran_lingkar_dada: document.getElementById('l_dada').value || null,
                ukuran_panjang_lengan: document.getElementById('p_lengan').value || null,
                ukuran_lebar_pundak: document.getElementById('l_pundak').value || null,
                catatan_ukuran: document.getElementById('catatan_ukuran').value || null
            };

            try {
                const res = await fetch(${API_URL}/pelanggan, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataPelanggan)
                });

                if (res.ok) {
                    alert('Pelanggan berhasil disimpan!');
                    formPelanggan.reset();
                    loadPelangganSelect();
                } else {
                    const err = await res.json();
                    alert('Gagal: ' + (err.error || 'Terjadi kesalahan'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Gagal terhubung ke server backend!');
            }
        });
    }

    // Event Submit Form Pesanan
    const formPesanan = document.getElementById('formPesanan');
    if (formPesanan) {
        formPesanan.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dataPesanan = {
                no_hp: document.getElementById('pesanan_no_hp').value,
                jenis_jahitan: document.getElementById('jenis_jahitan').value,
                deskripsi_model: document.getElementById('deskripsi_model').value,
                biaya_total: document.getElementById('biaya_total').value,
                status_pelunasan: document.getElementById('status_pelunasan').value,
                prioritas: document.getElementById('prioritas').value,
                tanggal_masuk: document.getElementById('tanggal_masuk').value,
                tanggal_deadline: document.getElementById('tanggal_deadline').value
            };

            try {
                const res = await fetch(${API_URL}/pesanan, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataPesanan)
                });

                if (res.ok) {
                    alert('Pesanan berhasil dibuat!');
                    formPesanan.reset();
                    loadPesanan();
                } else {
                    const err = await res.json();
                    alert('Gagal: ' + (err.error || 'Terjadi kesalahan'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Gagal terhubung ke server backend!');
            }
        });
    }
});

// Load Dropdown Pelanggan
async function loadPelangganSelect() {
    try {
        const res = await fetch(${API_URL}/pelanggan);
        const data = await res.json();
        
        const select = document.getElementById('pesanan_no_hp');
        if (!select) return;
        select.innerHTML = '<option value="">-- Pilih Pelanggan --</option>';
        
        data.forEach(p => {
            select.innerHTML += <option value="${p.no_hp}">${p.nama_pelanggan} (${p.no_hp})</option>;
        });
    } catch (error) {
        console.error('Gagal mengambil data pelanggan:', error);
    }
}

// Load Daftar Tabel Pesanan
async function loadPesanan() {
    try {
        const res = await fetch(${API_URL}/pesanan);
        const data = await res.json();
        
        const tbody = document.querySelector('#tabelPesanan tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Belum ada pesanan</td></tr>';
            return;
        }

        data.forEach(item => {
            const tglDeadline = item.tanggal_deadline ? new Date(item.tanggal_deadline).toLocaleDateString('id-ID') : '-';
            tbody.innerHTML += 
                <tr>
                    <td>${item.id_pesanan}</td>
                    <td>${item.nama_pelanggan || item.no_hp}</td>
                    <td>${item.jenis_jahitan}</td>
                    <td>Rp ${Number(item.biaya_total).toLocaleString('id-ID')}</td>
                    <td>${item.status_pelunasan}</td>
                    <td>${item.status_barang || 'Proses'}</td>
                    <td>${tglDeadline}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deletePesanan(${item.id_pesanan})">Hapus</button>
                    </td>
                </tr>
            ;
        });
    } catch (error) {
        console.error('Gagal mengambil data pesanan:', error);
    }
}

// Fungsi Hapus Pesanan
async function deletePesanan(id) {
    if (!confirm('Yakin ingin menghapus pesanan ini?')) return;

    try {
        const res = await fetch(${API_URL}/pesanan/${id}, { method: 'DELETE' });
        if (res.ok) {
            alert('Pesanan berhasil dihapus');
            loadPesanan();
        } else {
            alert('Gagal menghapus pesanan');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal terhubung ke server backend');
    }
}