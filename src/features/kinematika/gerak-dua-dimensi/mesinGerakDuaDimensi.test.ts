import { describe, expect, it } from "vitest";
import {
  hitungGerakParabola,
  hitungJatuhBebas,
  hitungMetrikJatuhBebas,
  hitungMetrikParabola,
  type ParameterGerakDuaDimensi,
} from "./mesinGerakDuaDimensi";

const parameterDasar: ParameterGerakDuaDimensi = {
  speed: 20,
  angleDeg: 45,
  gravity: 9.81,
  initialHeight: 0,
};

describe("model gerak parabola", () => {
  it("dimulai dari titik peluncuran", () => {
    const keadaan = hitungGerakParabola(parameterDasar, 0);
    expect(keadaan.x).toBeCloseTo(0);
    expect(keadaan.y).toBeCloseTo(0);
  });

  it("menghitung waktu tempuh, jarak, dan tinggi maksimum", () => {
    const metrik = hitungMetrikParabola(parameterDasar);
    expect(metrik.duration).toBeCloseTo(2.88, 2);
    expect(metrik.range).toBeCloseTo(40.77, 1);
    expect(metrik.maxHeight).toBeCloseTo(10.19, 1);
  });

  it("kembali ke tanah pada waktu tempuh yang dihitung", () => {
    const metrik = hitungMetrikParabola(parameterDasar);
    expect(hitungGerakParabola(parameterDasar, metrik.duration).y).toBeCloseTo(0);
  });

  it("memiliki kecepatan vertikal nol di titik tertinggi", () => {
    const metrik = hitungMetrikParabola(parameterDasar);
    expect(hitungGerakParabola(parameterDasar, metrik.duration / 2).vy).toBeCloseTo(0);
  });

  it("mendukung peluncuran horizontal dari ketinggian", () => {
    const parameter = { ...parameterDasar, speed: 10, angleDeg: 0, initialHeight: 5 };
    const metrik = hitungMetrikParabola(parameter);
    expect(metrik.duration).toBeCloseTo(Math.sqrt(10 / 9.81), 5);
    expect(metrik.range).toBeGreaterThan(0);
  });

  it("mendukung sudut penuh 360 derajat tanpa mengubah kinematika 0 derajat", () => {
    const nol = hitungGerakParabola({ ...parameterDasar, angleDeg: 0, initialHeight: 5 }, 0.5);
    const tigaEnamPuluh = hitungGerakParabola({ ...parameterDasar, angleDeg: 360, initialHeight: 5 }, 0.5);
    expect(tigaEnamPuluh.x).toBeCloseTo(nol.x, 8);
    expect(tigaEnamPuluh.y).toBeCloseTo(nol.y, 8);
    expect(tigaEnamPuluh.vx).toBeCloseTo(nol.vx, 8);
  });

  it("mendukung peluncuran ke kiri pada 180 derajat dari ketinggian", () => {
    const parameter = { ...parameterDasar, angleDeg: 180, initialHeight: 5 };
    const keadaan = hitungGerakParabola(parameter, 0.5);
    expect(keadaan.vx).toBeLessThan(0);
    expect(keadaan.vy).toBeCloseTo(-9.81 * 0.5, 8);
  });

  it("menolak sudut di luar rentang 0 sampai 360 derajat", () => {
    expect(() => hitungGerakParabola({ ...parameterDasar, angleDeg: 361 }, 0.5)).toThrow();
  });

});

describe("model gerak jatuh bebas", () => {
  it("menghitung waktu jatuh dari ketinggian", () => {
    const parameter = { ...parameterDasar, initialHeight: 10 };
    expect(hitungMetrikJatuhBebas(parameter).duration).toBeCloseTo(Math.sqrt(20 / 9.81), 5);
  });

  it("mempertahankan kecepatan saat tumbukan lalu berhenti sesudahnya", () => {
    const parameter = { ...parameterDasar, initialHeight: 10 };
    const waktuTumbukan = hitungMetrikJatuhBebas(parameter).duration;
    const saatTumbukan = hitungJatuhBebas(parameter, waktuTumbukan);
    const setelahTumbukan = hitungJatuhBebas(parameter, waktuTumbukan + 0.1);
    expect(saatTumbukan.y).toBeCloseTo(0);
    expect(saatTumbukan.vy).toBeCloseTo(-Math.sqrt(2 * 9.81 * 10), 4);
    expect(setelahTumbukan.y).toBe(0);
    expect(setelahTumbukan.vy).toBe(0);
  });
});
