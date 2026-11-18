import { describe, expect, it } from "vitest";

import {
  hitungAtwood,
  hitungLift,
} from "./mesinDinamika";

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
