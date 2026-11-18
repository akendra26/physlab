/**
 * Model fisika untuk tab kurikulum Dinamika SMA.
 * Seluruh besaran memakai satuan SI. Fungsi di file ini murni (tanpa React/DOM)
 * agar mudah diuji dan dipisahkan dari komponen visualisasi.
 */

export type SkenarioDinamika = "balok" | "osilasi";
export type OrientasiPegas = "horizontal" | "vertikal";
export type ModeOsilasi = "pegas" | "bandul";

export type ParameterKurikulumDinamika = {
  massa: number;
  gaya: number;
  muStatis: number;
  muKinetis: number;
  gravitasi: number;
  sudutGaya: number;
  konstantaPegas: number;
  redaman: number;
  panjangBandul: number;
  amplitudo: number;
  modeOsilasi: ModeOsilasi;
  orientasiPegas: OrientasiPegas;
};

export const PARAMETER_AWAL_KURIKULUM: ParameterKurikulumDinamika = {
  massa: 5,
  gaya: 35,
  muStatis: 0.4,
  muKinetis: 0.25,
  gravitasi: 9.81,
  sudutGaya: 0,
  konstantaPegas: 12,
  redaman: 0.12,
  panjangBandul: 1.5,
  amplitudo: 0.45,
  modeOsilasi: "pegas",
  orientasiPegas: "horizontal",
};

export type KeadaanDinamika = {
  displacement: number;
  velocity: number;
  acceleration: number;
  normalForce: number;
  weightForce: number;
  frictionForce: number;
  appliedForce: number;
  appliedForceX: number;
  appliedForceY: number;
  verticalDisplacement: number;
  verticalVelocity: number;
  verticalAcceleration: number;
  angle: number;
  angularVelocity: number;
  angularAcceleration: number;
  staticFriction: boolean;
  status: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const finiteClamp = (value: number, fallback: number, min: number, max: number) =>
  clamp(Number.isFinite(value) ? value : fallback, min, max);

function keadaanKosong(status: string): KeadaanDinamika {
  return {
    displacement: 0, velocity: 0, acceleration: 0,
    normalForce: 0, weightForce: 0, frictionForce: 0,
    appliedForce: 0, appliedForceX: 0, appliedForceY: 0,
    verticalDisplacement: 0, verticalVelocity: 0, verticalAcceleration: 0,
    angle: 0, angularVelocity: 0, angularAcceleration: 0,
    staticFriction: false, status,
  };
}

/** Osilator satu dimensi dengan rasio redaman ζ, berlaku untuk under/critical/overdamped. */
export function hitungOsilatorTeredam(
  posisiAwal: number,
  kecepatanAwal: number,
  frekuensiAlami: number,
  rasioRedaman: number,
  waktu: number,
) {
  const t = finiteClamp(waktu, 0, 0, 600);
  const posisi0 = finiteClamp(posisiAwal, 0, -1e4, 1e4);
  const kecepatan0 = finiteClamp(kecepatanAwal, 0, -1e5, 1e5);
  const omega0 = finiteClamp(frekuensiAlami, 1, 1e-9, 1e4);
  const zeta = finiteClamp(rasioRedaman, 0, 0, 10);
  const alpha = zeta * omega0;
  let posisi: number;
  let kecepatan: number;

  if (zeta < 1 - 1e-7) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    const b = (kecepatan0 + alpha * posisi0) / omegaD;
    const c = Math.cos(omegaD * t);
    const s = Math.sin(omegaD * t);
    const envelope = Math.exp(-alpha * t);
    const q = posisi0 * c + b * s;
    const qDot = -posisi0 * omegaD * s + b * omegaD * c;
    posisi = envelope * q;
    kecepatan = envelope * (qDot - alpha * q);
  } else if (Math.abs(zeta - 1) <= 1e-7) {
    const b = kecepatan0 + alpha * posisi0;
    const q = posisi0 + b * t;
    posisi = Math.exp(-alpha * t) * q;
    kecepatan = Math.exp(-alpha * t) * (b - alpha * q);
  } else {
    const akar = omega0 * Math.sqrt(zeta * zeta - 1);
    const r1 = -alpha + akar;
    const r2 = -alpha - akar;
    const c1 = (kecepatan0 - r2 * posisi0) / (r1 - r2);
    const c2 = posisi0 - c1;
    const term1 = c1 * Math.exp(r1 * t);
    const term2 = c2 * Math.exp(r2 * t);
    posisi = term1 + term2;
    kecepatan = r1 * term1 + r2 * term2;
  }

  const percepatan = -2 * alpha * kecepatan - omega0 * omega0 * posisi;
  return { posisi, kecepatan, percepatan, omega0, alpha };
}

export function hitungKeadaanDinamika(
  skenario: SkenarioDinamika,
  p: ParameterKurikulumDinamika,
  waktu: number,
): KeadaanDinamika {
  const t = finiteClamp(waktu, 0, 0, 600);
  const m1 = finiteClamp(p.massa, 5, 0.05, 500);
  const g = finiteClamp(p.gravitasi, 9.81, 0.01, 60);
  const gayaParam = finiteClamp(p.gaya, 0, -1e4, 1e4);
  const muStatisParam = finiteClamp(p.muStatis, 0.4, 0, 2);
  const muKinetisParam = Math.min(muStatisParam, finiteClamp(p.muKinetis, 0.25, 0, 2));
  const sudutGayaDerajat = finiteClamp(p.sudutGaya, 0, 0, 360);
  const sudutGayaParam = sudutGayaDerajat * Math.PI / 180;
  const konstantaPegas = finiteClamp(p.konstantaPegas, 12, 0.01, 1e4);
  const redamanParam = finiteClamp(p.redaman, 0.12, 0, 10);
  const panjangBandul = finiteClamp(p.panjangBandul, 1.5, 0.05, 100);
  const amplitudo = finiteClamp(p.amplitudo, 0.45, -100, 100);

  if (skenario === "balok") {
    const berat = m1 * g;
    const komponenX = gayaParam * Math.cos(sudutGayaParam);
    const komponenY = gayaParam * Math.sin(sudutGayaParam);
    const terangkat = komponenY > berat + 1e-9;
    const normal = terangkat ? 0 : Math.max(0, berat - komponenY);
    const muStatis = Math.max(0, muStatisParam);
    const muKinetis = Math.min(muStatis, Math.max(0, muKinetisParam));
    const gayaGesekMaks = muStatis * normal;
    const statis = !terangkat && Math.abs(komponenX) <= gayaGesekMaks + 1e-9;
    const gesek = terangkat ? 0 : statis ? Math.abs(komponenX) : muKinetis * normal;
    const percepatan = statis ? 0 : (komponenX - Math.sign(komponenX) * gesek) / m1;
    const percepatanVertikal = terangkat ? (komponenY - berat) / m1 : 0;
    const perpindahan = 0.5 * percepatan * t * t;
    return {
      ...keadaanKosong(terangkat
        ? "Balok terangkat: komponen vertikal gaya melebihi berat sehingga gaya normal nol."
        : statis
          ? "Diam: gesekan statis menyeimbangkan komponen horizontal gaya luar."
          : "Bergerak: gesekan kinetis melawan arah gerak horizontal."),
      displacement: perpindahan,
      velocity: percepatan * t,
      acceleration: percepatan,
      normalForce: normal,
      weightForce: berat,
      frictionForce: gesek,
      appliedForce: gayaParam,
      appliedForceX: komponenX,
      appliedForceY: komponenY,
      verticalDisplacement: 0.5 * percepatanVertikal * t * t,
      verticalVelocity: percepatanVertikal * t,
      verticalAcceleration: percepatanVertikal,
      staticFriction: statis,
    };
  }

  const rasioRedaman = clamp(redamanParam, 0, 1.5);
  if (p.modeOsilasi === "pegas") {
    const omega0 = Math.sqrt(Math.max(0.01, konstantaPegas) / m1);
    const hasil = hitungOsilatorTeredam(amplitudo, 0, omega0, rasioRedaman, t);
    return {
      ...keadaanKosong("Gerak harmonik teredam: gaya pemulih mengikuti Hukum Hooke dan redaman sebanding kecepatan."),
      displacement: hasil.posisi,
      velocity: hasil.kecepatan,
      acceleration: hasil.percepatan,
      normalForce: 0,
      weightForce: m1 * g,
      appliedForce: -konstantaPegas * hasil.posisi,
    };
  }

  // Bandul matematis pada pendekatan sudut kecil: sin θ ≈ θ.
  const theta0 = (clamp(amplitudo, 1, 45) * Math.PI) / 180;
  const omega0 = Math.sqrt(g / Math.max(0.05, panjangBandul));
  const hasil = hitungOsilatorTeredam(theta0, 0, omega0, rasioRedaman, t);
  return {
    ...keadaanKosong("Bandul matematis memakai pendekatan sudut kecil (sin θ ≈ θ) dengan redaman viskos ekuivalen."),
    displacement: hasil.posisi,
    velocity: hasil.kecepatan,
    acceleration: hasil.percepatan,
    angle: hasil.posisi,
    angularVelocity: hasil.kecepatan,
    angularAcceleration: hasil.percepatan,
    weightForce: m1 * g,
  };
}

export function buatSampelGrafikDinamika(
  skenario: SkenarioDinamika,
  p: ParameterKurikulumDinamika,
  durasi = 12,
  jumlah = 121,
) {
  return Array.from({ length: jumlah }, (_, index) => {
    const t = (durasi * index) / (jumlah - 1);
    return { ...hitungKeadaanDinamika(skenario, p, t), waktu: t };
  });
}
