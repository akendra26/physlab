export type KategoriSimulasi = "kinematika" | "dinamika" | "trivia-kuis" | "studi-kasus" | "problem-set";

export const DAFTAR_MODUL_KINEMATIKA = [
  { id: "glb", nama: "Gerak Lurus Beraturan", singkatan: "GLB", simbol: "→", status: "aktif" },
  { id: "glbb", nama: "Gerak Lurus Berubah Beraturan", singkatan: "GLBB", simbol: "⇢", status: "aktif" },
  { id: "parabola", nama: "Gerak Parabola", singkatan: "PROYEKTIL", simbol: "⌁", status: "aktif" },
  { id: "vertikal", nama: "Gerak Jatuh Bebas", singkatan: "GJB", simbol: "↧", status: "aktif" },
] as const;
export type ModulKinematikaId = (typeof DAFTAR_MODUL_KINEMATIKA)[number]["id"];

export const DAFTAR_MODUL_DINAMIKA = [
  { id: "newton", nama: "Dinamika Newton", singkatan: "BALOK · SUDUT GAYA", simbol: "ΣF", status: "aktif" },
  { id: "osilasi", nama: "Osilasi", singkatan: "PEGAS · BANDUL", simbol: "∿", status: "aktif" },
  { id: "atwood", nama: "Katrol Atwood", singkatan: "SISTEM KATROL", simbol: "⚙", status: "aktif" },
  { id: "lift", nama: "Lift", singkatan: "DINAMIKA ELEVATOR", simbol: "↕", status: "aktif" },
] as const;
export type ModulDinamikaId = (typeof DAFTAR_MODUL_DINAMIKA)[number]["id"];
