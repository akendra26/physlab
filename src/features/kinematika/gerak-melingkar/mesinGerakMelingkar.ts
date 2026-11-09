/** Model gerak melingkar beraturan (GMB) dan berubah beraturan (GMBB). */
export type ModeGerakMelingkar = "gmb" | "gmbb";

export type ParameterGerakMelingkar = {
  mode: ModeGerakMelingkar;
  jariJari: number;
  sudutAwalDerajat: number;
  kecepatanSudutAwal: number;
  percepatanSudut: number;
  durasi: number;
};

export type KeadaanGerakMelingkar = {
  waktu: number;
  sudut: number;
  sudutDerajat: number;
  posisiX: number;
  posisiY: number;
  kecepatanSudut: number;
  percepatanSudut: number;
  kecepatanTangensial: number;
  percepatanSentripetal: number;
  percepatanTangensial: number;
  periodeSesaat: number | null;
};

export const PARAMETER_AWAL_GERAK_MELINGKAR: ParameterGerakMelingkar = {
  mode: "gmb",
  jariJari: 3,
  sudutAwalDerajat: 0,
  kecepatanSudutAwal: 2,
  percepatanSudut: 0.5,
  durasi: 10,
};

const BATAS_OMEGA_NOL = 1e-9;

function validasiParameter(parameter: ParameterGerakMelingkar): void {
  const nilai = [
    parameter.jariJari,
    parameter.sudutAwalDerajat,
    parameter.kecepatanSudutAwal,
    parameter.percepatanSudut,
    parameter.durasi,
  ];

  if (!nilai.every(Number.isFinite)) {
    throw new Error("Semua parameter gerak melingkar harus berupa bilangan yang valid.");
  }
  if (parameter.jariJari <= 0) {
    throw new Error("Jari-jari lintasan harus lebih besar dari nol.");
  }
  if (parameter.durasi <= 0) {
    throw new Error("Durasi simulasi harus lebih besar dari nol.");
  }
  if (parameter.mode !== "gmb" && parameter.mode !== "gmbb") {
    throw new Error("Mode gerak harus GMB atau GMBB.");
  }
}

function validasiWaktu(waktu: number): void {
  if (!Number.isFinite(waktu) || waktu < 0) {
    throw new Error("Waktu harus berupa bilangan valid dan tidak negatif.");
  }
}

export function derajatKeRadian(sudutDerajat: number): number {
  if (!Number.isFinite(sudutDerajat)) {
    throw new Error("Sudut harus berupa bilangan yang valid.");
  }
  return (sudutDerajat * Math.PI) / 180;
}

/** Sudut posisi dalam radian; tanda omega positif berarti berlawanan arah jarum jam. */
export function hitungKeadaanGerakMelingkar(
  parameter: ParameterGerakMelingkar,
  waktu: number,
): KeadaanGerakMelingkar {
  validasiParameter(parameter);
  validasiWaktu(waktu);

  const r = parameter.jariJari;
  const theta0 = derajatKeRadian(parameter.sudutAwalDerajat);
  const alpha = parameter.mode === "gmbb" ? parameter.percepatanSudut : 0;
  const omega = parameter.kecepatanSudutAwal + alpha * waktu;
  const theta = theta0
    + parameter.kecepatanSudutAwal * waktu
    + 0.5 * alpha * waktu * waktu;
  const periodeSesaat = Math.abs(omega) > BATAS_OMEGA_NOL
    ? (2 * Math.PI) / Math.abs(omega)
    : null;

  return {
    waktu,
    sudut: theta,
    sudutDerajat: (theta * 180) / Math.PI,
    posisiX: r * Math.cos(theta),
    posisiY: r * Math.sin(theta),
    kecepatanSudut: omega,
    percepatanSudut: alpha,
    kecepatanTangensial: Math.abs(omega) * r,
    percepatanSentripetal: omega * omega * r,
    percepatanTangensial: Math.abs(alpha) * r,
    periodeSesaat,
  };
}

/** Periode GMB konstan; pada GMBB nilai ini adalah periode sesaat saat t yang diminta. */
export function hitungPeriodeSesaat(
  parameter: ParameterGerakMelingkar,
  waktu: number,
): number | null {
  return hitungKeadaanGerakMelingkar(parameter, waktu).periodeSesaat;
}

export function hitungJumlahPutaran(
  parameter: ParameterGerakMelingkar,
  waktu: number,
): number {
  const keadaan = hitungKeadaanGerakMelingkar(parameter, waktu);
  return (keadaan.sudut - derajatKeRadian(parameter.sudutAwalDerajat)) / (2 * Math.PI);
}
