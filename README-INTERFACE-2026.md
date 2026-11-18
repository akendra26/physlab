# PhysLAB — Interface Refresh (16 November 2026)

## Ringkasan

Refresh ini mempertahankan modul fisika yang sudah ada di arsip proyek dan mengganti pengalaman beranda/navigasi menjadi gaya **modern minimalist dark** dengan aksen senja `#e89973`.

### Antarmuka baru
- Splash screen logo PhysLAB pada initial mount dengan fade + scale.
- Floating pill navbar dengan glass blur, pulse status dot, navigasi, dan switcher ID/EN.
- Hero dengan eyebrow, wordmark, tagline, randomizer 16 kutipan ilmuwan, dan CTA.
- Tombol Mulai membuka menu eksplorasi dua tahap: panel intro masuk dari tengah, bergeser ke kiri, lalu empat kartu masuk dengan stagger spring.
- Kartu mengarahkan ke modul Trivia, Simulasi Kinematika, Studi Kasus, dan Problem Set.
- Modal dapat ditutup dengan tombol X, klik backdrop, atau tombol Escape.
- Responsive layout, keyboard focus, serta `prefers-reduced-motion`.

### Modul yang dipertahankan dari source archive
- Kinematika: gerak lurus, gerak melingkar/roda-roda, jatuh bebas dengan model hambatan udara/penerjun, gerak vertikal, dan parabola.
- Dinamika: sandbox Newton 2D, Atwood, serta dinamika rotasi/kesetimbangan.
- Studi kasus dengan diorama dan workspace.
- Trivia, peta sejarah, Fun Fact, dan bank kuis konsep 50 soal.
- Problem Set dan progres latihan.

## Dependensi UI baru

Source archive awal belum memuat Tailwind CSS atau Framer Motion/Motion. Konfigurasi berikut menambahkan Tailwind CSS v4 melalui plugin Vite dan Motion for React (penerus Framer Motion; import menggunakan `motion/react`).

```bash
npm install
```

`npm install` akan menyinkronkan `package-lock.json` dengan dependensi baru. Setelah itu jalankan:

```bash
npm run dev
npm run build
npm test
```

Dependensi yang ditambahkan di `package.json`:
- `motion` `^14.14.0`
- `tailwindcss` `^4.3.5`
- `@tailwindcss/vite` `^4.3.5`

Tailwind diaktifkan melalui `@import "tailwindcss"` di `src/index.css` dan plugin Vite pada `vite.config.ts`. Styling komponen lama tetap memakai CSS modular yang sudah ada; refresh landing page memakai CSS terlokalisasi agar tidak mengubah layout simulator secara mendadak.

## Catatan lokalisasi

Switcher ID/EN melokalkan navbar, hero, splash, modal kartu, judul rute, dan footer. Isi materi/label internal pada modul pembelajaran lama masih mempertahankan Bahasa Indonesia dan istilah fisika aslinya. Itu perlu tahap lokalisasi tersendiri per modul agar tidak menerjemahkan teks ilmiah secara serampangan.

## Validasi lingkungan

Arsip yang diterima berhasil diekstrak. Paket npm baru tidak dapat diunduh dalam lingkungan pengerjaan karena akses ke `registry.npmjs.org` gagal (DNS `EAI_AGAIN`), sehingga `npm install`, build Vite penuh, dan pengujian browser sesudah penambahan Motion/Tailwind belum dapat dijalankan di sini. Jalankan perintah di atas pada mesin pengembangan yang terhubung internet.

File `package-lock.json` dari arsip awal masih tercantum; `npm install` adalah langkah pertama yang diperlukan untuk menyinkronkannya dengan `package.json` yang baru.
