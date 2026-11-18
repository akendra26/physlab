# PhysLAB — Physics, Controls & UX Update

## Perubahan utama

- Kontrol **Kotak Batas / Skala Nyata** kini tersedia pada toolbar bersama di semua submenu Dinamika. Pemilihan skala disimpan di `localStorage` dan digunakan oleh visualisasi Dinamika yang mendukung koordinat fisik.
- Kontrol posisi panel menyediakan **Atas, Bawah, Kiri, Kanan, dan Mengambang**. Panel pada Atwood, Rotasi/Kesetimbangan, serta Sandbox menggunakan komponen docking bersama.
- Vektor gaya memakai outline gelap dan garis warna yang lebih tebal agar terbaca di latar gelap. Panah gaya pada balok bertumpuk mengikuti posisi balok dan arah gaya dorong.
- Model balok bertumpuk membedakan gerak bersama, selip, melewati tepi tumpuan oleh pusat massa, jatuh bebas, dan menyentuh lantai. Kamera visual mengikuti kedua balok serta menyesuaikan zoom saat jarak keduanya membesar.
- Bidang miring berputar di bawah balok yang tetap terletak pada bidang; rentang sudut dijaga pada 0°–180°.
- Orientasi pegas dibatasi menjadi horizontal dan vertikal. Jalur pegas memakai kurva sinusoidal halus dengan ujung menempel pada penyangga dan balok.
- Intro menggunakan fade + zoom ringan dengan sparkle lembut dan dukungan `prefers-reduced-motion`; efek portal/cosmic warp berat tidak digunakan.
- Sandbox Gaya Bebas 2D menggunakan `requestAnimationFrame`, integrasi fisika sub-langkah tetap, batas delta waktu, sanitasi parameter, koreksi batas kanvas, dan transformasi SVG imperatif pada frame agar React tidak merender ulang 60 kali per detik.
- Modul multi-gaya Rotasi memakai dropdown pemilihan gaya; slider hanya menampilkan parameter gaya yang dipilih.

## Pemeriksaan yang dilakukan

- TypeScript syntax transpile untuk 79 file `.ts`/`.tsx`: lolos tanpa diagnostic sintaks.
- Type-check strict untuk mesin fisika `mesinDinamika.ts` dan `mesinKurikulum.ts`: lolos.
- Pemeriksaan regresi manual mesin fisika: lolos untuk ambang edge-slip, jatuh dan kontak lantai, sudut bidang 135°, stabilitas tumpukan di sandbox, serta input ekstrem/NaN/Infinity.

## Batas verifikasi

`npm run build`, `npm run lint`, dan `npm test` belum dijalankan di lingkungan ini karena dependensi proyek tidak tersedia dan instalasi paket sebelumnya tidak selesai. Jalankan di komputer pengembangan setelah `npm install`.
