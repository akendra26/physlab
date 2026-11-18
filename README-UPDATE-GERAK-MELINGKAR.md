# PhysLAB — Update Modul Gerak Melingkar

## Ringkasan

Pembaruan ini memusatkan revisi pada menu Gerak Melingkar dan visualisasi Gear System. Struktur proyek React/Vite yang lain dipertahankan.

### Perubahan utama

1. **Tiga kartu menu independen** di bagian atas: GMB, GMBB, dan Gear System. Klik kartu menampilkan modul yang bersangkutan secara dinamis. Kartu tersusun tiga kolom pada desktop dan menjadi satu kolom pada layar sempit.
2. **Geometri seporos yang benar**: roda yang terhubung seporos memakai koordinat pusat SVG yang sama persis. Pasangan/kelompok poros konsentris digambar dari radius terbesar ke terkecil dengan opasitas dan ketebalan garis berbeda. Penempatan kelompok roda juga memperhitungkan radius luar agar visual tidak saling menembus.
3. **Kartu nilai output** untuk setiap roda berisi radius, kecepatan sudut `ω`, dan kelajuan tangensial `v`, dengan latar zinc gelap, border, padding, rounded-xl, serta tipografi monospaced.
4. **Penyelarasan UI**: parameter dua kolom, dropdown relasi sejajar, ringkasan transmisi memiliki jarak yang cukup, dan toolbar playback terpisah rapi.

## File yang diubah/ditambahkan

- `src/features/kinematika/gerak-melingkar/GerakMelingkarSimulasi.tsx`
- `src/features/kinematika/gerak-melingkar/RodaRodaSimulasi.tsx`
- `src/features/kinematika/gerak-melingkar/mesinRodaRoda.ts` (baru)
- `src/features/kinematika/gerak-melingkar/mesinRodaRoda.test.ts` (baru)
- `src/App.css`

## Asumsi model transmisi

- Seporos: `ω₂ = ω₁`.
- Bersinggungan langsung: `ω₂ = -ω₁ r₁/r₂`.
- Sabuk terbuka: `ω₂ = +ω₁ r₁/r₂`.
- Kelajuan tangensial setiap roda: `v = |ω|r`.

Model mengasumsikan kontak ideal, tidak ada slip pada sabuk/kontak, serta roda seporos terkunci pada poros kaku.

## Validasi

- Sintaks TS/TSX pada empat file terkait diperiksa menggunakan TypeScript parser dan dinyatakan valid.
- Model geometri/kinematika diuji dengan 41 assertion manual mencakup sembilan kombinasi pasangan relasi, pusat seporos identik, jarak kelompok, dan rasio kecepatan.
- Vitest dan production build belum dijalankan pada lingkungan ini karena dependensi proyek (`node_modules`) tidak tersedia dalam arsip kerja.

## Menjalankan proyek

Dari direktori root proyek:

```bash
npm ci
npm run dev
```

Validasi di mesin lokal:

```bash
npm run build
npm test
npm run lint
```
