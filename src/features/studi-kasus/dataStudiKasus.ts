import type { ModulDinamikaId, ModulKinematikaId } from "../../config/konfigurasiNavigasi";

export type JalurPembelajaran = "pbl" | "rbl";

export type ReferensiSimulasi =
  | { kategori: "kinematika"; modul: ModulKinematikaId; label: string }
  | { kategori: "dinamika"; modul: ModulDinamikaId; label: string };

export type PilihanAnalisis = {
  id: string;
  label: string;
};

export type StudiKasus = {
  id: string;
  jalur: JalurPembelajaran;
  judul: string;
  ringkasan: string;
  konteks: string;
  masalah: string;
  tujuan: string[];
  instruksi: string[];
  tingkat: "Dasar" | "Menengah" | "Lanjutan";
  durasi: string;
  rewardRp: number;
  simulasi: ReferensiSimulasi;
  pertanyaanAnalisis: string;
  pilihanAnalisis: PilihanAnalisis[];
  jawabanBenar: string;
  pembahasan: string;
};

export type CatatanLab = {
  hipotesis: string;
  dataPengamatan: string;
  kesimpulan: string;
  skenarioDibaca: boolean;
  analisisBenar: boolean;
};

export type ProgresLaboratorium = {
  versi: 1;
  researchPoints: number;
  kasusSelesai: string[];
  rewardDiklaim: string[];
  catatan: Record<string, CatatanLab>;
};

export const KUNCI_PENYIMPANAN_LAB = "physlab-laboratorium-virtual-v1";

export const CATATAN_KOSONG: CatatanLab = {
  hipotesis: "",
  dataPengamatan: "",
  kesimpulan: "",
  skenarioDibaca: false,
  analisisBenar: false,
};

export const DAFTAR_STUDI_KASUS: StudiKasus[] = [
  {
    id: "pbl-gerobak-pengangkut",
    jalur: "pbl",
    judul: "Rancang Gerobak Pengangkut",
    ringkasan: "Rancang sistem dorong yang mampu memindahkan muatan dengan percepatan terukur.",
    konteks: "Sebuah tim teknisi sekolah sedang merancang gerobak untuk memindahkan peralatan praktikum. Gerobak bermassa 20 kg didorong dengan gaya 80 N, sedangkan gaya gesek lantai sebesar 20 N berlawanan arah gerak.",
    masalah: "Tentukan percepatan resultan gerobak dan jelaskan bagaimana perubahan gaya dorong memengaruhi rancangan kendaraan.",
    tujuan: [
      "Mengidentifikasi gaya-gaya yang bekerja pada benda.",
      "Menentukan gaya resultan pada arah gerak.",
      "Menggunakan Hukum II Newton untuk mengevaluasi rancangan.",
    ],
    instruksi: [
      "Baca kondisi massa, gaya dorong, dan gaya gesek.",
      "Tuliskan hipotesis hubungan gaya resultan dengan percepatan.",
      "Uji perilaku benda pada simulasi Hukum Newton.",
      "Catat hasil pengamatan dan simpulkan kelayakan rancangan.",
    ],
    tingkat: "Dasar",
    durasi: "15–20 menit",
    rewardRp: 40,
    simulasi: { kategori: "dinamika", modul: "newton", label: "Hukum Newton & Sandbox Gaya" },
    pertanyaanAnalisis: "Dengan gaya dorong 80 N, gaya gesek 20 N, dan massa 20 kg, berapakah percepatan gerobak?",
    pilihanAnalisis: [
      { id: "a", label: "1 m/s²" },
      { id: "b", label: "2 m/s²" },
      { id: "c", label: "3 m/s²" },
      { id: "d", label: "5 m/s²" },
    ],
    jawabanBenar: "c",
    pembahasan: "Gaya resultan adalah 80 − 20 = 60 N. Dari Hukum II Newton, a = ΣF/m = 60/20 = 3 m/s².",
  },
  {
    id: "pbl-lengan-pengangkat",
    jalur: "pbl",
    judul: "Optimalkan Lengan Pengangkat",
    ringkasan: "Pilih posisi gaya agar lengan pengangkat menghasilkan momen gaya yang sesuai.",
    konteks: "Sebuah lengan pengangkat sederhana diberi gaya 120 N tegak lurus pada lengan sepanjang 0,40 m dari poros. Tim perancang ingin mengetahui besar torsi untuk memilih ukuran komponen poros.",
    masalah: "Hitung besar momen gaya dan jelaskan mengapa posisi titik kerja gaya memengaruhi kemampuan lengan untuk berputar.",
    tujuan: [
      "Mengidentifikasi poros dan lengan momen.",
      "Menghubungkan gaya dengan torsi.",
      "Mengevaluasi pengaruh jarak gaya terhadap putaran.",
    ],
    instruksi: [
      "Tentukan poros rotasi pada rancangan.",
      "Buat hipotesis tentang pengaruh panjang lengan.",
      "Uji posisi gaya pada simulasi rotasi.",
      "Catat hasil dan tuliskan rekomendasi desain.",
    ],
    tingkat: "Menengah",
    durasi: "20–25 menit",
    rewardRp: 50,
    simulasi: { kategori: "dinamika", modul: "rotasi", label: "Dinamika Rotasi & Kesetimbangan" },
    pertanyaanAnalisis: "Gaya 120 N bekerja tegak lurus pada jarak 0,40 m dari poros. Berapakah besar torsinya?",
    pilihanAnalisis: [
      { id: "a", label: "30 N·m" },
      { id: "b", label: "48 N·m" },
      { id: "c", label: "120 N·m" },
      { id: "d", label: "300 N·m" },
    ],
    jawabanBenar: "b",
    pembahasan: "Karena gaya tegak lurus lengan, τ = rF = 0,40 × 120 = 48 N·m.",
  },
  {
    id: "rbl-lintasan-parabola",
    jalur: "rbl",
    judul: "Selidiki Puncak Lintasan Parabola",
    ringkasan: "Gunakan bukti dari simulasi untuk menguji komponen kecepatan pada titik tertinggi.",
    konteks: "Sebuah bola dilontarkan dengan sudut tertentu dan hambatan udara diabaikan. Peneliti mengamati komponen kecepatan horizontal dan vertikal sepanjang lintasan untuk memahami gerak parabola.",
    masalah: "Apa yang terjadi pada komponen kecepatan vertikal bola tepat di titik tertinggi lintasannya?",
    tujuan: [
      "Membedakan komponen kecepatan horizontal dan vertikal.",
      "Menghubungkan percepatan gravitasi dengan perubahan kecepatan vertikal.",
      "Menggunakan hasil simulasi sebagai bukti penyelidikan.",
    ],
    instruksi: [
      "Tuliskan dugaan kondisi kecepatan di titik tertinggi.",
      "Amati lintasan dan komponen kecepatan pada simulasi parabola.",
      "Catat perubahan komponen kecepatan selama gerak.",
      "Bandingkan hasil pengamatan dengan hipotesis.",
    ],
    tingkat: "Menengah",
    durasi: "15–20 menit",
    rewardRp: 40,
    simulasi: { kategori: "kinematika", modul: "parabola", label: "Gerak Parabola" },
    pertanyaanAnalisis: "Jika hambatan udara diabaikan, bagaimana kecepatan vertikal bola tepat di titik tertinggi lintasan?",
    pilihanAnalisis: [
      { id: "a", label: "Nol sesaat" },
      { id: "b", label: "Maksimum ke atas" },
      { id: "c", label: "Tetap sama dengan kecepatan awal" },
      { id: "d", label: "Maksimum ke bawah" },
    ],
    jawabanBenar: "a",
    pembahasan: "Di titik tertinggi, komponen kecepatan vertikal sesaat bernilai nol sebelum arahnya berubah dari ke atas menjadi ke bawah. Komponen horizontal tetap konstan jika hambatan udara diabaikan.",
  },
  {
    id: "rbl-uji-gerak-glbb",
    jalur: "rbl",
    judul: "Uji Perpindahan pada GLBB",
    ringkasan: "Bandingkan prediksi matematis dengan hasil pengamatan gerak lurus berubah beraturan.",
    konteks: "Sebuah troli bergerak lurus dengan kecepatan awal 2 m/s. Motor kecil pada troli memberikan percepatan konstan 3 m/s² selama 4 sekon. Peneliti ingin menguji model perpindahan terhadap waktu.",
    masalah: "Prediksi perpindahan troli selama interval 4 sekon, kemudian cocokkan dengan hasil simulasi.",
    tujuan: [
      "Mengidentifikasi kecepatan awal, percepatan, dan waktu.",
      "Menerapkan persamaan perpindahan GLBB.",
      "Membandingkan prediksi dengan data simulasi.",
    ],
    instruksi: [
      "Catat besaran awal dari skenario.",
      "Buat hipotesis tentang perpindahan selama 4 sekon.",
      "Jalankan simulasi Gerak Lurus dan amati perubahan posisi.",
      "Bandingkan data dengan hasil perhitungan.",
    ],
    tingkat: "Dasar",
    durasi: "15 menit",
    rewardRp: 40,
    simulasi: { kategori: "kinematika", modul: "gerak-lurus", label: "Gerak Lurus (GLB & GLBB)" },
    pertanyaanAnalisis: "Troli memiliki v₀ = 2 m/s dan a = 3 m/s². Berapa perpindahan selama 4 s?",
    pilihanAnalisis: [
      { id: "a", label: "20 m" },
      { id: "b", label: "24 m" },
      { id: "c", label: "28 m" },
      { id: "d", label: "32 m" },
    ],
    jawabanBenar: "d",
    pembahasan: "Gunakan Δx = v₀t + ½at² = (2)(4) + ½(3)(4²) = 8 + 24 = 32 m.",
  },
];

export function buatCatatanKosong(): CatatanLab {
  return { ...CATATAN_KOSONG };
}

export function buatProgresAwal(): ProgresLaboratorium {
  return {
    versi: 1,
    researchPoints: 0,
    kasusSelesai: [],
    rewardDiklaim: [],
    catatan: {},
  };
}

function hanyaStringUnik(nilai: unknown): string[] {
  return Array.isArray(nilai)
    ? [...new Set(nilai.filter((item): item is string => typeof item === "string"))]
    : [];
}

/** Membaca progres secara defensif agar data localStorage yang rusak tidak merusak halaman. */
export function bacaProgresLaboratorium(): ProgresLaboratorium {
  if (typeof window === "undefined") return buatProgresAwal();

  try {
    const tersimpan = window.localStorage.getItem(KUNCI_PENYIMPANAN_LAB);
    if (!tersimpan) return buatProgresAwal();

    const data: unknown = JSON.parse(tersimpan);
    if (!data || typeof data !== "object") return buatProgresAwal();

    const mentah = data as Record<string, unknown>;
    const catatan: Record<string, CatatanLab> = {};
    if (mentah.catatan && typeof mentah.catatan === "object") {
      for (const [id, nilai] of Object.entries(mentah.catatan as Record<string, unknown>)) {
        if (!nilai || typeof nilai !== "object") continue;
        const item = nilai as Record<string, unknown>;
        catatan[id] = {
          hipotesis: typeof item.hipotesis === "string" ? item.hipotesis : "",
          dataPengamatan: typeof item.dataPengamatan === "string" ? item.dataPengamatan : "",
          kesimpulan: typeof item.kesimpulan === "string" ? item.kesimpulan : "",
          skenarioDibaca: item.skenarioDibaca === true,
          analisisBenar: item.analisisBenar === true,
        };
      }
    }

    const rp = Number(mentah.researchPoints);
    return {
      versi: 1,
      researchPoints: Number.isFinite(rp) ? Math.max(0, Math.floor(rp)) : 0,
      kasusSelesai: hanyaStringUnik(mentah.kasusSelesai),
      rewardDiklaim: hanyaStringUnik(mentah.rewardDiklaim),
      catatan,
    };
  } catch {
    return buatProgresAwal();
  }
}

export function simpanProgresLaboratorium(progres: ProgresLaboratorium): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KUNCI_PENYIMPANAN_LAB, JSON.stringify(progres));
  } catch {
    // Fitur tetap dapat digunakan selama sesi berjalan meskipun penyimpanan dibatasi browser.
  }
}

export function ambilCatatanKasus(progres: ProgresLaboratorium, kasusId: string): CatatanLab {
  return { ...buatCatatanKosong(), ...(progres.catatan[kasusId] ?? {}) };
}

export function hitungLevelPeneliti(rp: number) {
  const jenjang = [
    { nama: "Penjelajah Pemula", batas: 0, berikutnya: 50, simbol: "✧" },
    { nama: "Pengamat", batas: 50, berikutnya: 120, simbol: "◈" },
    { nama: "Eksperimenter", batas: 120, berikutnya: 220, simbol: "⌁" },
    { nama: "Peneliti Ahli", batas: 220, berikutnya: null, simbol: "✦" },
  ];
  const aktif = [...jenjang].reverse().find((level) => rp >= level.batas) ?? jenjang[0];
  const progresLevel = aktif.berikutnya === null
    ? 100
    : Math.min(100, Math.max(0, ((rp - aktif.batas) / (aktif.berikutnya - aktif.batas)) * 100));

  return { ...aktif, progresLevel };
}

export function daftarLencana(progres: ProgresLaboratorium) {
  const kasusSelesai = DAFTAR_STUDI_KASUS.filter((kasus) => progres.kasusSelesai.includes(kasus.id));
  const pblSelesai = kasusSelesai.some((kasus) => kasus.jalur === "pbl");
  const rblSelesai = kasusSelesai.some((kasus) => kasus.jalur === "rbl");

  return [
    { id: "langkah-pertama", nama: "Langkah Pertama", deskripsi: "Selesaikan satu studi kasus.", simbol: "◎", terbuka: kasusSelesai.length >= 1 },
    { id: "insinyur-pbl", nama: "Insinyur PBL", deskripsi: "Selesaikan proyek rekayasa.", simbol: "⚙", terbuka: pblSelesai },
    { id: "detektif-rbl", nama: "Detektif RBL", deskripsi: "Selesaikan riset penyelidikan.", simbol: "⌕", terbuka: rblSelesai },
    { id: "lintas-metode", nama: "Peneliti Lintas Jalur", deskripsi: "Selesaikan setidaknya satu PBL dan satu RBL.", simbol: "✧", terbuka: pblSelesai && rblSelesai },
    { id: "seratus-rp", nama: "Pengumpul Data", deskripsi: "Kumpulkan minimal 100 RP.", simbol: "◇", terbuka: progres.researchPoints >= 100 },
  ];
}