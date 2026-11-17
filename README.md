# PhysLAB — Major Revision Trivia, Fun Fact, Peta, dan Kuis

Paket ini adalah patch untuk folder `src/features/trivia-kuis/` pada proyek PhysLAB yang sudah ada. Tidak membuat proyek baru dan tidak menambahkan dependensi eksternal.

## Isi patch

- `TriviaKuisPage.tsx`: mengganti tab Trivia Sejarah menjadi Fun Fact Mekanika, Peta Penemuan, dan Kuis Konsep & Trivia.
- `FunFactMekanika.tsx` + `dataFunFactMekanika.ts` + `FunFactMekanika.css`: buku fun fact dua halaman dengan navigasi halaman dan sumber bacaan.
- `PetaSejarahFisika.tsx` + `PetaSejarahFisika.css`: tanpa inset Eropa; peta dapat di-pan dengan klik kiri/drag, zoom dengan tombol atau roda tetikus, pinpoint bercahaya, leader line untuk titik Eropa yang berdekatan, pop-up, toggle detail, tracker putus-putus, kartu tilt dan flip 3D.
- `KuisFisika.tsx` + `dataKuis.ts`: mengganti bank soal lama dengan tepat 50 soal pilihan ganda konseptual/trivia, urutan acak per sesi, feedback instan, skor langsung, ringkasan, dan nilai terbaik tersimpan di localStorage.
- `TriviaKuis.css`: styling tab dan kuis tambahan.

## Cara memasang

Timpa file dengan nama yang sama pada:

`src/features/trivia-kuis/`

Pastikan file data peta yang sudah ada tetap tersedia:

`src/features/trivia-kuis/dataPetaSejarah.ts`

Tidak perlu mengubah `App.tsx`, Sidebar, atau konfigurasi navigasi karena halaman Trivia sudah memuat `TriviaKuisPage`.

Jalankan dari root proyek:

```bash
npm run build
npm run dev
```

## Catatan kompatibilitas

Proyek yang diperiksa menggunakan React + Vite dan belum memasang Tailwind CSS atau Framer Motion. Implementasi ini memakai CSS modular dan React API bawaan agar tidak membutuhkan dependensi tambahan.

## Verifikasi pada lingkungan kerja

- TypeScript khusus aplikasi: lulus (`tsc --noEmit -p tsconfig.check.json`).
- Pemeriksaan bank soal: 50 ID unik; setiap soal memiliki 4 opsi, kunci dalam rentang 0–3, dan pembahasan.
- CSS parsing: tidak ditemukan kesalahan sintaks.
- Build Vite penuh belum dapat dijalankan di lingkungan ekstraksi karena Vite CLI/dependensi node_modules tidak tersedia secara lengkap.

## Dokumen Penjelasan Pemasangan Kodingan
- https://drive.google.com/drive/folders/10-gdk9_xRc1r8i62xgR_lzheeqo0Kj-x?usp=sharing
