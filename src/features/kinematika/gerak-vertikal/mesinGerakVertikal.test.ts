import { describe, expect, it } from "vitest";
import {
  hitungKeadaanGerakVertikal,
  hitungMetrikGerakVertikal,
  type ParameterGerakVertikal,
} from "./mesinGerakVertikal";

const parameterAtas: ParameterGerakVertikal = {
  arah: "atas",
  tinggiAwal: 5,
  kecepatanAwal: 15,
  gravitasi: 10,
};

const parameterBawah: ParameterGerakVertikal = {
  arah: "bawah",
  tinggiAwal: 20,
  kecepatanAwal: 5,
  gravitasi: 10,
};

describe("model gerak vertikal", () => {
  it("mengunci kecepatan awal pada nol untuk gerak jatuh bebas", () => {
    const jatuhBebas: ParameterGerakVertikal = {
      arah: "jatuh-bebas",
      tinggiAwal: 20,
      kecepatanAwal: 15, // Nilai ini diabaikan pada mode jatuh bebas.
      gravitasi: 10,
    };
    const metrik = hitungMetrikGerakVertikal(jatuhBebas);
    const keadaan = hitungKeadaanGerakVertikal(jatuhBebas, 1);
    expect(metrik.kecepatanAwalBertanda).toBe(0);
    expect(metrik.waktuTempuh).toBeCloseTo(2);
    expect(keadaan.posisi).toBeCloseTo(15);
    expect(keadaan.kecepatan).toBeCloseTo(-10);
  });

  it("menghitung tinggi maksimum dan waktu mencapai puncak untuk lemparan ke atas", () => {
    const metrik = hitungMetrikGerakVertikal(parameterAtas);
    expect(metrik.waktuPuncak).toBeCloseTo(1.5);
    expect(metrik.tinggiMaksimum).toBeCloseTo(16.25);
  });

  it("memiliki kecepatan nol di titik tertinggi", () => {
    const metrik = hitungMetrikGerakVertikal(parameterAtas);
    const keadaan = hitungKeadaanGerakVertikal(parameterAtas, metrik.waktuPuncak);
    expect(keadaan.kecepatan).toBeCloseTo(0);
    expect(keadaan.percepatan).toBe(-10);
  });

  it("menghitung waktu tempuh lemparan ke atas sampai tanah", () => {
    const metrik = hitungMetrikGerakVertikal(parameterAtas);
    expect(metrik.waktuTempuh).toBeCloseTo((15 + Math.sqrt(325)) / 10);
    expect(metrik.kecepatanSaatMenyentuhTanah).toBeCloseTo(Math.sqrt(325));
  });

  it("membedakan arah ke bawah dengan kecepatan awal negatif", () => {
    const keadaan = hitungKeadaanGerakVertikal(parameterBawah, 1);
    expect(keadaan.posisi).toBeCloseTo(10);
    expect(keadaan.kecepatan).toBeCloseTo(-15);
    expect(keadaan.percepatan).toBe(-10);
  });

  it("menjaga benda tetap di tanah setelah waktu tumbukan", () => {
    const metrik = hitungMetrikGerakVertikal(parameterBawah);
    const keadaan = hitungKeadaanGerakVertikal(parameterBawah, metrik.waktuTempuh + 0.1);
    expect(keadaan.posisi).toBe(0);
    expect(keadaan.kecepatan).toBe(0);
    expect(keadaan.percepatan).toBe(0);
  });
});
