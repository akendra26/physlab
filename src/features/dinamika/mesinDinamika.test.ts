import { describe, expect, it } from "vitest";

import {
  hitungAtwood,
  hitungDinamikaRotasi,
  hitungGayaTranslasi,
  hitungLift,
  hitungTorsiBanyakGaya,
  langkahSandboxRuangBebas,
  lintasanLift,
  type BalokRuangBebas,
} from "./mesinDinamika";

describe("mesin Dinamika — translasi dan gesekan", () => {
  it("mempertahankan benda diam dengan gesekan statis saat gaya belum melampaui batas", () => {
    const hasil = hitungGayaTranslasi({
      massa: 5,
      gaya: 10,
      koefisienStatis: 0.5,
      koefisienKinetis: 0.3,
      gravitasi: 10,
      sudutDerajat: 0,
    });

    expect(hasil.normal).toBeCloseTo(50);
    expect(hasil.jenisGesek).toBe("statis");
    expect(hasil.gesek).toBeCloseTo(-10);
    expect(hasil.percepatan).toBe(0);
  });

  it("beralih ke gesekan kinetis setelah batas gesek statis terlampaui", () => {
    const hasil = hitungGayaTranslasi({
      massa: 5,
      gaya: 40,
      koefisienStatis: 0.5,
      koefisienKinetis: 0.3,
      gravitasi: 10,
      sudutDerajat: 0,
    });

    expect(hasil.jenisGesek).toBe("kinetis");
    expect(hasil.gesek).toBeCloseTo(-15);
    expect(hasil.percepatan).toBeCloseTo(5);
  });

  it("memakai komponen berat sejajar bidang pada bidang miring", () => {
    const hasil = hitungGayaTranslasi({
      massa: 10,
      gaya: 0,
      koefisienStatis: 0,
      koefisienKinetis: 0,
      gravitasi: 10,
      sudutDerajat: 30,
    });

    expect(hasil.normal).toBeCloseTo(10 * 10 * Math.cos(Math.PI / 6));
    expect(hasil.komponenBerat).toBeCloseTo(50);
    expect(hasil.percepatan).toBeCloseTo(-5);
  });
});

describe("mesin Dinamika — sistem katrol dan lift", () => {
  it("menghasilkan percepatan nol untuk dua massa Atwood yang sama", () => {
    const hasil = hitungAtwood(4, 4, 9.8);
    expect(hasil.percepatan).toBeCloseTo(0);
    expect(hasil.tegangan).toBeCloseTo(39.2);
  });

  it("menentukan arah gerak dan tegangan pada mesin Atwood", () => {
    const hasil = hitungAtwood(4, 6, 9.81);
    expect(hasil.percepatan).toBeCloseTo(1.962);
    expect(hasil.tegangan).toBeCloseTo(47.088);
  });

  it("menghitung berat semu lift saat diam dan saat jatuh bebas", () => {
    const diam = hitungLift(60, 9.8, 0);
    const jatuhBebas = hitungLift(60, 9.8, -9.8);

    expect(diam.berat).toBeCloseTo(588);
    expect(diam.gayaNormal).toBeCloseTo(588);
    expect(jatuhBebas.gayaNormal).toBeCloseTo(0);
  });
});

describe("mesin Dinamika — rotasi", () => {
  const parameterDasar = {
    massa: 4,
    ukuran: 1.2,
    gayaSatu: 30,
    gayaDua: 30,
    lenganSatu: 0.6,
    lenganDua: 0.6,
    sudutSatu: 90,
    sudutDua: 90,
  } as const;

  it("menghitung momen inersia sesuai bentuk benda tegar", () => {
    const cakram = hitungDinamikaRotasi({ ...parameterDasar, bentuk: "cakram" });
    const cincin = hitungDinamikaRotasi({ ...parameterDasar, bentuk: "cincin" });
    const batang = hitungDinamikaRotasi({ ...parameterDasar, bentuk: "batang" });

    expect(cakram.momenInersia).toBeCloseTo(2.88);
    expect(cincin.momenInersia).toBeCloseTo(5.76);
    expect(batang.momenInersia).toBeCloseTo(0.48);
  });

  it("menghasilkan kesetimbangan rotasi ketika kedua torsi saling meniadakan", () => {
    const hasil = hitungDinamikaRotasi({ ...parameterDasar, bentuk: "cakram" });
    expect(hasil.torsiSatu).toBeCloseTo(18);
    expect(hasil.torsiDua).toBeCloseTo(-18);
    expect(hasil.torsiResultan).toBeCloseTo(0);
    expect(hasil.percepatanSudut).toBeCloseTo(0);
  });

  it("menerapkan teorema sumbu sejajar ketika poros digeser", () => {
    const pusat = hitungDinamikaRotasi({ ...parameterDasar, bentuk: "cakram" });
    const porosGeser = hitungDinamikaRotasi({
      ...parameterDasar,
      bentuk: "cakram",
      jarakPusatKePoros: 0.5,
    });

    expect(porosGeser.momenInersia).toBeCloseTo(pusat.momenInersia + 4 * 0.5 ** 2);
  });
});


describe("mesin Dinamika — sandbox ruang bebas 2D", () => {
  const parameter = {
    gravitasi: 9.81,
    sudutBidang: 0,
    titikLantaiX: 0,
    titikLantaiY: 6,
    lebarBalok: 0.9,
    tinggiBalok: 0.58,
    koefisienPantul: 0.08,
    koefisienGesek: 0.62,
  };

  it("menahan balok di atas bidang horizontal tak berujung", () => {
    let benda: BalokRuangBebas[] = [{
      id: 1, nama: "Balok uji", massa: 2, x: 2, y: 5, vx: 0, vy: 0, gayaX: 0, gayaY: 0,
    }];
    for (let langkah = 0; langkah < 1200; langkah += 1) {
      benda = langkahSandboxRuangBebas(benda, 1 / 120, parameter);
    }
    expect(benda[0].y).toBeCloseTo(5.71, 1);
    expect(benda[0].vy).toBeCloseTo(0, 1);
  });


  it("memindahkan momentum saat dua balok bertumbukan dari samping", () => {
    let benda: BalokRuangBebas[] = [
      { id: 1, nama: "Pendorong", massa: 2, x: 1.5, y: 5.71, vx: 5, vy: 0, gayaX: 0, gayaY: 0 },
      { id: 2, nama: "Target", massa: 2, x: 2.45, y: 5.71, vx: 0, vy: 0, gayaX: 0, gayaY: 0 },
    ];
    for (let langkah = 0; langkah < 120; langkah += 1) {
      benda = langkahSandboxRuangBebas(benda, 1 / 120, parameter);
    }
    expect(benda[1].x).toBeGreaterThan(2.9);
  });

  it("memungkinkan balok kedua bertumpu di atas balok pertama", () => {
    let benda: BalokRuangBebas[] = [
      { id: 1, nama: "Bawah", massa: 4, x: 2, y: 5.71, vx: 0, vy: 0, gayaX: 0, gayaY: 0 },
      { id: 2, nama: "Atas", massa: 2, x: 2, y: 4.5, vx: 0, vy: 0, gayaX: 0, gayaY: 0 },
    ];
    for (let langkah = 0; langkah < 1800; langkah += 1) {
      benda = langkahSandboxRuangBebas(benda, 1 / 120, parameter);
    }
    expect(benda[0].y - benda[1].y).toBeCloseTo(0.58, 1);
    expect(benda[1].vy).toBeCloseTo(0, 1);
  });
});

describe("mesin Dinamika — gaya rotasi banyak titik dan lintasan lift", () => {
  it("menjumlahkan torsi gaya terhadap posisi poros yang dipilih", () => {
    const gaya = [
      { id: 1, posisi: -0.5, besar: 20, sudut: 90 },
      { id: 2, posisi: 0.5, besar: 20, sudut: 270 },
    ];
    expect(hitungTorsiBanyakGaya(gaya, 0)).toBeCloseTo(-20);
    expect(hitungTorsiBanyakGaya(gaya, -0.5)).toBeCloseTo(-20);
  });

  it("membuat lintasan lift kontinu saat beralih dari akselerasi ke pengereman", () => {
    const percepatan = 0.8;
    const waktuSetengah = Math.sqrt(2 / percepatan);
    const sebelum = lintasanLift(waktuSetengah - 1e-5, percepatan);
    const sesudah = lintasanLift(waktuSetengah + 1e-5, percepatan);
    expect(Math.abs(sesudah.posisi - sebelum.posisi)).toBeLessThan(0.001);
    expect(Math.abs(sesudah.kecepatan - sebelum.kecepatan)).toBeLessThan(0.001);
    expect(sesudah.percepatan).toBeLessThan(0);
  });
});