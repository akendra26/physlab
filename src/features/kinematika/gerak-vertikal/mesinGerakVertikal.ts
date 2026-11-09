/**
 * Model gerak vertikal satu dimensi.
 * Sumbu y positif ke atas, sedangkan percepatan gravitasi selalu ke bawah.
 */
export type ArahGerakVertikal = "atas" | "bawah";

export type ParameterGerakVertikal = {
  arah: ArahGerakVertikal;
  tinggiAwal: number;
  kecepatanAwal: number;
  gravitasi: number;
};

export type KeadaanGerakVertikal = {
  waktu: number;
  posisi: number;
  kecepatan: number;
  percepatan: number;
};

export type MetrikGerakVertikal = {
  waktuPuncak: number;
  waktuTempuh: number;
  tinggiMaksimum: number;
  kecepatanSaatMenyentuhTanah: number;
  kecepatanAwalBertanda: number;
};

export const PARAMETER_AWAL_GERAK_VERTIKAL: ParameterGerakVertikal = {
  arah: "atas",
  tinggiAwal: 5,
  kecepatanAwal: 15,
  gravitasi: 9.81,
};

function validasiParameter(parameter: ParameterGerakVertikal): void {
  const nilai = [
    parameter.tinggiAwal,
    parameter.kecepatanAwal,
    parameter.gravitasi,
  ];

  if (!nilai.every(Number.isFinite)) {
    throw new Error("Semua parameter gerak vertikal harus berupa bilangan yang valid.");
  }
  if (parameter.tinggiAwal <= 0) {
    throw new Error("Ketinggian awal harus lebih besar dari nol meter.");
  }
  if (parameter.kecepatanAwal < 0) {
    throw new Error("Besar kecepatan awal tidak boleh negatif.");
  }
  if (parameter.gravitasi <= 0) {
    throw new Error("Percepatan gravitasi harus lebih besar dari nol.");
  }
  if (parameter.arah !== "atas" && parameter.arah !== "bawah") {
    throw new Error("Arah gerak harus dipilih ke atas atau ke bawah.");
  }
}

function validasiWaktu(waktu: number): void {
  if (!Number.isFinite(waktu) || waktu < 0) {
    throw new Error("Waktu harus berupa bilangan valid dan tidak negatif.");
  }
}

/** Kecepatan awal diberi tanda sesuai arah lemparan terhadap sumbu y positif. */
export function dapatkanKecepatanAwalBertanda(
  parameter: ParameterGerakVertikal,
): number {
  return parameter.arah === "atas"
    ? parameter.kecepatanAwal
    : -parameter.kecepatanAwal;
}

/** Menghitung waktu sejak benda dilepas hingga menyentuh tanah (y = 0). */
export function hitungMetrikGerakVertikal(
  parameter: ParameterGerakVertikal,
): MetrikGerakVertikal {
  validasiParameter(parameter);

  const v0 = dapatkanKecepatanAwalBertanda(parameter);
  const g = parameter.gravitasi;
  const diskriminan = v0 * v0 + 2 * g * parameter.tinggiAwal;
  const waktuTempuh = (v0 + Math.sqrt(diskriminan)) / g;
  const waktuPuncak = parameter.arah === "atas" && v0 > 0
    ? v0 / g
    : 0;
  const tinggiMaksimum = parameter.arah === "atas"
    ? parameter.tinggiAwal + (v0 * v0) / (2 * g)
    : parameter.tinggiAwal;

  return {
    waktuPuncak,
    waktuTempuh,
    tinggiMaksimum,
    kecepatanSaatMenyentuhTanah: Math.sqrt(diskriminan),
    kecepatanAwalBertanda: v0,
  };
}

/**
 * Menghitung posisi dan kecepatan pada waktu tertentu.
 * Setelah tumbukan dengan tanah, benda dianggap diam pada y = 0.
 * Tepat saat tumbukan, kecepatan sebelum tumbukan tetap ditampilkan.
 */
export function hitungKeadaanGerakVertikal(
  parameter: ParameterGerakVertikal,
  waktu: number,
): KeadaanGerakVertikal {
  validasiParameter(parameter);
  validasiWaktu(waktu);

  const metrik = hitungMetrikGerakVertikal(parameter);
  const v0 = metrik.kecepatanAwalBertanda;
  const g = parameter.gravitasi;

  if (waktu > metrik.waktuTempuh) {
    return {
      waktu,
      posisi: 0,
      kecepatan: 0,
      percepatan: 0,
    };
  }

  const posisi = Math.max(
    0,
    parameter.tinggiAwal + v0 * waktu - 0.5 * g * waktu * waktu,
  );

  return {
    waktu,
    posisi,
    kecepatan: v0 - g * waktu,
    percepatan: -g,
  };
}
