# Revisi Mayor Modul Dinamika — PhysicsLab

Paket ini hanya berisi komponen dan mesin fisika yang direvisi. Ini bukan proyek baru dan tidak memuat ulang aplikasi PhysicsLab.

## Penempatan

Salin seluruh isi folder `src/features/dinamika/` dari paket ini ke folder `src/features/dinamika/` pada proyek PhysicsLab yang sudah ada, lalu izinkan file dengan nama sama untuk ditimpa.

`DinamikaPage.tsx` yang sudah ada tetap digunakan karena sudah mengimpor tiga simulasi dan `Dinamika.css`.

## File yang disertakan

- `HukumNewtonSimulasi.tsx` — gaya 2D, blok bebas, drag, momentum, tumbukan dan stacking.
- `SistemDinamikaSimulasi.tsx` — Atwood dan lift bergerak, gaya yang mengikuti kabin, partikel udara.
- `DinamikaRotasiSimulasi.tsx` — banyak titik gaya, poros tetap/bebas, rotasi benda tegar.
- `mesinDinamika.ts` — persamaan dan solver kontak 2D.
- `GrafikWaktuNyata.tsx` — grafik Canvas dengan cap waktu sampel.
- `KontrolSimulasiDinamika.tsx` dan `useJamSimulasi.ts` — kontrol waktu simulasi.
- `interaksiSvg.ts` — konversi pointer ke koordinat SVG dan fungsi pembatas nilai.
- `Dinamika.css` — gaya tampilan tambahan.
- `mesinDinamika.test.ts` — unit test Vitest.

## Model dan batasan fisika

- Sandbox translasi memakai balok AABB (persegi panjang tanpa rotasi tiap balok), impuls normal, restitusi, gesekan kontak sederhana, dan beberapa iterasi koreksi penetrasi. Ini cocok untuk demonstrasi konseptual tumbukan dan penumpukan, bukan solver rigid-body rekayasa presisi tinggi.
- Bidang sandbox merupakan garis kontak satu sisi tak berujung; koordinat layar memakai sumbu y positif ke bawah.
- Katrol Atwood mengasumsikan tali ringan tak mulur, katrol ideal, dan menghentikan massa saat menyentuh lantai dasar.
- Lift memakai kontrol percepatan/pengereman bertahap menuju posisi tujuan. Berat normal dibatasi nol saat kontak lantai hilang.
- Rotasi menghitung torsi terhadap poros tetap dengan teorema sumbu sejajar, atau terhadap pusat massa pada mode bebas. Modul ini memvisualisasikan derajat kebebasan rotasi; perpindahan translasi pusat massa tidak ditampilkan.
- Grafik menampilkan histori sampel simulasi. Skala vertikal tiap seri dinormalisasi secara mandiri agar tiap kurva terlihat.

## Verifikasi

Mesin `mesinDinamika.ts` lolos pemeriksaan TypeScript strict. Komponen TSX lolos pemeriksaan sintaks/tipe menggunakan deklarasi sementara karena arsip kerja ini tidak menyertakan `package.json`, dependensi React, maupun beberapa komponen bersama proyek. Uji numerik manual mencakup Atwood, kontinuitas lift, kontak lantai, tumbukan samping, stacking, dan torsi multipoint. Build Vite/Vitest penuh perlu dijalankan di salinan proyek lengkap milikmu.
