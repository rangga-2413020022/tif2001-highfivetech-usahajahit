
const API_URL = "http://localhost:3000/api/pelanggan";

export async function getPelanggan() {
  const response = await fetch(API_URL);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data pelanggan");
  }

  return result.data;
}

export async function tambahPelanggan(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan pelanggan");
  }

  return result.data;
}
