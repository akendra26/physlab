/**
 * Bank soal tiruan (mock) untuk modul Problem Set PhysLab.
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
        pertanyaan: String.raw`Sebuah kendaraan bergerak lurus beraturan dengan kecepatan tetap $12 \text{m/s}$. Berapa perpindahan kendaraan setelah bergerak selama $5 \text{s}$?`,
        petunjuk: "Pada GLB, kecepatan tidak berubah selama selang waktu yang ditinjau.",
        opsi: [
          { id: "A", teks: "$50 \t{m}$" },
          { id: "B", teks: "$60 \t{m}$" },
          { id: "C", teks: "$65 \t{m}$" },
          { id: "D", teks: "$72 \t{m}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$60 \text{m}$",
        pembahasan: String.raw`Gunakan hubungan GLB $\Delta x = v t$. Dengan $v=12 \text{m/s}$ dan $t=5 \text{s}$, diperoleh $\Delta x=12\times5=60 \text{m}$.`,
      },
      {
        id: "glb-glbb-02",
        jenis: "isian-singkat",
        tingkat: "Dasar",
        pertanyaan: String.raw`Sebuah benda mula-mula diam, kemudian mengalami percepatan konstan $2{,}5 \text{m/s}^2$ selama $4 \text{s}$. Tentukan kecepatan akhirnya dalam $\text{m/s}$.`,
        petunjuk: "Hubungkan kecepatan awal, percepatan, dan waktu.",
        jawabanDiterima: ["10", "10 m/s", "10m/s"],
        jawabanNumerik: { nilai: 10, toleransi: 0.05, satuan: "m/s" },
        jawabanAkhir: "$10 \text{m/s}$",
        pembahasan: String.raw`Persamaan GLBB adalah $v_t=v_0+at$. Karena $v_0=0$, maka $v_t=0+(2{,}5)(4)=10 \text{m/s}$.`,
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
        pertanyaan: String.raw`Sebuah bola dilempar vertikal ke atas dengan kecepatan awal $20 \text{m/s}$. Jika $g=10 \text{m/s}^2$ dan hambatan udara diabaikan, berapa ketinggian maksimum relatif terhadap titik lempar?`,
        petunjuk: "Di titik tertinggi, kecepatan sesaat bola bernilai nol.",
        opsi: [
          { id: "A", teks: "$10 \text{m}$" },
          { id: "B", teks: "$15 \text{m}$" },
          { id: "C", teks: "$20 \text{m}$" },
          { id: "D", teks: "$40 \text{m}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$20 \text{m}$",
        pembahasan: String.raw`Gunakan $v_t^2=v_0^2-2gh$. Pada titik tertinggi $v_t=0$, sehingga $h=\frac{v_0^2}{2g}=\frac{20^2}{2(10)}=20 \text{m}$.`,
      },
      {
        id: "vertikal-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah benda dijatuhkan dari keadaan diam pada ketinggian $45 \text{m}$. Dengan $g=10 \text{m/s}^2$, berapa waktu yang diperlukan untuk mencapai tanah?`,
        petunjuk: "Untuk benda yang dijatuhkan dari diam, jarak jatuh bergantung pada kuadrat waktu.",
        jawabanDiterima: ["3", "3 s", "3s", "3 detik"],
        jawabanNumerik: { nilai: 3, toleransi: 0.05, satuan: "s" },
        jawabanAkhir: "$3 \text{s}$",
        pembahasan: String.raw`Gunakan $h=\frac{1}{2}gt^2$. Maka $t=\sqrt{\frac{2h}{g}}=\sqrt{\frac{2(45)}{10}}=\sqrt{9}=3 \text{s}$.`,
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
        pertanyaan: String.raw`Sebuah proyektil ditembakkan dari tanah dengan kecepatan awal $20 \text{m/s}$ pada sudut $30^\circ$. Jika $g=10 \text{m/s}^2$ dan proyektil kembali ke ketinggian awal, berapa jangkauan horizontalnya? Gunakan $\sin 60^\circ\approx0{,}866$.`,
        petunjuk: "Jangkauan menggabungkan komponen kecepatan horizontal dan waktu total di udara.",
        opsi: [
          { id: "A", teks: "$20 \text{m}$" },
          { id: "B", teks: "$30 \text{m}$" },
          { id: "C", teks: "$34{,}6 \text{m}$" },
          { id: "D", teks: "$40 \text{m}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$34{,}6 \text{m}$",
        pembahasan: String.raw`Jangkauan proyektil pada ketinggian awal dan akhir yang sama adalah $R=\frac{v_0^2\sin 2\theta}{g}$. Jadi $R=\frac{20^2\sin60^\circ}{10}=40(0{,}866)=34{,}64 \text{m}\approx34{,}6 \text{m}$.`,
      },
      {
        id: "parabola-02",
        jenis: "isian-singkat",
        tingkat: "Dasar",
        pertanyaan: String.raw`Proyektil diluncurkan dengan $v_0=20 \text{m/s}$ pada sudut $30^\circ$ terhadap horizontal. Jika $g=10 \text{m/s}^2$ dan ketinggian akhir sama dengan ketinggian awal, tentukan waktu total di udara.`,
        petunjuk: "Gunakan komponen kecepatan awal pada arah vertikal.",
        jawabanDiterima: ["2", "2 s", "2s", "2 detik"],
        jawabanNumerik: { nilai: 2, toleransi: 0.05, satuan: "s" },
        jawabanAkhir: "$2 \text{s}$",
        pembahasan: String.raw`Waktu total adalah $T=\frac{2v_0\sin\theta}{g}=\frac{2(20)(0{,}5)}{10}=2 \text{s}$.`,
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
        pertanyaan: String.raw`Sebuah titik pada tepi roda berjarak $0{,}5 \text{m}$ dari pusat. Jika roda berputar dengan kecepatan sudut $4 \text{rad/s}$, berapa besar kecepatan linear titik tersebut?`,
        petunjuk: "Kecepatan linear berkaitan dengan jari-jari dan kecepatan sudut.",
        opsi: [
          { id: "A", teks: "$1 \text{m/s}$" },
          { id: "B", teks: "$2 \text{m/s}$" },
          { id: "C", teks: "$4 \text{m/s}$" },
          { id: "D", teks: "$8 \text{m/s}$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$2 \text{m/s}$",
        pembahasan: String.raw`Gunakan $v=\omega r$. Dengan $\omega=4 \text{rad/s}$ dan $r=0{,}5 \text{m}$, maka $v=4(0{,}5)=2 \text{m/s}$.`,
      },
      {
        id: "melingkar-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah benda bergerak melingkar dengan kelajuan $6 \text{m/s}$ pada lintasan berjari-jari $3 \text{m}$. Tentukan percepatan sentripetalnya dalam $\text{m/s}^2$.`,
        petunjuk: "Percepatan sentripetal sebanding dengan kuadrat kelajuan dan berbanding terbalik dengan jari-jari.",
        jawabanDiterima: ["12", "12 m/s2", "12m/s2", "12 m/s^2"],
        jawabanNumerik: { nilai: 12, toleransi: 0.05, satuan: "m/s^2" },
        jawabanAkhir: "$12 \text{m/s}^2$",
        pembahasan: String.raw`Percepatan sentripetal $a_s=\frac{v^2}{r}=\frac{6^2}{3}=\frac{36}{3}=12 \text{m/s}^2$.`,
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
        pertanyaan: String.raw`Sebuah benda bermassa $5 \text{kg}$ dikenai resultan gaya horizontal sebesar $20 \text{N}$. Berapa percepatan benda?`,
        petunjuk: "Perhatikan hubungan antara resultan gaya, massa, dan percepatan.",
        opsi: [
          { id: "A", teks: "$2 \text{m/s}^2$" },
          { id: "B", teks: "$4 \text{m/s}^2$" },
          { id: "C", teks: "$5 \text{m/s}^2$" },
          { id: "D", teks: "$10 \text{m/s}^2$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$4 \text{m/s}^2$",
        pembahasan: String.raw`Menurut Hukum II Newton, $\sum F=ma$. Maka $a=\frac{\sum F}{m}=\frac{20}{5}=4 \text{m/s}^2$.`,
      },
      {
        id: "newton-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Seorang bermassa $60 \text{kg}$ berdiri di dalam lift yang mengalami percepatan $2 \text{m/s}^2$ ke atas. Dengan $g=10 \text{m/s}^2$, berapa gaya normal lantai lift pada orang tersebut?`,
        petunjuk: "Untuk percepatan ke atas, gaya normal lebih besar daripada berat.",
        jawabanDiterima: ["720", "720 n", "720N"],
        jawabanNumerik: { nilai: 720, toleransi: 0.5, satuan: "N" },
        jawabanAkhir: "$720 \text{N}$",
        pembahasan: String.raw`Ambil arah atas positif: $N-mg=ma$. Jadi $N=m(g+a)=60(10+2)=720 \text{N}$.`,
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
        pertanyaan: String.raw`Dua massa $m_1=3 \text{kg}$ dan $m_2=2 \text{kg}$ dihubungkan oleh tali ringan melalui katrol ideal. Jika $g=10 \text{m/s}^2$, berapa besar percepatan sistem Atwood?`,
        petunjuk: "Resultan gaya penggerak berasal dari selisih berat kedua massa.",
        opsi: [
          { id: "A", teks: "$1 \text{m/s}^2$" },
          { id: "B", teks: "$2 \text{m/s}^2$" },
          { id: "C", teks: "$4 \text{m/s}^2$" },
          { id: "D", teks: "$5 \text{m/s}^2$" },
        ],
        jawabanBenar: "B",
        jawabanAkhir: "$2 \text{m/s}^2$",
        pembahasan: String.raw`Untuk katrol ideal, $a=\frac{m_1-m_2}{m_1+m_2}g=\frac{3-2}{3+2}(10)=2 \text{m/s}^2$.`,
      },
      {
        id: "atwood-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Seseorang bermassa $50 \text{kg}$ berada di lift yang dipercepat ke bawah sebesar $2 \text{m/s}^2$. Jika $g=10 \text{m/s}^2$, tentukan besar gaya normal yang dirasakan orang tersebut.`,
        petunjuk: "Saat lift dipercepat ke bawah, gaya normal lebih kecil daripada berat.",
        jawabanDiterima: ["400", "400 n", "400N"],
        jawabanNumerik: { nilai: 400, toleransi: 0.5, satuan: "N" },
        jawabanAkhir: "$400 \text{N}$",
        pembahasan: String.raw`Dengan arah atas positif, $N-mg=-ma$, sehingga $N=m(g-a)=50(10-2)=400 \text{N}$.`,
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
        pertanyaan: String.raw`Sebuah batang ringan berporos pada satu titik. Gaya $10 \text{N}$ bekerja tegak lurus batang pada jarak $2 \text{m}$ di sebelah kiri poros. Berapa besar gaya yang harus bekerja tegak lurus pada jarak $1 \text{m}$ di sebelah kanan poros agar resultan torsi nol?`,
        petunjuk: "Pada kesetimbangan rotasi, jumlah torsi searah jarum jam dan berlawanan arah jarum jam saling meniadakan.",
        opsi: [
          { id: "A", teks: "$5 \text{N}$" },
          { id: "B", teks: "$10 \text{N}$" },
          { id: "C", teks: "$20 \text{N}$" },
          { id: "D", teks: "$40 \text{N}$" },
        ],
        jawabanBenar: "C",
        jawabanAkhir: "$20 \text{N}$",
        pembahasan: String.raw`Syarat torsi nol: $F_1r_1=F_2r_2$. Maka $F_2=\frac{10(2)}{1}=20 \text{N}$.`,
      },
      {
        id: "setimbang-02",
        jenis: "isian-singkat",
        tingkat: "Menengah",
        pertanyaan: String.raw`Sebuah tuas seimbang pada poros. Gaya $30 \text{N}$ bekerja tegak lurus pada lengan $2 \text{m}$. Berapa gaya berlawanan arah yang diperlukan pada lengan $1{,}5 \text{m}$ agar tuas tetap seimbang?`,
        petunjuk: "Samakan besar momen gaya pada kedua sisi poros.",
        jawabanDiterima: ["40", "40 n", "40N"],
        jawabanNumerik: { nilai: 40, toleransi: 0.1, satuan: "N" },
        jawabanAkhir: "$40 \text{N}$",
        pembahasan: String.raw`Gunakan $F_1r_1=F_2r_2$. Maka $F_2=\frac{30(2)}{1{,}5}=40 \text{N}$.`,
      },
    ],
  },
];

export const PROGRES_AWAL: ProgresProblemSet = {
  versi: 1,
  percobaan: {},
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
    return hasil;
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