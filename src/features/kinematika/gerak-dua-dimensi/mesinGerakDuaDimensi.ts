/** Model gerak dua dimensi untuk gerak jatuh bebas dan gerak parabola ideal. */
export type ModeGerakDuaDimensi = "projectile" | "freefall";

export type ParameterGerakDuaDimensi = {
  speed: number;
  angleDeg: number;
  gravity: number;
  initialHeight: number;
};

export type KeadaanGerak = {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
};

export type MetrikGerak = {
  duration: number;
  range: number;
  maxHeight: number;
  finalSpeed: number;
  acceleration: number;
};

export const PARAMETER_AWAL_DUA_DIMENSI: ParameterGerakDuaDimensi = {
  speed: 20,
  angleDeg: 45,
  gravity: 9.81,
  initialHeight: 0,
};

function validasiParameter(parameter: ParameterGerakDuaDimensi): void {
  const nilai = Object.values(parameter);
  if (!nilai.every(Number.isFinite)) {
    throw new Error("Semua parameter harus berupa bilangan yang valid.");
  }
  if (parameter.speed < 0 || parameter.angleDeg < 0 || parameter.angleDeg > 360) {
    throw new Error("Kecepatan tidak boleh negatif dan sudut harus berada pada rentang 0°–360°.");
  }
  if (parameter.gravity <= 0 || parameter.initialHeight < 0) {
    throw new Error("Gravitasi harus positif dan ketinggian awal tidak boleh negatif.");
  }
}

function validasiWaktu(waktu: number): void {
  if (!Number.isFinite(waktu) || waktu < 0) {
    throw new Error("Waktu harus berupa bilangan tidak negatif.");
  }
}

export function hitungGerakParabola(
  parameter: ParameterGerakDuaDimensi,
  waktu: number,
): KeadaanGerak {
  validasiParameter(parameter);
  validasiWaktu(waktu);

  const sudut = (parameter.angleDeg * Math.PI) / 180;
  const kecepatanXAwal = parameter.speed * Math.cos(sudut);
  const kecepatanYAwal = parameter.speed * Math.sin(sudut);

  return {
    t: waktu,
    x: kecepatanXAwal * waktu,
    y: parameter.initialHeight + kecepatanYAwal * waktu - 0.5 * parameter.gravity * waktu * waktu,
    vx: kecepatanXAwal,
    vy: kecepatanYAwal - parameter.gravity * waktu,
    ax: 0,
    ay: -parameter.gravity,
  };
}

export function hitungMetrikParabola(parameter: ParameterGerakDuaDimensi): MetrikGerak {
  validasiParameter(parameter);
  const sudut = (parameter.angleDeg * Math.PI) / 180;
  const kecepatanXAwal = parameter.speed * Math.cos(sudut);
  const kecepatanYAwal = parameter.speed * Math.sin(sudut);
  const diskriminan = kecepatanYAwal ** 2 + 2 * parameter.gravity * parameter.initialHeight;
  const durasi = (kecepatanYAwal + Math.sqrt(diskriminan)) / parameter.gravity;
  const tinggiMaksimum = parameter.initialHeight + kecepatanYAwal ** 2 / (2 * parameter.gravity);
  const jarak = kecepatanXAwal * durasi;
  const kecepatanYTerakhir = kecepatanYAwal - parameter.gravity * durasi;

  return {
    duration: durasi,
    range: jarak,
    maxHeight: tinggiMaksimum,
    finalSpeed: Math.hypot(kecepatanXAwal, kecepatanYTerakhir),
    acceleration: parameter.gravity,
  };
}

export function hitungJatuhBebas(
  parameter: ParameterGerakDuaDimensi,
  waktu: number,
): KeadaanGerak {
  validasiParameter(parameter);
  validasiWaktu(waktu);

  const durasiJatuh = Math.sqrt((2 * parameter.initialHeight) / parameter.gravity);
  const ketinggian = Math.max(0, parameter.initialHeight - 0.5 * parameter.gravity * waktu * waktu);
  const sudahMenyentuhTanah = parameter.initialHeight === 0 || waktu > durasiJatuh;

  return {
    t: waktu,
    x: 0,
    y: ketinggian,
    vx: 0,
    // Pada saat tepat menyentuh tanah, kecepatan masuk tetap ditampilkan.
    vy: sudahMenyentuhTanah ? 0 : -parameter.gravity * waktu,
    ax: 0,
    ay: sudahMenyentuhTanah ? 0 : -parameter.gravity,
  };
}

export function hitungMetrikJatuhBebas(parameter: ParameterGerakDuaDimensi): MetrikGerak {
  validasiParameter(parameter);
  const durasi = Math.sqrt((2 * parameter.initialHeight) / parameter.gravity);
  return {
    duration: durasi,
    range: 0,
    maxHeight: parameter.initialHeight,
    finalSpeed: Math.sqrt(2 * parameter.gravity * parameter.initialHeight),
    acceleration: parameter.gravity,
  };
}

export function hitungKeadaanGerak(
  mode: ModeGerakDuaDimensi,
  parameter: ParameterGerakDuaDimensi,
  waktu: number,
): KeadaanGerak {
  return mode === "freefall"
    ? hitungJatuhBebas(parameter, waktu)
    : hitungGerakParabola(parameter, waktu);
}

export function hitungMetrikGerak(
  mode: ModeGerakDuaDimensi,
  parameter: ParameterGerakDuaDimensi,
): MetrikGerak {
  return mode === "freefall"
    ? hitungMetrikJatuhBebas(parameter)
    : hitungMetrikParabola(parameter);
}
