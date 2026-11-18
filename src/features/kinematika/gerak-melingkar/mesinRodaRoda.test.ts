import { describe, expect, it } from "vitest";
import {
  hitungKecepatanSudutTurunan,
  hitungPusatRoda,
  hitungGeometriSabuk,
} from "./mesinRodaRoda";

describe("model transmisi tiga roda", () => {
  it("menempatkan roda 1 dan 2 tepat pada pusat yang sama untuk hubungan seporos", () => {
    const pusat = hitungPusatRoda([88, 60.5, 46.2], "seporos", "sabuk");
    expect(pusat[0]).toBe(pusat[1]);
    expect(pusat[2]).toBeGreaterThan(pusat[1]);
  });

  it("menempatkan roda 2 dan 3 tepat pada pusat yang sama untuk hubungan seporos", () => {
    const pusat = hitungPusatRoda([88, 60.5, 46.2], "bersinggungan", "seporos");
    expect(pusat[1]).toBe(pusat[2]);
    expect(pusat[1]).toBeGreaterThan(pusat[0]);
  });

  it("menyatukan ketiga pusat jika kedua hubungan seporos", () => {
    const pusat = hitungPusatRoda([88, 60.5, 46.2], "seporos", "seporos");
    expect(pusat[0]).toBe(pusat[1]);
    expect(pusat[1]).toBe(pusat[2]);
  });

  it("menghindari overlap dengan memakai radius terbesar dari pasangan seporos", () => {
    const radii: [number, number, number] = [132, 27.5, 46.2];
    const pusat = hitungPusatRoda(radii, "seporos", "bersinggungan");
    const jarakAman = Math.max(radii[0], radii[1]) * 1.08 + radii[2] * 1.08;
    expect(pusat[2] - pusat[1]).toBeCloseTo(jarakAman);
  });

  it("memakai radius terbesar dari roda 2-3 seporos untuk jarak dari roda 1", () => {
    const radii: [number, number, number] = [27.5, 60.5, 132];
    const pusat = hitungPusatRoda(radii, "bersinggungan", "seporos");
    const jarakAman = radii[0] * 1.08 + Math.max(radii[1], radii[2]) * 1.08;
    expect(pusat[1] - pusat[0]).toBeCloseTo(jarakAman);
  });

  it("menjaga relasi kecepatan sudut dan arah putaran", () => {
    expect(hitungKecepatanSudutTurunan(2, 0.8, 0.5, "seporos")).toBe(2);
    expect(hitungKecepatanSudutTurunan(2, 0.8, 0.5, "bersinggungan")).toBeCloseTo(-3.2);
    expect(hitungKecepatanSudutTurunan(2, 0.8, 0.5, "sabuk")).toBeCloseTo(3.2);
  });
});


describe("geometri sabuk dan mata rantai", () => {
  it("menghasilkan titik singgung yang berada tepat pada keliling kedua roda", () => {
    const geometri = hitungGeometriSabuk(100, 360, 190, 92, 57);
    expect(geometri).not.toBeNull();
    if (!geometri) return;

    const { atasSumber, atasTujuan, bawahTujuan, bawahSumber } = geometri.titikSinggung;
    expect(Math.hypot(atasSumber.x - 100, atasSumber.y - 190)).toBeCloseTo(92, 6);
    expect(Math.hypot(bawahSumber.x - 100, bawahSumber.y - 190)).toBeCloseTo(92, 6);
    expect(Math.hypot(atasTujuan.x - 360, atasTujuan.y - 190)).toBeCloseTo(57, 6);
    expect(Math.hypot(bawahTujuan.x - 360, bawahTujuan.y - 190)).toBeCloseTo(57, 6);
    const arahSabukAtas = { x: atasTujuan.x - atasSumber.x, y: atasTujuan.y - atasSumber.y };
    const radiusNormal = { x: atasSumber.x - 100, y: atasSumber.y - 190 };
    expect(arahSabukAtas.x * radiusNormal.x + arahSabukAtas.y * radiusNormal.y).toBeCloseTo(0, 6);
  });

  it("membentuk lintasan dengan dua garis singgung, dua busur, dan mata rantai", () => {
    const geometri = hitungGeometriSabuk(100, 360, 190, 92, 57);
    expect(geometri).not.toBeNull();
    expect(geometri?.path).toContain(" A ");
    expect(geometri?.path).toContain(" Z");
    expect(geometri?.mataRantai.length).toBeGreaterThan(20);
    expect(geometri?.mataRantai.every((mata) =>
      Number.isFinite(mata.x) && Number.isFinite(mata.y) && Number.isFinite(mata.sudut),
    )).toBe(true);
  });

  it("menolak konfigurasi yang tidak memungkinkan garis singgung persekutuan luar", () => {
    expect(hitungGeometriSabuk(100, 120, 190, 80, 30)).toBeNull();
  });
});
