# Perbaikan Modul Dinamika PhysLAB

## Perubahan
- Hub Dinamika disusun menjadi enam modul: Dinamika Newton, Bidang Miring, Momentum & Tumbukan, Osilasi, Katrol Atwood, dan Lift.
- Bidang Miring dipisahkan menjadi modul mandiri; sudut dibatasi 0–90°, orientasi kiri/kanan tersedia, dan balok mulai meluncur dari area tengah dengan percepatan gravitasi serta gesekan kinetis.
- Momentum & Tumbukan dipisahkan menjadi modul mandiri. Sudut gaya diproyeksikan ke sumbu lintasan 1D untuk menentukan komponen kecepatan awal.
- Posisi visual benda tumbukan dibatasi pada lintasan dan jarak antarbenda dijaga agar tidak saling menembus akibat posisi hasil integrasi.
- Objek m1/m2 dapat dipilih melalui klik pada visualisasi atau tombol pemilih; panel menampilkan parameter massa objek terpilih.
- Katrol Atwood mendapat tombol +/− untuk mengubah massa m1 dan m2 secara bertahap 0,5 kg (rentang 1–20 kg).
- Rasio kanvas SVG dibuat mengikuti wadah dengan overflow tersembunyi agar area simulasi tidak meluber.
- Kontrol skala global tetap berada pada SimulationExperience sehingga tidak ditambahkan ulang di tiap modul.

## Validasi
Build dan test otomatis belum dapat dijalankan pada lingkungan penyuntingan ini karena instalasi dependensi npm tidak selesai sebelum batas waktu. Jalankan `npm ci`, `npm run build`, dan `npm test` di lingkungan proyek untuk validasi akhir.
