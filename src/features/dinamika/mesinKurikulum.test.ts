import { describe, expect, it } from "vitest";

import {
  buatSampelGrafikDinamika,
  hitungKeadaanDinamika,
  hitungOsilatorTeredam,
  PARAMETER_AWAL_KURIKULUM,
} from "./mesinKurikulum";

const dasar = PARAMETER_AWAL_KURIKULUM;

describe("model kurikulum Dinamika", () => {
  it("membuat gaya gesek statis menyesuaikan gaya luar sebelum ambang", () => {
    const hasil = hitungKeadaanDinamika("balok", { ...dasar, gaya: 10 }, 2);
    expect(hasil.staticFriction).toBe(true);
    expect(hasil.frictionForce).toBeCloseTo(10);
    expect(hasil.acceleration).toBe(0);
  });

  it("menguraikan gaya bersudut ke komponen horizontal dan vertikal", () => {
    const hasil = hitungKeadaanDinamika("balok", { ...dasar, gaya: 40, sudutGaya: 30, muStatis: 0, muKinetis: 0 }, 1);
    expect(hasil.appliedForceX).toBeCloseTo(40 * Math.cos(Math.PI / 6));
    expect(hasil.appliedForceY).toBeCloseTo(20);
    expect(hasil.normalForce).toBeCloseTo(dasar.massa * dasar.gravitasi - 20);
  });

  it("mengangkat balok dari lantai saat komponen vertikal gaya melebihi berat", () => {
    const hasil = hitungKeadaanDinamika("balok", { ...dasar, massa: 5, gaya: 120, sudutGaya: 60 }, 1);
    expect(hasil.normalForce).toBe(0);
    expect(hasil.verticalAcceleration).toBeGreaterThan(0);
    expect(hasil.verticalDisplacement).toBeGreaterThan(0);
    expect(hasil.frictionForce).toBe(0);
  });

  it("menggunakan gesekan kinetis setelah batas statis terlampaui", () => {
    const hasil = hitungKeadaanDinamika("balok", dasar, 1);
    expect(hasil.staticFriction).toBe(false);
    expect(hasil.frictionForce).toBeCloseTo(dasar.muKinetis * dasar.massa * dasar.gravitasi);
    expect(hasil.acceleration).toBeCloseTo((dasar.gaya - hasil.frictionForce) / dasar.massa);
  });

  it("menghasilkan solusi teredam hingga untuk rezim under/critical/overdamped", () => {
    for (const zeta of [0.2, 1, 1.4]) {
      const hasil = hitungOsilatorTeredam(0.45, 0, Math.sqrt(12 / 5), zeta, 1);
      expect(Number.isFinite(hasil.posisi)).toBe(true);
      expect(Number.isFinite(hasil.kecepatan)).toBe(true);
      expect(Number.isFinite(hasil.percepatan)).toBe(true);
    }
  });

  it("menghasilkan sampel grafik pada selang waktu yang diminta", () => {
    const hasil = buatSampelGrafikDinamika("balok", dasar, 12, 13);
    expect(hasil).toHaveLength(13);
    expect(hasil[0].waktu).toBe(0);
    expect(hasil[12].waktu).toBe(12);
  });
  it("menjaga model tetap finite saat menerima parameter ekstrem atau bukan angka", () => {
    const parameterEkstrem = {
      ...dasar,
      massa: Number.NaN,
      gaya: Number.POSITIVE_INFINITY,
      gravitasi: Number.NaN,
      muStatis: Number.POSITIVE_INFINITY,
      muKinetis: Number.NaN,
      sudutGaya: Number.POSITIVE_INFINITY,
      konstantaPegas: Number.POSITIVE_INFINITY,
      redaman: Number.NaN,
      amplitudo: Number.POSITIVE_INFINITY,
      panjangBandul: Number.NaN,
    };
    const hasilBalok = hitungKeadaanDinamika("balok", parameterEkstrem, Number.NaN);
    const hasilOsilasi = hitungKeadaanDinamika("osilasi", { ...parameterEkstrem, modeOsilasi: "pegas" }, 600);
    const angka = [...Object.values(hasilBalok), ...Object.values(hasilOsilasi)].filter((value): value is number => typeof value === "number");
    expect(angka.every(Number.isFinite)).toBe(true);
  });

  it("menerima sudut gaya pada seluruh rentang 0–360 derajat", () => {
    const gaya = 40;
    const kuadranDua = hitungKeadaanDinamika("balok", { ...dasar, gaya, sudutGaya: 135, muStatis: 0, muKinetis: 0 }, 1);
    expect(kuadranDua.appliedForceX).toBeCloseTo(gaya * Math.cos(3 * Math.PI / 4));
    expect(kuadranDua.appliedForceY).toBeCloseTo(gaya * Math.sin(3 * Math.PI / 4));
    const kuadranEmpat = hitungKeadaanDinamika("balok", { ...dasar, gaya, sudutGaya: 315, muStatis: 0, muKinetis: 0 }, 1);
    expect(kuadranEmpat.appliedForceX).toBeCloseTo(gaya * Math.cos(7 * Math.PI / 4));
    expect(kuadranEmpat.appliedForceY).toBeCloseTo(gaya * Math.sin(7 * Math.PI / 4));
    const satuPutaran = hitungKeadaanDinamika("balok", { ...dasar, gaya, sudutGaya: 360 }, 1);
    expect(satuPutaran.appliedForceX).toBeCloseTo(gaya);
    expect(satuPutaran.appliedForceY).toBeCloseTo(0);
  });

});
