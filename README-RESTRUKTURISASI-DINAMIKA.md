# PhysLAB — Restrukturisasi Hub Dinamika

## Menu utama Dinamika

1. **Dinamika Newton** — subtab Permukaan Datar, Bidang Miring, dan Tumbukan & Momentum.
2. **Osilasi** — sistem pegas teredam dan bandul.
3. **Katrol Atwood** — sistem dua massa, tegangan, dan percepatan.
4. **Lift** — gaya normal dan berat semu pada elevator.

## Perubahan implementasi

- ID modul Dinamika disederhanakan menjadi `newton`, `osilasi`, `atwood`, dan `lift`.
- Rute menyimpan modul aktif pada hash, misalnya `#dinamika/newton`.
- Analisis gaya pada permukaan datar menerima sudut `θ` dan menghitung `Fₓ = F cos θ`, `Fᵧ = F sin θ`, serta `N = max(0, mg − Fᵧ)`.
- Komponen gaya dan vektor resultan ditampilkan sebagai panah pada SVG.
- Komponen UI Sandbox 2D dan Rotasi/Kesetimbangan dihapus dari menu dan source fitur Dinamika.
- Referensi studi kasus ke modul rotasi yang sudah dihapus dilepas agar tidak mengarah ke rute yang tidak valid.

## Pengujian

- Pemeriksaan sintaks TypeScript/TSX dengan TypeScript transpile API.
- Smoke test mesin fisika untuk dekomposisi gaya, normal force, bidang miring, tumbukan, dan osilasi.
- `npm ci` tidak selesai dalam batas waktu lingkungan pengerjaan; karena itu `npm run build` dan Vitest belum dapat dijalankan di sini.
