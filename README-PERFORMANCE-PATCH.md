# PhysLab – Simulation Performance Patch

Patch ini mengurangi beban render React saat simulasi aktif, tanpa mengubah persamaan fisika atau data parameter.

## Perubahan utama
- Jam simulasi kinematika tetap berjalan dengan `requestAnimationFrame`, tetapi pembaruan state React dibatasi sekitar 30 FPS agar seluruh halaman tidak dirender ulang 60 kali per detik.
- Jam sistem dinamika, rotasi, dan simulasi dinamika kurikulum juga membatasi publikasi state UI menjadi sekitar 30 FPS.
- Simulasi Hukum Newton membatasi pembaruan state balok/waktu ke 30 FPS; integrasi fisika tetap berjalan pada loop animasi.
- Resolusi backing canvas dibatasi maksimal 1.5x device pixel ratio untuk mengurangi jumlah piksel yang harus digambar.
- Canvas hanya mengubah `width`/`height` jika ukuran aktual berubah; perubahan dimensi canvas akan menghapus buffer gambar.

## Penerapan
1. Extract ZIP ini.
2. Salin folder `src` ke project PhysLab dan pilih Replace/Overwrite. Jangan replace `.git` atau `node_modules`.
3. Di VS Code terminal jalankan:

```bash
npm run build
```

4. Jika build berhasil:

```bash
git add .
git commit -m "Optimize simulation rendering performance"
git push origin main
```

## Catatan
Patch ini menargetkan bottleneck yang terlihat di source: pembaruan React per frame dan redraw canvas. Build/deployment perlu tetap diverifikasi di mesin project karena instalasi dependency pada lingkungan patch mengalami timeout. Setelah deploy, uji GLB, GLBB, parabola, rotasi, sistem katrol/lift, dan Hukum Newton.
