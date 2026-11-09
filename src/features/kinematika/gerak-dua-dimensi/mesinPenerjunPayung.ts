export type KeadaanPenerjun = {
  jarak: number;
  kecepatan: number;
  kecepatanTerminal: number;
  kecepatanTerminalTubuh: number;
  percepatan: number;
  parasutTerbuka: boolean;
  menyentuhTanah: boolean;
  waktu: number;
};

export type MetrikPenerjun = {
  waktuJatuh: number;
  kecepatanTerminalTubuh: number;
  kecepatanTerminalParasut: number;
};

type SampelPenerjun = Omit<KeadaanPenerjun,
  "kecepatanTerminal" | "kecepatanTerminalTubuh">;

type LintasanPenerjun = {
  sampel: SampelPenerjun[];
  metrik: MetrikPenerjun;
};

const MASSA_PENERJUN = 78;
const MASSA_JENIS_UDARA = 1.225;
const CD_TUBUH = 0.9;
const AREA_TUBUH = 0.7;
const CD_PARASUT = 1.35;
const AREA_PARASUT = 22;
const PROPORSI_BUKA_PARASUT = 0.72;
const LANGKAH = 1 / 240;
const BATAS_WAKTU = 180;

// Satu lintasan disimpan untuk parameter aktif. Render animasi berikutnya
// cukup melakukan pencarian/interpolasi, bukan mengulang puluhan ribu langkah.
let cacheLintasan: {
  kunci: string;
  nilai: LintasanPenerjun;
} | null = null;

function terminal(massa: number, gravitasi: number, cdArea: number) {
  return Math.sqrt(
    (2 * massa * gravitasi) /
      (MASSA_JENIS_UDARA * cdArea),
  );
}

function buatLintasan(
  ketinggianAwal: number,
  gravitasi: number,
): LintasanPenerjun {
  const tinggi = Math.max(0, ketinggianAwal);
  const g = Math.max(0.01, gravitasi);
  const terminalTubuh = terminal(
    MASSA_PENERJUN,
    g,
    CD_TUBUH * AREA_TUBUH,
  );
  const terminalParasut = terminal(
    MASSA_PENERJUN,
    g,
    CD_PARASUT * AREA_PARASUT,
  );

  let waktu = 0;
  let jarak = 0;
  let kecepatan = 0;
  let percepatan = g;
  let parasutTerbuka = false;
  let menyentuhTanah = tinggi <= 0;

  const sampel: SampelPenerjun[] = [{
    jarak: 0,
    kecepatan: 0,
    percepatan: menyentuhTanah ? 0 : g,
    parasutTerbuka: false,
    menyentuhTanah,
    waktu: 0,
  }];

  while (!menyentuhTanah && waktu < BATAS_WAKTU) {
    const dt = Math.min(LANGKAH, BATAS_WAKTU - waktu);
    const cdArea = parasutTerbuka
      ? CD_PARASUT * AREA_PARASUT
      : CD_TUBUH * AREA_TUBUH;

    const hambatan =
      0.5 * MASSA_JENIS_UDARA * cdArea * kecepatan ** 2;

    percepatan = g - hambatan / MASSA_PENERJUN;
    kecepatan = Math.max(0, kecepatan + percepatan * dt);
    jarak = Math.min(tinggi, jarak + kecepatan * dt);
    waktu += dt;

    if (!parasutTerbuka && jarak >= tinggi * PROPORSI_BUKA_PARASUT) {
      parasutTerbuka = true;
    }

    if (jarak >= tinggi - 1e-8) {
      jarak = tinggi;
      kecepatan = 0;
      percepatan = 0;
      menyentuhTanah = true;
    }

    sampel.push({
      jarak,
      kecepatan,
      percepatan,
      parasutTerbuka,
      menyentuhTanah,
      waktu,
    });
  }

  const metrik: MetrikPenerjun = {
    waktuJatuh: waktu,
    kecepatanTerminalTubuh: terminalTubuh,
    kecepatanTerminalParasut: terminalParasut,
  };

  return { sampel, metrik };
}

function ambilLintasan(
  ketinggianAwal: number,
  gravitasi: number,
): LintasanPenerjun {
  const tinggi = Math.max(0, ketinggianAwal);
  const g = Math.max(0.01, gravitasi);
  const kunci = `${tinggi.toFixed(6)}|${g.toFixed(6)}`;

  if (cacheLintasan?.kunci === kunci) {
    return cacheLintasan.nilai;
  }

  const nilai = buatLintasan(tinggi, g);
  cacheLintasan = { kunci, nilai };
  return nilai;
}

/**
 * Mengambil keadaan penerjun dari lintasan drag kuadratik yang diprakomputasi.
 * Arah positif ke bawah; setelah menyentuh tanah, penerjun berhenti.
 */
export function hitungKeadaanPenerjun(
  ketinggianAwal: number,
  gravitasi: number,
  waktu: number,
): KeadaanPenerjun {
  const lintasan = ambilLintasan(ketinggianAwal, gravitasi);
  const target = Math.max(
    0,
    Math.min(lintasan.metrik.waktuJatuh, Number.isFinite(waktu) ? waktu : 0),
  );
  const data = lintasan.sampel;

  let kiri = 0;
  let kanan = data.length - 1;
  while (kiri < kanan) {
    const tengah = Math.floor((kiri + kanan) / 2);
    if (data[tengah].waktu < target) kiri = tengah + 1;
    else kanan = tengah;
  }

  const atas = data[kiri];
  const bawah = data[Math.max(0, kiri - 1)];
  const selang = atas.waktu - bawah.waktu;
  const fraksi = selang > 0
    ? Math.max(0, Math.min(1, (target - bawah.waktu) / selang))
    : 0;
  const campur = (a: number, b: number) => a + (b - a) * fraksi;
  const parasutTerbuka = fraksi >= 1
    ? atas.parasutTerbuka
    : bawah.parasutTerbuka;
  const cdAreaAktif = parasutTerbuka
    ? CD_PARASUT * AREA_PARASUT
    : CD_TUBUH * AREA_TUBUH;

  return {
    jarak: campur(bawah.jarak, atas.jarak),
    kecepatan: campur(bawah.kecepatan, atas.kecepatan),
    percepatan: campur(bawah.percepatan, atas.percepatan),
    parasutTerbuka,
    menyentuhTanah: atas.menyentuhTanah && fraksi >= 1,
    waktu: target,
    kecepatanTerminal: terminal(
      MASSA_PENERJUN,
      Math.max(0.01, gravitasi),
      cdAreaAktif,
    ),
    kecepatanTerminalTubuh: lintasan.metrik.kecepatanTerminalTubuh,
  };
}

/** Metrik dihitung dari lintasan numerik yang sama dengan visual penerjun. */
export function hitungMetrikPenerjun(
  ketinggianAwal: number,
  gravitasi: number,
): MetrikPenerjun {
  return ambilLintasan(ketinggianAwal, gravitasi).metrik;
}

/** Mengekspos waktu langkah integrasi untuk dokumentasi dan pengujian. */
export const LANGKAH_WAKTU_PENERJUN = LANGKAH;
