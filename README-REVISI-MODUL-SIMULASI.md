# PhysLAB — Revisi Menyeluruh Modul Simulasi Fisika

Paket ini adalah source project PhysLAB hasil revisi langsung dari arsip project yang diunggah. Struktur React + Vite + TypeScript + Tailwind tetap dipertahankan. Animasi memakai paket `motion` v14 yang sudah tercantum di `package.json` (`motion/react`), bukan menambah dependensi `framer-motion` terpisah.

## Menjalankan project

Gunakan Node.js **22.12+** (atau Node 20.19+) yang kompatibel dengan Vite/Rolldown di lockfile.

```bash
npm ci
npm run dev
```

Build dan tes setelah dependensi lokal berhasil dipasang:

```bash
npm run build
npm test
npm run lint
```

Folder `node_modules` sengaja tidak dimasukkan ke ZIP agar paket ringan dan binary opsional dipasang sesuai sistem operasi pengguna oleh `npm ci`.

## Perubahan utama

### Sistem halaman Simulasi

- `src/App.tsx` sekarang benar-benar membungkus halaman Kinematika dan Dinamika dengan `SimulationExperience`. Wrapper ini sebelumnya tersedia di source tetapi belum aktif pada jalur render utama.
- Tab global: **Simulasi & Kontrol**, **Grafik Analisis**, dan **Model Matematika**.
- Model matematika dan keterangan simbol diisolasi dari halaman kontrol; grafik dapat dibuka pada area lebar.
- Posisi panel parameter: atas, bawah, sidebar kiri, sidebar kanan, atau floating draggable.
- Posisi dock, mode skala, dan koordinat floating disimpan di `localStorage`.
- Floating panel dapat digeser melalui grip menggunakan `motion/react`.
- Tampilan toolbar dan dock responsif; dock kiri/kanan berubah menjadi susunan vertikal pada layar sempit.

### Canvas dan kontrol

- `useCanvasDimensions.ts` mengukur area dengan `ResizeObserver`, menyesuaikan backing canvas dan device pixel ratio, lalu menghitung tinggi langsung dari rasio aspek setelah ukuran tersedia.
- Parameter memakai slider dan input angka presisi melalui `ParameterSlider`.
- Input waktu finite memakai kotak numerik, bukan slider waktu, dan dibatasi pada rentang durasi.
- Perubahan parameter tidak memanggil reset/atur ulang jam simulasi. Model dihitung ulang pada nilai waktu yang sama.
- Tombol reset tetap menjadi satu-satunya tindakan yang mengembalikan eksperimen ke awal.

### Kinematika

- Mode **Boundary Box** dan **Actual Scale** di toolbar tersedia untuk semua eksperimen Kinematika dan tersimpan di `localStorage`.
- Gerak Lurus menggunakan rentang koordinat tetap atau auto-range berdasarkan lintasan.
- Gerak Parabola mendukung sudut berarah 0°–360° melalui rotary dial yang merespons pointer/touch; model memperhitungkan arah kiri/kanan dan atas/bawah.
- Gerak Melingkar memiliki submenu GMB, GMBB, dan Gear System tiga roda.
- Gear System mempertahankan hubungan seporos, bersinggungan, dan sabuk/rantai; dropdown hubungan roda 1–2 dan 2–3 berdampingan; status memakai gap; telemetry tiga roda dan action bar satu baris pada lebar desktop yang cukup.
- Gerak Jatuh Bebas tergabung pada modul Gerak Vertikal bersama mode vertikal ke atas dan ke bawah. Visualisasi menggunakan benda standar, sumbu ketinggian, dan vektor.

### Dinamika — enam tab kurikulum + satu sandbox

`src/features/dinamika/DinamikaKurikulumSimulasi.tsx` menyediakan tujuh ruang:

1. Balok Tunggal & Gesekan.
2. Gaya Kontak dua balok beserta pasangan `N₁₂` dan `N₂₁`.
3. Balok Bertumpuk dengan keadaan gerak bersama atau selip.
4. Bidang Miring dengan rotary dial 0°–90° dan komponen `w sin θ` serta `w cos θ`.
5. Pegas teredam dan Bandul Matematis.
6. Penerapan Lanjutan yang mempertahankan Sistem Katrol/Lift dan Rotasi/Kesetimbangan yang sudah ada.
7. Free-Body Lab yang menggunakan sandbox vektor 2D lama.

Model fisika dipisahkan dari view di `src/features/dinamika/mesinKurikulum.ts` dan divisualisasikan oleh `VisualisasiDinamikaKurikulum.tsx`.

## Asumsi model fisika Dinamika

- **Balok tunggal:** bidang horizontal, gaya luar positif ke kanan, `N = mg`; gesekan statis menyesuaikan gaya hingga `μs N`, lalu model menggunakan gesekan kinetis `μk N`.
- **Dua balok kontak:** bidang horizontal licin; gaya dorong diberikan ke balok 1. Percepatan sistem `a = F/(m₁+m₂)` dan kontak `N₁₂ = m₂a`, `N₂₁ = −N₁₂`.
- **Balok bertumpuk:** gaya luar diberikan pada balok bawah; lantai dianggap licin. Gesekan statis antarmuka menentukan apakah keduanya bergerak bersama; bila ambang terlampaui, model beralih ke gesekan kinetis. Mesin menjaga `μk ≤ μs`.
- **Bidang miring:** berat diuraikan menjadi `mg sin θ` sejajar bidang dan `mg cos θ` tegak lurus bidang. Gesekan statis diuji sebelum menggunakan percepatan kinetis.
- **Pegas:** osilator massa–pegas dengan redaman viskos; penyelesaian analitik mendukung underdamped, critically damped, dan overdamped menggunakan rasio redaman `ζ`.
- **Bandul:** pendekatan sudut kecil `sin θ ≈ θ` dengan redaman linear ekuivalen. Sudut awal 1°–45° dikonversi ke radian sebelum perhitungan. Untuk sudut besar, model bandul nonlinier akan diperlukan.
- Animasi skenario baru menggunakan `requestAnimationFrame` dengan akumulator langkah tetap 1/60 s. Perhitungan posisi, kecepatan, dan percepatan dilakukan oleh model terpisah.

## File utama yang direvisi / ditambahkan

- `src/App.tsx`
- `src/App.css`
- `src/config/konfigurasiNavigasi.ts`
- `src/components/simulasi/SimulationExperience.tsx`
- `src/components/simulasi/SimulationExperience.css`
- `src/components/simulasi/KontrolWaktuSimulasi.tsx`
- `src/components/simulasi/KartuBesaran.tsx`
- `src/components/simulasi/useCanvasDimensions.ts`
- `src/features/dinamika/DinamikaPage.tsx`
- `src/features/dinamika/DinamikaKurikulumSimulasi.tsx`
- `src/features/dinamika/VisualisasiDinamikaKurikulum.tsx`
- `src/features/dinamika/mesinKurikulum.ts`
- `src/features/dinamika/mesinKurikulum.test.ts`
- `src/features/dinamika/Dinamika.css`
- `src/features/dinamika/GrafikWaktuNyata.tsx`

## Status validasi pada sesi pembuatan

- `npx tsc -b --pretty false`: **LULUS**.
- ESLint pada file-file source yang disentuh: **LULUS**.
- Pemeriksaan langsung 11 kondisi numerik pada mesin fisika kurikulum baru: **LULUS**.
- `npm run build`: belum selesai pada lingkungan pembuatan karena arsip `node_modules` yang diberikan tidak berisi binary opsional Linux `@rolldown/binding-linux-x64-gnu`.
- `npm test`: belum selesai pada lingkungan pembuatan karena binary opsional Linux `@rollup/rollup-linux-x64-gnu` tidak tersedia di `node_modules`.

Dua hambatan terakhir berasal dari paket binary opsional yang tidak ikut tersedia pada `node_modules` terarsip, bukan error TypeScript. Jalankan `npm ci` pada mesin target dari root folder project; lockfile sudah memuat paket opsional untuk platform Linux x64 GNU.
