# PhysLAB — Astral Archives / Select Hero Edition

Pembaruan ini mengganti tiga pengalaman Trivia menjadi satu modul bertema Makoto Shinkai: deep indigo, midnight blue, twilight violet, dan sunset orange `#e89973`.

## Struktur integrasi

- `AstralArchives.tsx` — seluruh komponen hub, Codex, Atlas, dan Trial Chambers.
- `TriviaKuisPage.tsx` — wrapper yang dipakai route Trivia yang sudah ada.
- `dataFunFactMekanika.ts` — bank 15 Fun Fact (dipertahankan).
- `dataPetaSejarah.ts` — arsip sejarah dengan koordinat lintang/bujur WGS84 (dipertahankan).
- `dataKuis.ts` — bank 50 soal konsep (dipertahankan).

## Pengalaman terbaru

### Hub / Select Hero
- Tiga kartu portal berada pada carousel 3D bergaya character selection.
- Panah kiri/kanan, indikator slide, dan kartu samping yang dapat dipilih.
- Klik kartu tengah untuk masuk ke portal.

### Codex of Mechanics — Cosmic Tarot Data Deck
- Tidak lagi menggunakan layout buku.
- Kartu vertikal glassmorphism dengan border bercahaya, sigil, orbit dekoratif, dan gear berputar pelan.
- Swipe/drag kiri-kanan dan tombol Previous/Next; Framer Motion spring dipakai untuk transisi deck.
- Sumber tetap dapat dibuka dari kartu.

### Atlas of Epochs — 360° Globe
- Globe SVG proyeksi ortografik menggunakan koordinat lintang/bujur pada dataset.
- Auto-spin dapat diaktifkan/dihentikan; drag kiri/kanan, tombol ±45°, dan reset tersedia.
- Pin hanya ditampilkan pada hemisphere depan; pilih pin atau arsip dari strip untuk memusatkan lokasi.
- Panel detail dapat disembunyikan dan ditampilkan.

### Trial Chambers — Cinematic Prologues
- 5 narrative arcs × 10 soal = 50 soal.
- Setiap memilih arc selalu membuka cinematic briefing terlebih dahulu. Pemain harus menekan `Enter chamber` sebelum soal dimulai.
- 5 unit shield, pengurangan shield saat jawaban salah, instant feedback, skor arc, retry, dan next chapter.

## Persebaran Atlas

Atlas mencakup lokasi historis di Afrika Utara, Timur Tengah, Asia Tengah, Asia Selatan, Asia Timur, Eropa, dan Amerika Utara. Setiap titik menyimpan sumber rujukan institusi atau kajian sejarah.

## Cara memasang

1. Letakkan file `AstralArchives.tsx` di `src/features/trivia-kuis/`.
2. Pastikan tiga file dataset di atas tersedia pada folder yang sama.
3. Pastikan `TriviaKuisPage.tsx` melakukan default import `AstralArchives`.
4. Proyek menggunakan `motion/react` (package `motion`).
5. Jalankan `npm install`, lalu `npm run dev`.

Tidak perlu membuat route baru jika route `TriviaKuisPage` sudah terdaftar.

## Catatan data dan validasi

Dataset Fun Fact dan bank soal dipertahankan: 15 Fun Facts serta 50 soal yang masing-masing memiliki 4 pilihan, indeks jawaban valid, dan pembahasan. Dataset peta sejarah diperluas dari 6 menjadi 13 lokasi, dengan tambahan Cairo, Maragheh, Samarkand, Cleveland, Kolkata, Berkeley, dan Osaka. Koordinat baru adalah perkiraan pusat kota/kawasan sebagai penunjuk, bukan koordinat presisi setiap bangunan historis. Lima grup arc menggunakan seluruh 50 ID tepat satu kali.

File TSX lolos parsing/transpilasi TypeScript dan stylesheet inline lolos parsing PostCSS. `npm run build` belum bisa divalidasi pada sesi ini karena paket tipe `vite/client` dan `node` belum tersedia di folder `node_modules`; instal dependensi proyek terlebih dahulu untuk pengujian build lokal.
