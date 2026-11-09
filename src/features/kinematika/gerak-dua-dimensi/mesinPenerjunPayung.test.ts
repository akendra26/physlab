import { describe, expect, it } from "vitest";
import {
  hitungKeadaanPenerjun,
  hitungMetrikPenerjun,
  LANGKAH_WAKTU_PENERJUN,
} from "./mesinPenerjunPayung";

describe("mesin penerjun payung dengan hambatan udara", () => {
  it("memulai dari keadaan diam dan percepatan gravitasi", () => {
    const keadaan = hitungKeadaanPenerjun(120, 9.81, 0);
    expect(keadaan.jarak).toBe(0);
    expect(keadaan.kecepatan).toBe(0);
    expect(keadaan.percepatan).toBeCloseTo(9.81, 2);
    expect(keadaan.menyentuhTanah).toBe(false);
  });

  it("menghasilkan kecepatan terminal parasut lebih rendah daripada tubuh", () => {
    const metrik = hitungMetrikPenerjun(120, 9.81);
    expect(metrik.kecepatanTerminalTubuh).toBeGreaterThan(0);
    expect(metrik.kecepatanTerminalParasut).toBeGreaterThan(0);
    expect(metrik.kecepatanTerminalParasut)
      .toBeLessThan(metrik.kecepatanTerminalTubuh);
  });

  it("membuka parasut sebelum menyentuh tanah dan berhenti di permukaan", () => {
    const metrik = hitungMetrikPenerjun(120, 9.81);
    const tengah = hitungKeadaanPenerjun(
      120,
      9.81,
      metrik.waktuJatuh * 0.8,
    );
    const akhir = hitungKeadaanPenerjun(
      120,
      9.81,
      metrik.waktuJatuh + 10,
    );

    expect(tengah.parasutTerbuka).toBe(true);
    expect(akhir.menyentuhTanah).toBe(true);
    expect(akhir.jarak).toBe(120);
    expect(akhir.kecepatan).toBe(0);
    expect(akhir.percepatan).toBe(0);
    expect(akhir.waktu).toBeCloseTo(metrik.waktuJatuh, 6);
  });

  it("menggunakan langkah integrasi kecil dan konsisten", () => {
    expect(LANGKAH_WAKTU_PENERJUN).toBeCloseTo(1 / 240, 10);
  });
});
