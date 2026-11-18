# PhysLAB — Studi Kasus: Project Constellation

## Perubahan
- Mengganti total halaman Studi Kasus lama dengan portal dua hub: Project: Constellation (PBL) dan Research Hub (RBL, terkunci/Coming Soon).
- Menambahkan intro kosmik fading/zoom, bintang konstelasi, dan transisi portal.
- Membangun alur visual-novel: pengenalan masalah Pak Tono, dialog Pak Tono–Arka–Nara, pilihan Rute A/B/C, sub-pilihan desain, animasi gerobak, dan tiga kategori ending.
- Menambahkan model gaya sepanjang bidang miring untuk menghitung resultan gaya dan percepatan pada hasil uji.
- Melokalkan antarmuka dan dialog berdasarkan `BahasaContext` (`id`/`en`).
- Menghapus komponen dan data Studi Kasus lama yang tidak lagi digunakan.

## File utama
- `src/features/studi-kasus/StudiKasusPage.tsx`
- `src/features/studi-kasus/StudiKasus.css`

## Menjalankan proyek
```bash
npm install
npm run dev
```

## Catatan validasi
Sintaks TSX telah diperiksa melalui TypeScript transpilation. Build penuh `npm run build` belum dapat diverifikasi di lingkungan penyuntingan ini karena proses instalasi dependensi (`npm ci`) mengalami timeout; jalankan `npm install` lalu `npm run build` di lingkungan lokal untuk validasi akhir.

Model fisika pada cerita merupakan model edukatif sederhana: gaya resultan sepanjang bidang miring dihitung dari gaya dorong dikurangi komponen berat sejajar bidang dan gaya gesek kinetik/efektif. Model ini bukan sertifikasi keselamatan rancangan gerobak nyata.
