export type HasilAtwood = {
  percepatan: number;
  tegangan: number;
};

/** Arah positif Atwood: m2 turun dan m1 naik; tali/katrol ideal. */
export function hitungAtwood(massaSatu: number, massaDua: number, gravitasi: number): HasilAtwood {
  const jumlahMassa = massaSatu + massaDua;
  return {
    percepatan: ((massaDua - massaSatu) * gravitasi) / jumlahMassa,
    tegangan: (2 * massaSatu * massaDua * gravitasi) / jumlahMassa,
  };
}

export type HasilLift = {
  berat: number;
  gayaNormal: number;
};

/** Sumbu vertikal positif ke atas; gaya normal = berat semu saat kontak dipertahankan. */
export function hitungLift(massa: number, gravitasi: number, percepatanLift: number): HasilLift {
  return {
    berat: massa * gravitasi,
    gayaNormal: Math.max(0, massa * (gravitasi + percepatanLift)),
  };
}
