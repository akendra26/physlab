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


/** Bentuk benda tegar yang tersedia pada simulasi dinamika rotasi. */
export type BentukBendaTegar = "cakram" | "cincin" | "batang";

/** Gaya yang bekerja pada benda; posisi diukur sepanjang sumbu benda dari pusat. */
export type TitikGayaRotasi = {
  id: number;
  posisi: number;
  besar: number;
  sudut: number;
};

/** Menghitung jumlah torsi terhadap poros (sumbu z positif keluar bidang). */
export function hitungTorsiBanyakGaya(
  gaya: TitikGayaRotasi[],
  posisiPoros: number,
): number {
  return gaya.reduce((jumlah, item) => {
    const sudutRad = (item.sudut * Math.PI) / 180;
    const lengan = item.posisi - posisiPoros;
    const komponenTegakLurus = item.besar * Math.sin(sudutRad);
    return jumlah + lengan * komponenTegakLurus;
  }, 0);
}

export type BalokRuangBebas = {
  id: number;
  nama: string;
  massa: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gayaX: number;
  gayaY: number;
};

type BatasRuangBebas = { kiri: number; kanan: number; atas: number; bawah: number };

type OpsiSandboxRuangBebas = {
  gravitasi: number;
  sudutBidang: number;
  titikLantaiX: number;
  titikLantaiY: number;
  lebarBalok: number;
  tinggiBalok: number;
  batasKanvas: BatasRuangBebas;
};

/**
 * Satu langkah integrasi sandbox Hukum Newton.
 * Gaya luar dan gravitasi diintegrasikan secara numerik; kontak bidang
 * dimodelkan dengan gaya normal dan gesekan kinetis sederhana.
 */
export function langkahSandboxRuangBebas(
  balok: BalokRuangBebas[],
  dt: number,
  opsi: OpsiSandboxRuangBebas,
): BalokRuangBebas[] {
  if (!(dt > 0) || !Number.isFinite(dt)) return balok;

  const sudut = (opsi.sudutBidang * Math.PI) / 180;
  const tx = Math.cos(sudut);
  const ty = -Math.sin(sudut);
  const nx = Math.sin(sudut);
  const ny = Math.cos(sudut);

  return balok.map((item) => {
    const massa = Math.max(item.massa, 1e-6);
    let ax = item.gayaX / massa;
    let ay = item.gayaY / massa + opsi.gravitasi;

    // Jarak pusat balok dari bidang miring, positif menjauhi bidang.
    const setengahTinggi = opsi.tinggiBalok / 2;
    const jarakBidang =
      (item.x - opsi.titikLantaiX) * nx +
      (item.y - opsi.titikLantaiY) * ny -
      setengahTinggi;

    const percepatanNormal = ax * nx + ay * ny;
    if (jarakBidang <= 0.002 && percepatanNormal > 0) {
      // Kontak: hilangkan komponen kecepatan menuju bidang.
      const kecepatanNormal = item.vx * nx + item.vy * ny;
      if (kecepatanNormal > 0) {
        item = { ...item, vx: item.vx - kecepatanNormal * nx, vy: item.vy - kecepatanNormal * ny };
      }
      const gayaNormalPerMassa = Math.max(0, percepatanNormal);
      ax -= gayaNormalPerMassa * nx;
      ay -= gayaNormalPerMassa * ny;

      // Gesekan kinetis sederhana berlawanan arah gerak sepanjang bidang.
      const kecepatanTangensial = item.vx * tx + item.vy * ty;
      if (Math.abs(kecepatanTangensial) > 1e-5) {
        const gesekan = Math.min(0.25 * opsi.gravitasi, Math.abs(kecepatanTangensial) / dt);
        ax -= Math.sign(kecepatanTangensial) * gesekan * tx;
        ay -= Math.sign(kecepatanTangensial) * gesekan * ty;
      }
    }

    let vx = item.vx + ax * dt;
    let vy = item.vy + ay * dt;
    let x = item.x + vx * dt;
    let y = item.y + vy * dt;

    // Batas kanvas agar balok tidak hilang dari area eksperimen.
    const minX = opsi.batasKanvas.kiri + opsi.lebarBalok / 2;
    const maxX = opsi.batasKanvas.kanan - opsi.lebarBalok / 2;
    const minY = opsi.batasKanvas.atas + opsi.tinggiBalok / 2;
    const maxY = opsi.batasKanvas.bawah - opsi.tinggiBalok / 2;
    if (x < minX) { x = minX; vx = Math.max(0, vx); }
    if (x > maxX) { x = maxX; vx = Math.min(0, vx); }
    if (y < minY) { y = minY; vy = Math.max(0, vy); }
    if (y > maxY) { y = maxY; vy = Math.min(0, vy); }

    return { ...item, x, y, vx, vy };
  });
}
