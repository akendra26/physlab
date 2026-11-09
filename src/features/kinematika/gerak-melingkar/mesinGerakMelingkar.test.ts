import { describe, expect, it } from "vitest";
import {
  hitungKeadaanGerakMelingkar,
  hitungJumlahPutaran,
  type ParameterGerakMelingkar,
} from "./mesinGerakMelingkar";

const parameterGmb: ParameterGerakMelingkar = {
  mode: "gmb",
  jariJari: 2,
  sudutAwalDerajat: 0,
  kecepatanSudutAwal: 2,
  percepatanSudut: 99, // Tidak digunakan oleh GMB.
  durasi: 10,
};

describe("model gerak melingkar", () => {
  it("menghitung periode, kecepatan tangensial, dan percepatan sentripetal pada GMB", () => {
    const keadaan = hitungKeadaanGerakMelingkar(parameterGmb, 0);
    expect(keadaan.periodeSesaat).toBeCloseTo(Math.PI);
    expect(keadaan.kecepatanTangensial).toBe(4);
    expect(keadaan.percepatanSentripetal).toBe(8);
    expect(keadaan.percepatanSudut).toBe(0);
  });

  it("menempuh satu putaran setelah satu periode untuk GMB", () => {
    const periode = Math.PI;
    expect(hitungJumlahPutaran(parameterGmb, periode)).toBeCloseTo(1);
  });

  it("mengubah kecepatan sudut secara linear pada GMBB", () => {
    const parameter = { ...parameterGmb, mode: "gmbb" as const, percepatanSudut: 0.5 };
    const keadaan = hitungKeadaanGerakMelingkar(parameter, 4);
    expect(keadaan.kecepatanSudut).toBe(4);
    expect(keadaan.percepatanSudut).toBe(0.5);
    expect(keadaan.percepatanSentripetal).toBe(32);
    expect(keadaan.percepatanTangensial).toBe(1);
    expect(keadaan.sudut).toBeCloseTo(12);
  });

  it("mendukung arah putaran searah jarum jam", () => {
    const parameter = { ...parameterGmb, kecepatanSudutAwal: -3 };
    const keadaan = hitungKeadaanGerakMelingkar(parameter, 1);
    expect(keadaan.kecepatanSudut).toBe(-3);
    expect(keadaan.kecepatanTangensial).toBe(6);
    expect(keadaan.periodeSesaat).toBeCloseTo((2 * Math.PI) / 3);
  });

  it("mengembalikan periode tidak terdefinisi saat omega nol", () => {
    const parameter = { ...parameterGmb, kecepatanSudutAwal: 0 };
    expect(hitungKeadaanGerakMelingkar(parameter, 0).periodeSesaat).toBeNull();
  });
});
