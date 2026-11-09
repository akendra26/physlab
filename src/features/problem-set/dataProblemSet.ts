/**
 * Bank soal latihan Fisika SMA kelas XI untuk modul Problem Set PhysLab.
 *
 * Saat file LaTeX asli tersedia, cukup ubah/isi `pertanyaan` dan `pembahasan`
 * dengan teks LaTeX. MathContent akan merender $...$, \\(...\\), $$...$$,
 * dan \\[...\\] menggunakan KaTeX.
 */

export type JenisSoal = "pilihan-ganda" | "isian-singkat";

export type OpsiJawaban = {
  id: string;
  teks: string;
};

type SoalDasar = {
  id: string;
  jenis: JenisSoal;
  tingkat: "Dasar" | "Menengah" | "Lanjut";
  pertanyaan: string;
  petunjuk?: string;
  pembahasan: string;
  jawabanAkhir: string;
};

export type SoalPilihanGanda = SoalDasar & {
  jenis: "pilihan-ganda";
  opsi: OpsiJawaban[];
  jawabanBenar: string;
};

export type SoalIsianSingkat = SoalDasar & {
  jenis: "isian-singkat";
  jawabanDiterima: string[];
  jawabanNumerik?: {
    nilai: number;
    toleransi: number;
    satuan?: string;
  };
};

export type SoalProblemSet = SoalPilihanGanda | SoalIsianSingkat;

export type TopikProblemSet = {
  id: string;
  nomor: number;
  judul: string;
  singkatan: string;
  bidang: "Kinematika" | "Dinamika";
  simbol: string;
  warna: "mint" | "blue" | "amber" | "violet";
  deskripsi: string;
  referensiSimulasi: string;
  estimasiMenit: number;
  soal: SoalProblemSet[];
};

export type PercobaanJawaban = {
  jawaban: string;
  benar: boolean;
  diperiksa: boolean;
  waktuDiperiksa: string;
};

export type ProgresProblemSet = {
  versi: 1;
  percobaan: Record<string, PercobaanJawaban>;
  /** Jawaban sementara, belum dinilai sampai tombol kumpulkan ditekan. */
  drafJawaban?: Record<string, string>;
  /** Topik yang sudah dikumpulkan; pembahasan hanya dibuka setelah status ini true. */
  topikDikumpulkan?: Record<string, boolean>;
};

export const BANK_SOAL_PROBLEM_SET: TopikProblemSet[] = [
  {
    id: "glb-glbb",
    nomor: 1,
    judul: "Gerak Lurus Beraturan & Berubah Beraturan",
    singkatan: "GLB · GLBB",
    bidang: "Kinematika",
    simbol: "↔",
    warna: "mint",
    deskripsi: "Analisis posisi, perpindahan, kecepatan, dan percepatan pada lintasan lurus.",
    referensiSimulasi: "Gerak Lurus",
    estimasiMenit: 15,
    soal: [
      {
        id: "glb-glbb-01",
        jenis: "pilihan-ganda",
        tingkat: "Dasar",
        pertanyaan: String.raw`Sebuah kendaraan bergerak lurus beraturan dengan kecepatan tetap $12 \text{ m/s}$. Berapa perpindahan kendaraan setelah bergerak selama $5 \text{ s}$?`,
        petunjuk: "Pada GLB, kecepatan tidak berubah selama selang waktu yang ditinjau.",
        opsi: [
          { id: "A", teks: "$50 \\text{ m}$" },
          { id: "B", teks: "$60 \\text{ m}$" },
          { id: "C", teks: "$65 \\text{ m}$" },
          { id: "D", teks: "$72 \\text{ m}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$60 \\text{ m}$",
        pembahasan: String.raw`Gunakan hubungan GLB $\Delta x = v t$. Dengan $v=12 \text{ m/s}$ dan $t=5 \text{ s}$, diperoleh $\Delta x=12\times5=60 \text{ m}$.`,
      },
      {
        id: "glb-glbb-02",
        jenis: "isian-singkat",
        tingkat: "Dasar",
        pertanyaan: String.raw`Sebuah benda mula-mula diam, kemudian mengalami percepatan konstan $2{,}5 \text{ m/s}^2$ selama $4 \text{ s}$. Tentukan kecepatan akhirnya dalam $\text{ m/s}$.`,
        petunjuk: "Hubungkan kecepatan awal, percepatan, dan waktu.",
        jawabanDiterima: ["10", "10 m/s", "10m/s"],
        jawabanNumerik: { nilai: 10, toleransi: 0.05, satuan: "m/s" },
        jawabanAkhir: "$10 \\text{ m/s}$",
        pembahasan: String.raw`Persamaan GLBB adalah $v_t=v_0+at$. Karena $v_0=0$, maka $v_t=0+(2{,}5)(4)=10 \text{ m/s}$.`,
      },
      {
        id: "glb-glbb-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Posisi sebuah benda pada lintasan lurus dinyatakan oleh $x(t)=4+3t+2t^2$, dengan $x$ dalam meter dan $t$ dalam sekon. Berapa kecepatan rata-rata benda dari $t=1\text{ s}$ hingga $t=2\text{ s}$?`,
        petunjuk: "Kecepatan rata-rata adalah perpindahan dibagi selang waktu, yaitu $v_{rata-rata}=\frac{\Delta x}{\Delta t}$.",
        opsi: [
          { id: "A", teks: "$7 \\text{ m/s}$" },
          { id: "B", teks: "$9 \\text{ m/s}$" },
          { id: "C", teks: "$11 \\text{ m/s}$" },
          { id: "D", teks: "$13 \\text{ m/s}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$9 \\text{ m/s}$",
        pembahasan: String.raw`Hitung posisi pada kedua waktu: $x(1)=4+3(1)+2(1)^2=9\text{ m}$ dan $x(2)=4+3(2)+2(2)^2=18\text{ m}$. Maka $v_{rata-rata}=\frac{18-9}{2-1}=9\text{ m/s}$.`,
      },
      {
        id: "glb-glbb-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Sebuah mobil bergerak dengan kecepatan awal $5\text{ m/s}$ dan percepatan konstan $1{,}5\text{ m/s}^2$. Berapa perpindahan mobil selama $6\text{ s}$? Jawab dalam meter.`,
        petunjuk: "Gunakan perpindahan GLBB dengan kecepatan awal dan percepatan.",
        jawabanDiterima: ["57", "57 m", "57m"],
        jawabanNumerik: { nilai: 57, toleransi: 0.1, satuan: "m" },
        jawabanAkhir: "$57 \\text{ m}$",
        pembahasan: String.raw`Gunakan $\Delta x=v_0t+\frac12at^2$. Maka $\Delta x=5(6)+\frac12(1{,}5)(6^2)=30+27=57\text{ m}$.`,
      },
    ],
  },
  {
    id: "gerak-vertikal",
    nomor: 2,
    judul: "Gerak Vertikal",
    singkatan: "JATUH BEBAS · VERTIKAL",
    bidang: "Kinematika",
    simbol: "↕",
    warna: "blue",
    deskripsi: "Pelajari gerak jatuh bebas serta gerak benda yang dilempar vertikal ke atas atau ke bawah.",
    referensiSimulasi: "Gerak Vertikal dan Jatuh Bebas",
    estimasiMenit: 12,
    soal: [
      {
        id: "vertikal-01",
        jenis: "pilihan-ganda",
        tingkat: "Dasar",
        pertanyaan: String.raw`Sebuah bola dilempar vertikal ke atas dengan kecepatan awal $20 \text{ m/s}$. Jika $g=10 \text{ m/s}^2$ dan hambatan udara diabaikan, berapa ketinggian maksimum relatif terhadap titik lempar?`,
        petunjuk: "Di titik tertinggi, kecepatan sesaat bola bernilai nol.",
        opsi: [
          { id: "A", teks: "$10 \\text{ m}$" },
          { id: "B", teks: "$15 \\text{ m}$" },
          { id: "C", teks: "$20 \\text{ m}$" },
          { id: "D", teks: "$40 \\text{ m}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$20 \\text{ m}$",
        pembahasan: String.raw`Gunakan $v_t^2=v_0^2-2gh$. Pada titik tertinggi $v_t=0$, sehingga $h=\frac{v_0^2}{2g}=\frac{20^2}{2(10)}=20 \text{ m}$.`,
      },
      {
        id: "vertikal-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah benda dijatuhkan dari keadaan diam pada ketinggian $45 \text{ m}$. Dengan $g=10 \text{ m/s}^2$, berapa waktu yang diperlukan untuk mencapai tanah?`,
        petunjuk: "Untuk benda yang dijatuhkan dari diam, jarak jatuh bergantung pada kuadrat waktu.",
        jawabanDiterima: ["3", "3 s", "3s", "3 detik"],
        jawabanNumerik: { nilai: 3, toleransi: 0.05, satuan: "s" },
        jawabanAkhir: "$3 \\text{ s}$",
        pembahasan: String.raw`Gunakan $h=\frac{1}{2}gt^2$. Maka $t=\sqrt{\frac{2h}{g}}=\sqrt{\frac{2(45)}{10}}=\sqrt{9}=3 \text{ s}$.`,
      },
      {
        id: "vertikal-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Bola dilempar vertikal ke atas dengan kecepatan awal $30\text{ m/s}$. Ambil $g=10\text{ m/s}^2$. Berapa waktu yang diperlukan untuk mencapai titik tertinggi?`,
        petunjuk: "Di titik tertinggi, kecepatan vertikal sama dengan nol.",
        opsi: [
          { id: "A", teks: "$2\\text{ s}$" },
          { id: "B", teks: "$3\\text{ s}$" },
          { id: "C", teks: "$4\\text{ s}$" },
          { id: "D", teks: "$6\\text{ s}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$3\\text{ s}$",
        pembahasan: String.raw`Gunakan $v=v_0-gt$. Pada titik tertinggi $0=30-10t$, sehingga $t=3\text{ s}$.`,
      },
      {
        id: "vertikal-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Sebuah batu dilempar vertikal ke bawah dari ketinggian $60\text{ m}$ dengan kecepatan awal $5\text{ m/s}$. Jika $g=10\text{ m/s}^2$, berapa lama batu mencapai tanah?`,
        petunjuk: "Ambil arah ke bawah sebagai positif dan gunakan $h=v_0t+\frac12gt^2$.",
        jawabanDiterima: ["3", "3 s", "3s", "3 detik"],
        jawabanNumerik: { nilai: 3, toleransi: 0.05, satuan: "s" },
        jawabanAkhir: "$3\\text{ s}$",
        pembahasan: String.raw`Substitusi ke $60=5t+5t^2$. Diperoleh $t^2+t-12=0=(t+4)(t-3)$. Waktu fisik yang positif adalah $t=3\text{ s}$.`,
      },
    ],
  },
  {
    id: "gerak-parabola",
    nomor: 3,
    judul: "Gerak Parabola",
    singkatan: "PROYEKTIL 2D",
    bidang: "Kinematika",
    simbol: "⌁",
    warna: "amber",
    deskripsi: "Uraikan gerak dua dimensi menjadi komponen horizontal dan vertikal.",
    referensiSimulasi: "Gerak Parabola",
    estimasiMenit: 15,
    soal: [
      {
        id: "parabola-01",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah proyektil ditembakkan dari tanah dengan kecepatan awal $20 \text{ m/s}$ pada sudut $30^\circ$. Jika $g=10 \text{ m/s}^2$ dan proyektil kembali ke ketinggian awal, berapa jangkauan horizontalnya? Gunakan $\sin 60^\circ\approx0{,}866$.`,
        petunjuk: "Jangkauan menggabungkan komponen kecepatan horizontal dan waktu total di udara.",
        opsi: [
          { id: "A", teks: "$20 \\text{ m}$" },
          { id: "B", teks: "$30 \\text{ m}$" },
          { id: "C", teks: "$34{,}6 \\text{ m}$" },
          { id: "D", teks: "$40 \\text{ m}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$34{,}6 \\text{ m}$",
        pembahasan: String.raw`Jangkauan proyektil pada ketinggian awal dan akhir yang sama adalah $R=\frac{v_0^2\sin 2\theta}{g}$. Jadi $R=\frac{20^2\sin60^\circ}{10}=40(0{,}866)=34{,}64 \text{ m}\approx34{,}6 \text{ m}$.`,
      },
      {
        id: "parabola-02",
        jenis: "isian-singkat",
        tingkat: "Dasar",
        pertanyaan: String.raw`Proyektil diluncurkan dengan $v_0=20 \text{ m/s}$ pada sudut $30^\circ$ terhadap horizontal. Jika $g=10 \text{ m/s}^2$ dan ketinggian akhir sama dengan ketinggian awal, tentukan waktu total di udara.`,
        petunjuk: "Gunakan komponen kecepatan awal pada arah vertikal.",
        jawabanDiterima: ["2", "2 s", "2s", "2 detik"],
        jawabanNumerik: { nilai: 2, toleransi: 0.05, satuan: "s" },
        jawabanAkhir: "$2 \\text{ s}$",
        pembahasan: String.raw`Waktu total adalah $T=\frac{2v_0\sin\theta}{g}=\frac{2(20)(0{,}5)}{10}=2 \text{ s}$.`,
      },
      {
        id: "parabola-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah bola ditembakkan dengan kecepatan awal $25\text{ m/s}$ pada sudut $37^\circ$. Jika $\cos37^\circ=0{,}8$, berapa komponen kecepatan horizontalnya?`,
        petunjuk: "Komponen horizontal kecepatan awal adalah $v_{0x}=v_0\cos\theta$.",
        opsi: [
          { id: "A", teks: "$15\\text{ m/s}$" },
          { id: "B", teks: "$18\\text{ m/s}$" },
          { id: "C", teks: "$20\\text{ m/s}$" },
          { id: "D", teks: "$25\\text{ m/s}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$20\\text{ m/s}$",
        pembahasan: String.raw`Komponen horizontal $v_{0x}=v_0\cos\theta=25(0{,}8)=20\text{ m/s}$.`,
      },
      {
        id: "parabola-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Proyektil diluncurkan dengan komponen kecepatan awal vertikal $15\text{ m/s}$. Jika $g=10\text{ m/s}^2$ dan titik peluncuran serta pendaratan setinggi sama, tentukan waktu total penerbangan.`,
        petunjuk: "Waktu naik sama dengan waktu turun untuk ketinggian awal dan akhir yang sama.",
        jawabanDiterima: ["3", "3 s", "3s", "3 detik"],
        jawabanNumerik: { nilai: 3, toleransi: 0.05, satuan: "s" },
        jawabanAkhir: "$3\\text{ s}$",
        pembahasan: String.raw`Waktu total $T=\frac{2v_{0y}}{g}=\frac{2(15)}{10}=3\text{ s}$.`,
      },
    ],
  },
  {
    id: "gerak-melingkar",
    nomor: 4,
    judul: "Gerak Melingkar",
    singkatan: "GMB · GMBB",
    bidang: "Kinematika",
    simbol: "⟳",
    warna: "violet",
    deskripsi: "Hubungkan kecepatan sudut, kecepatan linear, periode, frekuensi, dan percepatan sentripetal.",
    referensiSimulasi: "Gerak Melingkar",
    estimasiMenit: 12,
    soal: [
      {
        id: "melingkar-01",
        jenis: "pilihan-ganda",
        tingkat: "Dasar",
        pertanyaan: String.raw`Sebuah titik pada tepi roda berjarak $0{,}5 \text{ m}$ dari pusat. Jika roda berputar dengan kecepatan sudut $4 \text{ rad/s}$, berapa besar kecepatan linear titik tersebut?`,
        petunjuk: "Kecepatan linear berkaitan dengan jari-jari dan kecepatan sudut.",
        opsi: [
          { id: "A", teks: "$1 \\text{ m/s}$" },
          { id: "B", teks: "$2 \\text{ m/s}$" },
          { id: "C", teks: "$4 \\text{ m/s}$" },
          { id: "D", teks: "$8 \\text{ m/s}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$2 \\text{ m/s}$",
        pembahasan: String.raw`Gunakan $v=\omega r$. Dengan $\omega=4 \text{ rad/s}$ dan $r=0{,}5 \text{ m}$, maka $v=4(0{,}5)=2 \text{ m/s}$.`,
      },
      {
        id: "melingkar-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah benda bergerak melingkar dengan kelajuan $6 \text{ m/s}$ pada lintasan berjari-jari $3 \text{ m}$. Tentukan percepatan sentripetalnya dalam $\text{ m/s}^2$.`,
        petunjuk: "Percepatan sentripetal sebanding dengan kuadrat kelajuan dan berbanding terbalik dengan jari-jari.",
        jawabanDiterima: ["12", "12 m/s2", "12m/s2", "12 m/s^2"],
        jawabanNumerik: { nilai: 12, toleransi: 0.05, satuan: "m/s^2" },
        jawabanAkhir: "$12 \\text{ m/s}^2$",
        pembahasan: String.raw`Percepatan sentripetal $a_s=\frac{v^2}{r}=\frac{6^2}{3}=\frac{36}{3}=12 \text{ m/s}^2$.`,
      },
      {
        id: "melingkar-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah roda berputar dengan frekuensi $2\text{ Hz}$. Berapa periode putarannya?`,
        petunjuk: "Periode dan frekuensi merupakan kebalikan satu sama lain.",
        opsi: [
          { id: "A", teks: "$0{,}25\\text{ s}$" },
          { id: "B", teks: "$0{,}5\\text{ s}$" },
          { id: "C", teks: "$2\\text{ s}$" },
          { id: "D", teks: "$4\\text{ s}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$0{,}5\\text{ s}$",
        pembahasan: String.raw`Periode $T=\frac{1}{f}=\frac{1}{2}=0{,}5\text{ s}$.`,
      },
      {
        id: "melingkar-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Sebuah benda bergerak melingkar dengan kecepatan sudut $5\text{ rad/s}$. Berapa sudut yang ditempuh selama $8\text{ s}$ jika kecepatan sudut konstan? Jawab dalam radian.`,
        petunjuk: "Untuk gerak melingkar beraturan, perpindahan sudut adalah hasil kali kecepatan sudut dan waktu.",
        jawabanDiterima: ["40", "40 rad", "40rad"],
        jawabanNumerik: { nilai: 40, toleransi: 0.1, satuan: "rad" },
        jawabanAkhir: "$40\\text{ rad}$",
        pembahasan: String.raw`Gunakan $\Delta\theta=\omega t=5(8)=40\text{ rad}$.`,
      },
    ],
  },
  {
    id: "dinamika-newton",
    nomor: 5,
    judul: "Dinamika Newton",
    singkatan: "GAYA · PERCEPATAN",
    bidang: "Dinamika",
    simbol: "▰",
    warna: "mint",
    deskripsi: "Terapkan resultan gaya, Hukum Newton, gaya normal, dan gaya gesek.",
    referensiSimulasi: "Hukum Newton & Sandbox Gaya",
    estimasiMenit: 15,
    soal: [
      {
        id: "newton-01",
        jenis: "pilihan-ganda",
        tingkat: "Dasar",
        pertanyaan: String.raw`Sebuah benda bermassa $5 \text{ kg}$ dikenai resultan gaya horizontal sebesar $20 \text{ N}$. Berapa percepatan benda?`,
        petunjuk: "Perhatikan hubungan antara resultan gaya, massa, dan percepatan.",
        opsi: [
          { id: "A", teks: "$2 \\text{ m/s}^2$" },
          { id: "B", teks: "$4 \\text{ m/s}^2$" },
          { id: "C", teks: "$5 \\text{ m/s}^2$" },
          { id: "D", teks: "$10 \\text{ m/s}^2$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$4 \\text{ m/s}^2$",
        pembahasan: String.raw`Menurut Hukum II Newton, $\sum F=ma$. Maka $a=\frac{\sum F}{m}=\frac{20}{5}=4 \text{ m/s}^2$.`,
      },
      {
        id: "newton-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Seorang bermassa $60 \text{ kg}$ berdiri di dalam lift yang mengalami percepatan $2 \text{ m/s}^2$ ke atas. Dengan $g=10 \text{ m/s}^2$, berapa gaya normal lantai lift pada orang tersebut?`,
        petunjuk: "Untuk percepatan ke atas, gaya normal lebih besar daripada berat.",
        jawabanDiterima: ["720", "720 n", "720N"],
        jawabanNumerik: { nilai: 720, toleransi: 0.5, satuan: "N" },
        jawabanAkhir: "$720 \\text{ N}$",
        pembahasan: String.raw`Ambil arah atas positif: $N-mg=ma$. Jadi $N=m(g+a)=60(10+2)=720 \text{ N}$.`,
      },
      {
        id: "newton-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Balok bermassa $4\text{ kg}$ ditarik mendatar dengan gaya $30\text{ N}$. Gaya gesek yang bekerja sebesar $10\text{ N}$. Berapa percepatan balok?`,
        petunjuk: "Hitung resultan gaya horizontal sebelum menerapkan Hukum II Newton.",
        opsi: [
          { id: "A", teks: "$2{,}5\\text{ m/s}^2$" },
          { id: "B", teks: "$5\\text{ m/s}^2$" },
          { id: "C", teks: "$7{,}5\\text{ m/s}^2$" },
          { id: "D", teks: "$10\\text{ m/s}^2$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$5\\text{ m/s}^2$",
        pembahasan: String.raw`Resultan gaya $\sum F=30-10=20\text{ N}$. Maka $a=\frac{\sum F}{m}=\frac{20}{4}=5\text{ m/s}^2$.`,
      },
      {
        id: "newton-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Balok bermassa $10\text{ kg}$ berada di lantai horizontal. Koefisien gesek kinetik antara balok dan lantai $0{,}2$. Jika balok ditarik mendatar dengan gaya $50\text{ N}$ dan $g=10\text{ m/s}^2$, tentukan percepatannya.`,
        petunjuk: "Gaya gesek kinetik $f_k=\mu_k N$, dan pada bidang datar $N=mg$.",
        jawabanDiterima: ["3", "3 m/s2", "3m/s2", "3 m/s^2"],
        jawabanNumerik: { nilai: 3, toleransi: 0.05, satuan: "m/s^2" },
        jawabanAkhir: "$3\\text{ m/s}^2$",
        pembahasan: String.raw`Gaya normal $N=mg=100\text{ N}$. Gaya gesek $f_k=0{,}2(100)=20\text{ N}$. Resultan gaya $=50-20=30\text{ N}$, sehingga $a=30/10=3\text{ m/s}^2$.`,
      },
    ],
  },
  {
    id: "atwood-lift",
    nomor: 6,
    judul: "Katrol Atwood & Lift",
    singkatan: "KATROL · GAYA SEMU",
    bidang: "Dinamika",
    simbol: "⛓",
    warna: "blue",
    deskripsi: "Analisis percepatan dua massa yang dihubungkan tali serta gaya normal dalam lift.",
    referensiSimulasi: "Sistem Dinamika & Penerapan",
    estimasiMenit: 15,
    soal: [
      {
        id: "atwood-01",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Dua massa $m_1=3 \text{ kg}$ dan $m_2=2 \text{ kg}$ dihubungkan oleh tali ringan melalui katrol ideal. Jika $g=10 \text{ m/s}^2$, berapa besar percepatan sistem Atwood?`,
        petunjuk: "Resultan gaya penggerak berasal dari selisih berat kedua massa.",
        opsi: [
          { id: "A", teks: "$1 \\text{ m/s}^2$" },
          { id: "B", teks: "$2 \\text{ m/s}^2$" },
          { id: "C", teks: "$4 \\text{ m/s}^2$" },
          { id: "D", teks: "$5 \\text{ m/s}^2$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$2 \\text{ m/s}^2$",
        pembahasan: String.raw`Untuk katrol ideal, $a=\frac{m_1-m_2}{m_1+m_2}g=\frac{3-2}{3+2}(10)=2 \text{ m/s}^2$.`,
      },
      {
        id: "atwood-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Seseorang bermassa $50 \text{ kg}$ berada di lift yang dipercepat ke bawah sebesar $2 \text{ m/s}^2$. Jika $g=10 \text{ m/s}^2$, tentukan besar gaya normal yang dirasakan orang tersebut.`,
        petunjuk: "Saat lift dipercepat ke bawah, gaya normal lebih kecil daripada berat.",
        jawabanDiterima: ["400", "400 n", "400N"],
        jawabanNumerik: { nilai: 400, toleransi: 0.5, satuan: "N" },
        jawabanAkhir: "$400 \\text{ N}$",
        pembahasan: String.raw`Dengan arah atas positif, $N-mg=-ma$, sehingga $N=m(g-a)=50(10-2)=400 \text{ N}$.`,
      },
      {
        id: "atwood-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Pada sistem Atwood ideal, massa $m_1=6\text{ kg}$ dan $m_2=4\text{ kg}$ dihubungkan oleh tali melalui katrol. Jika $g=10\text{ m/s}^2$, berapa tegangan talinya?`,
        petunjuk: "Tentukan percepatan sistem terlebih dahulu, lalu gunakan persamaan gaya pada salah satu massa.",
        opsi: [
          { id: "A", teks: "$40\\text{ N}$" },
          { id: "B", teks: "$48\\text{ N}$" },
          { id: "C", teks: "$50\\text{ N}$" },
          { id: "D", teks: "$60\\text{ N}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$48\\text{ N}$",
        pembahasan: String.raw`Percepatan $a=\frac{6-4}{6+4}(10)=2\text{ m/s}^2$. Untuk massa $4\text{ kg} yang bergerak naik, $T-mg=ma$, sehingga $T=4(10+2)=48\text{ N}$.`,
      },
      {
        id: "atwood-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Seseorang bermassa $70\text{ kg}$ berada dalam lift yang bergerak dengan kecepatan konstan. Ambil $g=10\text{ m/s}^2$. Berapa besar gaya normal lantai lift pada orang tersebut?`,
        petunjuk: "Kecepatan konstan berarti percepatan nol.",
        jawabanDiterima: ["700", "700 n", "700N"],
        jawabanNumerik: { nilai: 700, toleransi: 0.5, satuan: "N" },
        jawabanAkhir: "$700\\text{ N}$",
        pembahasan: String.raw`Karena percepatan nol, $\sum F_y=0$. Maka $N-mg=0$ dan $N=mg=70(10)=700\text{ N}$.`,
      },
    ],
  },
  {
    id: "kesetimbangan",
    nomor: 7,
    judul: "Kesetimbangan Benda Tegar",
    singkatan: "TORSI · MOMEN GAYA",
    bidang: "Dinamika",
    simbol: "⚖",
    warna: "amber",
    deskripsi: "Gunakan syarat resultan gaya dan resultan torsi untuk menganalisis benda tegar.",
    referensiSimulasi: "Dinamika Rotasi & Kesetimbangan",
    estimasiMenit: 15,
    soal: [
      {
        id: "setimbang-01",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah batang ringan berporos pada satu titik. Gaya $10 \text{ N}$ bekerja tegak lurus batang pada jarak $2 \text{ m}$ di sebelah kiri poros. Berapa besar gaya yang harus bekerja tegak lurus pada jarak $1 \text{ m}$ di sebelah kanan poros agar resultan torsi nol?`,
        petunjuk: "Pada kesetimbangan rotasi, jumlah torsi searah jarum jam dan berlawanan arah jarum jam saling meniadakan.",
        opsi: [
          { id: "A", teks: "$5 \\text{ N}$" },
          { id: "B", teks: "$10 \\text{ N}$" },
          { id: "C", teks: "$20 \\text{ N}$" },
          { id: "D", teks: "$40 \\text{ N}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$20 \\text{ N}$",
        pembahasan: String.raw`Syarat torsi nol: $F_1r_1=F_2r_2$. Maka $F_2=\frac{10(2)}{1}=20 \text{ N}$.`,
      },
      {
        id: "setimbang-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah tuas seimbang pada poros. Gaya $30 \text{ N}$ bekerja tegak lurus pada lengan $2 \text{ m}$. Berapa gaya berlawanan arah yang diperlukan pada lengan $1{,}5 \text{ m}$ agar tuas tetap seimbang?`,
        petunjuk: "Samakan besar momen gaya pada kedua sisi poros.",
        jawabanDiterima: ["40", "40 n", "40N"],
        jawabanNumerik: { nilai: 40, toleransi: 0.1, satuan: "N" },
        jawabanAkhir: "$40 \\text{ N}$",
        pembahasan: String.raw`Gunakan $F_1r_1=F_2r_2$. Maka $F_2=\frac{30(2)}{1{,}5}=40 \text{ N}$.`,
      },
      {
        id: "setimbang-03",
        jenis: "pilihan-ganda",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah gaya $20\text{ N}$ bekerja tegak lurus pada ujung batang sepanjang $0{,}5\text{ m}$ dari poros. Berapa besar torsi gaya tersebut?`,
        petunjuk: "Untuk gaya tegak lurus, besar torsi adalah hasil kali gaya dan lengan momennya.",
        opsi: [
          { id: "A", teks: "$5\\text{ N m}$" },
          { id: "B", teks: "$10\\text{ N m}$" },
          { id: "C", teks: "$20\\text{ N m}$" },
          { id: "D", teks: "$40\\text{ N m}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$10\\text{ N m}$",
        pembahasan: String.raw`Karena gaya tegak lurus batang, $\tau=rF=(0{,}5)(20)=10\text{ N m}$.`,
      },
      {
        id: "setimbang-04",
        jenis: "isian-singkat",
        tingkat: "Lanjut",
        pertanyaan: String.raw`Sebuah papan homogen panjangnya $4\text{ m}$ dan beratnya $200\text{ N}$ ditopang tepat pada titik tengahnya. Sebuah beban $100\text{ N}$ diletakkan $1\text{ m}$ di sebelah kiri titik tumpu. Berapa gaya ke bawah yang harus diberikan $1\text{ m}$ di sebelah kanan titik tumpu agar papan tetap setimbang?`,
        petunjuk: "Berat papan bekerja di titik tengah sehingga tidak menghasilkan torsi terhadap titik tumpu.",
        jawabanDiterima: ["100", "100 n", "100N"],
        jawabanNumerik: { nilai: 100, toleransi: 0.5, satuan: "N" },
        jawabanAkhir: "$100\\text{ N}$",
        pembahasan: String.raw`Torsi beban kiri adalah $100(1)=100\text{ N m}$. Agar setimbang, torsi gaya di kanan harus sama besar dan berlawanan arah: $F(1)=100$, sehingga $F=100\text{ N}$.`,
      },
    ],
  },
];

export const PROGRES_AWAL: ProgresProblemSet = {
  versi: 1,
  percobaan: {},
  drafJawaban: {},
  topikDikumpulkan: {},
};

const STORAGE_KEY = "physlab-problem-set-v1";

export function bacaProgresProblemSet(): ProgresProblemSet {
  if (typeof window === "undefined") return PROGRES_AWAL;

  try {
    const tersimpan = window.localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return PROGRES_AWAL;

    const hasil = JSON.parse(tersimpan) as ProgresProblemSet;
    if (hasil.versi !== 1 || typeof hasil.percobaan !== "object" || !hasil.percobaan) {
      return PROGRES_AWAL;
    }
    const drafJawaban = hasil.drafJawaban ?? Object.fromEntries(
      Object.entries(hasil.percobaan).map(([id, percobaan]) => [id, percobaan.jawaban]),
    );
    const topikDikumpulkan = hasil.topikDikumpulkan ?? Object.fromEntries(
      BANK_SOAL_PROBLEM_SET.map((topik) => [
        topik.id,
        topik.soal.every((soal) => Boolean(hasil.percobaan[soal.id]?.diperiksa)),
      ]),
    );
    return { ...hasil, drafJawaban, topikDikumpulkan };
  } catch {
    return PROGRES_AWAL;
  }
}

export function simpanProgresProblemSet(progres: ProgresProblemSet): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progres));
  } catch {
    // Penyimpanan bisa ditolak browser dalam mode privat atau saat kuota penuh.
  }
}

function normalkanJawaban(nilai: string): string {
  return nilai
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/,/g, ".")
    .replace(/\s+/g, "");
}

export function periksaJawaban(soal: SoalProblemSet, jawaban: string): boolean {
  if (soal.jenis === "pilihan-ganda") {
    return jawaban.trim().toUpperCase() === soal.jawabanBenar;
  }

  const kandidat = normalkanJawaban(jawaban);
  if (!kandidat) return false;

  if (soal.jawabanDiterima.some((diterima) => normalkanJawaban(diterima) === kandidat)) {
    return true;
  }

  if (soal.jawabanNumerik) {
    const cocok = jawaban.trim().replace(/,/g, ".").match(/[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i);
    if (!cocok) return false;

    const angka = Number(cocok[0]);
    if (!Number.isFinite(angka) || Math.abs(angka - soal.jawabanNumerik.nilai) > soal.jawabanNumerik.toleransi) {
      return false;
    }

    const satuanMasukan = jawaban.replace(cocok[0], "").replace(/\s+/g, "").toLowerCase();
    const satuanHarapan = (soal.jawabanNumerik.satuan ?? "").replace(/\s+/g, "").toLowerCase();
    return satuanMasukan === "" || satuanMasukan === satuanHarapan;
  }

  return false;
}