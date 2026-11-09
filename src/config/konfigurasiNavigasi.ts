export type KategoriSimulasi = "kinematika" | "dinamika" | "trivia-kuis" | "studi-kasus" | "problem-set";

/**
 * Navigasi Kinematika pada tingkat pertama berisi kelompok gerak.
 * GLB/GLBB dan GMB/GMBB dipilih melalui tab di dalam halaman kelompoknya.
 */
export const DAFTAR_MODUL_KINEMATIKA = [
  { id: "gerak-lurus", nama: "Gerak Lurus", singkatan: "GLB · GLBB", simbol: "↔", status: "aktif" },
  { id: "gerak-melingkar", nama: "Gerak Melingkar", singkatan: "GMB · GMBB", simbol: "⟳", status: "aktif" },
  { id: "gjb", nama: "Gerak Jatuh Bebas", singkatan: "GJB", simbol: "↓", status: "aktif" },
  { id: "vertikal", nama: "Gerak Vertikal", singkatan: "GV", simbol: "↕", status: "aktif" },
  { id: "parabola", nama: "Gerak Parabola", singkatan: "GP", simbol: "⌁", status: "aktif" },
] as const;

export type ModulKinematikaId = (typeof DAFTAR_MODUL_KINEMATIKA)[number]["id"];

/** Sub-menu Dinamika ditampilkan di sidebar dengan pola yang sama seperti Kinematika. */
export const DAFTAR_MODUL_DINAMIKA = [
  {
    id: "newton",
    nama: "Hukum Newton & Sandbox Gaya",
    singkatan: "GAYA · TRANSLASI",
    simbol: "▰",
    status: "aktif",
  },
  {
    id: "sistem",
    nama: "Sistem Dinamika & Penerapan",
    singkatan: "KATROL · LIFT",
    simbol: "⛓",
    status: "aktif",
  },
  {
    id: "rotasi",
    nama: "Dinamika Rotasi & Kesetimbangan",
    singkatan: "TORSI · INERSIA",
    simbol: "⟳",
    status: "aktif",
  },
] as const;

export type ModulDinamikaId = (typeof DAFTAR_MODUL_DINAMIKA)[number]["id"];