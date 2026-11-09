# PhysLAB — Revisi Terpadu

Paket ini menyatukan pembaruan layout eksperimen, Kinematika, Dinamika, Studi Kasus, dan modul Trivia.

## Paket

- `PhysLAB-Revisi-Terpadu-Patch.zip`: hanya file yang diubah/ditambahkan. Ekstrak ke folder proyek PhysLAB yang sudah ada, izinkan penimpaan file, dan pertahankan file lain.
- `PhysLAB-Source-Terpadu.zip`: salinan source proyek lengkap (tanpa `node_modules`), berguna sebagai snapshot utuh.
- `KODE-LENGKAP.md` dan `KODE-LENGKAP.txt`: isi penuh seluruh 37 file patch, dengan path penempatan.

## Isi revisi

### Global experiment layout
- Panel pengatur eksperimen diletakkan sebelum visualisasi.
- Parameter slider dipasangkan dengan input angka; input dan slider menyinkronkan nilai.
- Kontrol waktu mendukung mode berbatas dan `Tanpa batas`.
- Grid parameter menggunakan `auto-fit`/`minmax`; panel grafik memakai proporsi 1,618:1 dan menumpuk pada layar sempit.
- Grafik ditempatkan sebelum panel model matematika melalui urutan layout.

### Kinematika
- GLB/GLBB: kontrol Mulai/Jeda, Stop, Reset, batas kanvas, serta toggle sumbu.
- Parabola: rotary dial dan input numerik sudut 0°–360°. Rentang sumbu horizontal dipra-hitung dari amplop semua sudut sehingga perubahan sudut tidak mengubah zoom.
- Roda-r roda: tiga roda dengan hubungan seporos, bersinggungan, dan sabuk/rantai; kecepatan sudut dan tangensial diperbarui dari relasi jari-jari.
- GJB: animasi penerjun dengan gaya hambat udara kuadratik, perubahan luas hambat saat parasut terbuka, dan pembacaan kecepatan terminal. Grafik konvensional GJB diganti visual penerjun.

### Dinamika
- Sandbox 2D memiliki batas area, banyak balok, tumbukan, drag gaya, dan parameter ganda.
- Katrol Atwood mendukung pengaturan massa m1 melalui drag dan parameter, dengan tegangan serta percepatan dihitung ulang.
- Lift memiliki animasi karakter/vektor yang mengikuti kabin.
- Rotasi: gaya dapat ditambah dan digeser, poros tetap/bebas, teorema sumbu sejajar, dan penahan mekanis.

### Studi Kasus
- Diorama gerobak, lengan pengangkat, troli GLBB, serta sepak bola dengan lintasan parabola, titik puncak, dan vektor kecepatan bergerak.
- Diorama dilengkapi batas visual; hasil angka tetap berasal dari mesin simulasi.

### Modul pendukung
- Fun Fact Mekanika berupa konstelasi interaktif.
- Peta Sejarah tanpa inset Eropa, dengan pan/zoom, popup, dan hide/show detail.
- Kuis konsep 50 soal, skor real-time, dan feedback instan.

## Cara memasang

1. Buat salinan cadangan proyek saat ini.
2. Ekstrak `PhysLAB-Revisi-Terpadu-Patch.zip` ke root proyek PhysLAB. Pastikan folder `src/` hasil ekstraksi menyatu dengan `src/` proyek (bukan menjadi `src/src/`).
3. Jalankan `npm ci` pada komputer pengembangan agar dependensi native dipasang untuk OS lokal.
4. Jalankan `npm run dev` untuk uji browser.
5. Jalankan `npm run build` dan `npm test` pada lingkungan proyek lokal.

## Catatan validasi dan batasan

- Semua 64 file TypeScript/TSX yang berada di source dapat diparse tanpa kesalahan sintaks oleh TypeScript parser.
- Semua 9 stylesheet berhasil diparse PostCSS.
- Mesin matematika dan data diuji terpisah: sudut parabola 0°/180°/360°, model penerjun dengan hambatan udara, Atwood, jumlah/struktur 50 soal, serta jumlah 15 Fun Fact.
- Build Vite penuh dan Vitest tidak dapat dijalankan pada lingkungan kerja ini karena arsip dependensi tidak menyediakan binary/binding Rolldown Linux serta `@types/node`/`vite/client` terpasang secara tidak lengkap. Karena itu hasil build final harus dijalankan setelah `npm ci` pada komputer lokal.
- Proyek sumber yang diperiksa belum mendaftarkan Tailwind CSS atau Framer Motion dalam `package.json`; pembaruan memakai CSS modular yang konsisten dengan proyek, tanpa mengubah konfigurasi dependency.

## Asumsi model fisika

- Gerak parabola ideal mengabaikan hambatan udara.
- Penerjun menggunakan model drag kuadratik ilustratif dengan massa 78 kg; koefisien/luas efektif berubah ketika parasut terbuka pada 72% lintasan.
- Roda dan katrol menggunakan model ideal yang dijelaskan dalam label/model matematika.
- Diorama Studi Kasus merupakan pendamping visual; nilai ilmiah kuantitatif berasal dari mesin simulasi terkait.
