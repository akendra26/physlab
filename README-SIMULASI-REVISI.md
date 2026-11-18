# PhysLAB — Revisi Menyeluruh Modul Simulasi

Paket ini adalah pembaruan untuk source PhysLAB hasil Makoto Shinkai / Astral Archives. Struktur routing dan palet gelap midnight-indigo dengan aksen `#e89973` dipertahankan.

## Isi revisi

- Tab global untuk Kinematika dan Dinamika: **Simulasi & Kontrol**, **Grafik Analisis**, dan **Model Matematika**.
- Posisi panel kontrol atas, bawah, sidebar kiri/kanan, atau floating draggable. Pilihan dock dan koordinat floating disimpan di `localStorage`.
- Canvas Kinematika dan grafik waktu nyata memakai `ResizeObserver`, backing store DPR, dan rasio aspek agar tidak gepeng saat orientasi layar berubah.
- Perubahan slider memperbarui model pada nilai waktu berjalan; callback parameter tidak lagi memanggil reset. Reset tetap tersedia sebagai aksi eksplisit. Mengganti jenis eksperimen (misalnya GLB ke GLBB atau GMB ke GMBB) tetap memulai eksperimen baru.
- Mode skala Kinematika **Boundary Box** dan **Actual Scale**. Boundary Box memakai batas tampilan tetap; Actual Scale menghitung ulang rentang berdasarkan lintasan/ukuran parameter.
- Rotary dial parabola 0°–360° mendukung mouse, sentuhan/pen, keyboard, slider, dan input numerik. Boundary Box parabola memakai envelope seluruh sudut sehingga zoom tidak berubah ketika sudut diputar.
- Gerak Melingkar dibagi menjadi GMB, GMBB, dan Gear System tiga roda; parameter relasi ditata dua kolom, ringkasan relasi dipisah, dan telemetry/playback disusun dalam satu baris pada layar lebar.
- Gerak Jatuh Bebas digabung dalam Gerak Vertikal dengan mode `v₀=0`, lemparan vertikal ke atas, dan ke bawah. Visual menggunakan benda standar, skala ketinggian, vektor kecepatan, dan gravitasi. Animasi/paket penerjun payung tidak disertakan.
- Panel kontrol dinamika juga dapat di-dock; grafik dan model mengikuti tab yang dipilih.

## Cara memasang patch

1. Buat salinan cadangan proyek PhysLAB.
2. Ekstrak seluruh isi `patch/` ke folder akar proyek, pertahankan struktur `src/...`, dan izinkan penimpaan.
3. Baca `DELETE-OLD-PARACHUTIST-FILES.txt`; hapus file lama yang masih tersisa bila ada.
4. Jalankan `npm install`, kemudian `npm run dev`.
5. Verifikasi produksi dan tes dengan `npm run build` dan `npm test`.

## localStorage

- `physlab.simulation.control-dock.v2`: posisi dock global.
- `physlab.simulation.floating-position.v1`: posisi panel floating.

Untuk mengembalikan preferensi panel ke awal, hapus dua key tersebut dari localStorage browser.

## Catatan pengujian

Pada sesi pembuatan ini, 71 file TS/TSX lolos parsing sintaks dan 11 stylesheet lolos parsing CSS. Pemeriksaan mesin fisika manual mencakup ekuivalensi parabola 0°/360°, arah peluncuran 180°, v₀ jatuh bebas, tanda kecepatan vertikal, dan kondisi setelah menyentuh tanah. `tsc -p tsconfig.app.json --noEmit` belum dapat menyelesaikan pemeriksaan tipe karena paket `vite/client` belum tersedia di lingkungan ini; build Vite dan Vitest penuh karena itu belum dinyatakan lulus. Jalankan instalasi dependensi pada mesin proyek sebelum menganggap build/test final terverifikasi.
