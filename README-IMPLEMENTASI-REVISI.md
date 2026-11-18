# PhysLAB — Revisi Integrasi Audio, Civilization & Aetherium

## Perubahan utama
- Global SFX didelegasikan dari root aplikasi (`src/App.tsx`) sehingga klik dan hover di landing, hub, trivia, navigasi, dan seluruh halaman simulasi memakai `useAudioSfx`.
- Aksi yang telah memiliki SFX lokal dikecualikan dari handler global untuk menghindari audio ganda.
- Project: Civilization memakai komponen humanoid SVG orisinal (`CharacterPortrait.tsx`) dengan ekspresi dan gestur yang berubah mengikuti tahap dialog.
- Alur PBL menjadi prolog → dialog bertahap → pilihan strategi → respons/animasi simulasi → ending → chapter berikutnya atau retry.
- Referensi `result` yang tidak didefinisikan pada render outcome diganti dengan label ending yang diturunkan dari state `outcome`.
- The Aetherium Archive mendapat tampilan buku digital dengan navigasi halaman, progres baca, prasyarat pembacaan, dan curve-fit threshold.
- TTS menggunakan matriks 24 × 11 dengan delapan istilah yang saling bersilangan: KINEMATIKA, DINAMIKA, PERCEPATAN, KECEPATAN, MOMENTUM, IMPULS, INERSIA, ENERGI. Clue berupa definisi konseptual.

## Verifikasi
- Sintaks TSX pada seluruh file yang diubah telah diperiksa menggunakan TypeScript `transpileModule`: lolos.
- `npm run build` belum dapat diselesaikan karena dependensi proyek tidak tersedia pada environment ini. Percobaan instalasi npm mengalami timeout, dan mode offline gagal karena beberapa paket belum tersimpan di cache.
- Setelah mengunduh arsip, jalankan:
  ```bash
  npm install
  npm run build
  npm run dev
  ```

## Catatan teknis
- Proyek mempertahankan React + Vite + Tailwind CSS + `motion/react` yang sudah ada. Tidak ada dependency baru.
- Adegan simulasi PBL memakai SVG/CSS dan animasi Motion; tidak ada canvas imperative yang perlu diinisialisasi, sehingga tidak ada risiko lifecycle canvas terlepas dari siklus render React.
- Ilustrasi karakter adalah vektor orisinal buatan komponen, bukan aset gambar eksternal.
