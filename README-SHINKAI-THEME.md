# PhysLAB — Makoto Shinkai Theme Refresh

Pembaruan visual ini mempertahankan sistem navigasi dan mesin pembelajaran dari source interface refresh sebelumnya, lalu menerapkan satu design-token system bertema Makoto Shinkai ke seluruh halaman.

## Fitur yang ditambahkan

- Splash screen dengan fade/scale dan subjudul `Physics at your services!`.
- Empat scene ambient animasi: Twilight Comet, Garden Rain, Golden Cumulus, dan Sakura Breeze.
- Theme switcher di floating navbar dengan mode otomatis (rotasi setiap 16 detik) atau pemilihan manual.
- Palet lintas modul: deep indigo, midnight blue, twilight violet, dan sunset orange `#e89973`.
- Kontras panel, kontrol, peta, diorama, Fun Fact, kuis, dan Problem Set diselaraskan. Fun Fact yang sebelumnya menyerupai buku kertas terang diubah menjadi jurnal malam bernuansa indigo.
- Hero quote ditampilkan tanpa label kaku, langsung dalam format kutipan dan atribusi.
- Scene menghormati `prefers-reduced-motion` untuk pengguna yang membatasi animasi.

## File utama

- `src/theme/shinkai.ts` — tipe, nama, dan metadata empat tema.
- `src/theme/shinkai-theme.css` — design tokens, animasi ambient, dan override palet global seluruh menu.
- `src/components/theme/ThemeBackdrop.tsx` — layer meteor, hujan, awan senja, dan sakura.
- `src/components/theme/ThemeSwitcher.tsx` — pemilih tema auto/manual pada navbar.
- `src/App.tsx` — lifecycle theme rotation, data-theme root, dan pemasangan background global.
- `src/components/navigasi/FloatingNavbar.tsx` — integrasi theme switcher.
- `src/features/beranda/IntroSplash.tsx` — subjudul baru.
- `src/features/beranda/BerandaPage.tsx` — format kutipan bersih.

## Menjalankan proyek

Gunakan Node.js yang memenuhi engines dari Vite yang dipakai proyek, lalu dari root project:

```bash
npm install
npm run dev
```

Untuk validasi lokal:

```bash
npm run build
npm test
```

Catatan paket: `package.json` telah memuat `motion`, `tailwindcss`, dan `@tailwindcss/vite`; arsip ini tidak menyertakan `node_modules`. Lockfile lama tidak disertakan karena tidak memuat paket Motion/Tailwind yang dideklarasikan pada source interface refresh. `npm install` akan membuat lockfile sinkron pada mesin pengguna. Jangan gunakan `npm ci` sebelum lockfile baru terbentuk.

## Status pemeriksaan pada sesi pembuatan

- TypeScript app project diperiksa dengan TypeScript compiler dan deklarasi sementara untuk API `motion/react`; tidak ada error pada file aplikasi setelah pemeriksaan.
- Seluruh stylesheet source termasuk `shinkai-theme.css` diparse dengan PostCSS.
- Build Vite penuh dan Vitest penuh tidak diklaim berhasil karena registry npm tidak dapat diakses dari lingkungan pembuatan, sehingga paket `motion` dan plugin Tailwind belum dapat dipulihkan di sana.

Pembaruan ini merupakan lapisan tampilan dan tema; mesin simulasi, data soal, peta, dan modul pembelajaran dari source interface refresh dipertahankan.
