# Tahap 1 — Struktur navigasi dan Kinematika

Proyek menggunakan **React 19, TypeScript, dan Vite**. Berkas `index.html` di akar proyek adalah halaman HTML utama yang memuat aplikasi React melalui `src/main.tsx`.

## Struktur sumber

```text
physlab-main/
├── index.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── config/
│   │   └── konfigurasiNavigasi.ts
│   ├── layouts/
│   │   └── TataLetakUtama.tsx
│   ├── components/
│   │   ├── navigasi/
│   │   │   └── Sidebar.tsx
│   │   └── simulasi/
│   │       ├── ParameterSlider.tsx
│   │       ├── KontrolWaktuSimulasi.tsx
│   │       ├── KartuBesaran.tsx
│   │       └── GrafikMini.tsx
│   └── features/
│       ├── kinematika/
│       │   ├── KinematikaPage.tsx
│       │   ├── usePlayback.ts
│       │   ├── gerak-lurus/
│       │   │   ├── mesinGerakLurus.ts
│       │   │   ├── mesinGerakLurus.test.ts
│       │   │   ├── GerakLurusSimulasi.tsx
│       │   │   └── VisualisasiGerakLurus.tsx
│       │   └── gerak-dua-dimensi/
│       │       ├── mesinGerakDuaDimensi.ts
│       │       ├── mesinGerakDuaDimensi.test.ts
│       │       ├── GerakDuaDimensiSimulasi.tsx
│       │       └── VisualisasiGerakDuaDimensi.tsx
│       └── dinamika/
│           └── DinamikaPage.tsx
└── package.json
```

## Navigasi

```text
Simulasi
├── Kinematika
│   ├── Gerak Lurus Beraturan (GLB)
│   ├── Gerak Lurus Berubah Beraturan (GLBB)
│   ├── Gerak Jatuh Bebas (GJB)
│   ├── Gerak Vertikal (Atas/Bawah)
│   ├── Gerak Parabola
│   └── Gerak Melingkar
└── Dinamika
```

GLB, GLBB, GJB, dan Gerak Parabola sudah dapat dipilih. Gerak Vertikal dan Gerak Melingkar ditampilkan sebagai modul yang sedang disiapkan. Cabang Dinamika baru berupa halaman kerangka; implementasi fisikanya belum dimasukkan pada tahap ini.

## Prinsip pemisahan kode

- `config/konfigurasiNavigasi.ts` menjadi satu sumber untuk urutan menu dan tipe modul.
- `components/navigasi/` hanya mengatur susunan dan interaksi menu.
- `features/kinematika/KinematikaPage.tsx` hanya mengarahkan pilihan menu ke komponen simulasi yang sesuai.
- `features/kinematika/gerak-lurus/` memuat GLB dan GLBB secara terpisah dari kelompok gerak dua dimensi.
- `features/kinematika/gerak-dua-dimensi/` memuat GJB dan Gerak Parabola.
- Setiap kelompok gerak memisahkan mesin perhitungan, komponen halaman, visualisasi, serta pengujian.
- `usePlayback.ts` mengelola waktu, jeda, pengulangan, dan kecepatan animasi agar dapat dipakai bersama.
- `components/simulasi/` menampung komponen antarmuka yang digunakan ulang.
- `layouts/` membungkus halaman dengan sidebar, kepala halaman, dan kaki halaman.

## Persamaan GLB dan GLBB

GLB menggunakan kecepatan konstan dan percepatan nol:

- `x(t) = x0 + v0 t`
- `v(t) = v0`
- `a(t) = 0`

GLBB menggunakan percepatan konstan:

- `x(t) = x0 + v0 t + 1/2 a t^2`
- `v(t) = v0 + a t`
- `a(t) = konstan`

Tanda positif menunjukkan arah ke kanan dan tanda negatif menunjukkan arah ke kiri. Model mengasumsikan gerak satu dimensi ideal.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Pengujian dan build:

```bash
npm test
npm run build
```


## Pemetaan file yang disentuh pada tahap ini

- `src/App.tsx`: menyimpan pilihan cabang Kinematika atau Dinamika.
- `src/layouts/TataLetakUtama.tsx`: kerangka halaman dan jejak navigasi.
- `src/components/navigasi/Sidebar.tsx`: menu bertingkat di sisi kiri.
- `src/config/konfigurasiNavigasi.ts`: urutan enam sub-menu Kinematika.
- `src/features/kinematika/gerak-lurus/GerakLurusSimulasi.tsx`: tampilan simulasi GLB/GLBB.
- `src/features/kinematika/gerak-lurus/mesinGerakLurus.ts`: perhitungan posisi, kecepatan, dan percepatan GLB/GLBB.
- `src/features/kinematika/usePlayback.ts`: kendali waktu untuk animasi simulasi.

Catatan: proyek ini tetap memakai React + TypeScript. Karena itu, modul menggunakan `.tsx` dan `.ts` alih-alih membuat folder JavaScript biasa yang berjalan di luar arsitektur React. `index.html` dan `src/App.css` tetap menjadi pintu masuk HTML dan gaya utama aplikasi.
