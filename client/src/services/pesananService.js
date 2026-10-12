
const API_URL = "http://localhost:3000/api/pesanan";
const PELANGGAN_API_URL = "http://localhost:3000/api/pelanggan";

// Mengambil semua pesanan
export async function getAllPesanan() {
  const response = await fetch(API_URL);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data pesanan");
  }

  return result.data;
}

// Mengambil daftar pelanggan untuk pilihan formulir
export async function getAllPelanggan() {
  const response = await fetch(PELANGGAN_API_URL);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data pelanggan");
  }

  return result.data;
}

// Menambahkan pesanan
export async function tambahPesanan(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan pesanan");
  }

  return result.data;
}
