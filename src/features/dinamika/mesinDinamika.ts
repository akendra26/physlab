export type HasilGayaTranslasi = {
  normal: number;
  komponenBerat: number;
  gesek: number;
  percepatan: number;
  penggerak: number;
  batasStatis: number;
  status: string;
  jenisGesek: "statis" | "kinetis";
};

export type ParameterGayaTranslasi = {
  massa: number;
  gaya: number;
  koefisienStatis: number;
  koefisienKinetis: number;
  gravitasi: number;
  sudutDerajat: number;
};

/**
 * Menghitung balok yang mula-mula diam pada bidang datar/miring.
 * Sumbu positif sejajar bidang dan mengarah ke atas bidang.
 * Gaya luar F juga diukur sejajar bidang; nilai negatif mengarah ke bawah.
 */
export function hitungGayaTranslasi({
  massa,
  gaya,
  koefisienStatis,
  koefisienKinetis,
  gravitasi,
  sudutDerajat,
}: ParameterGayaTranslasi): HasilGayaTranslasi {
  const sudut = (sudutDerajat * Math.PI) / 180;
  const normal = massa * gravitasi * Math.cos(sudut);
  const komponenBerat = massa * gravitasi * Math.sin(sudut);
  const penggerak = gaya - komponenBerat;
  const batasStatis = koefisienStatis * normal;

  if (Math.abs(penggerak) <= batasStatis + 1e-9) {
    return {
      normal,
      komponenBerat,
      gesek: -penggerak,
      percepatan: 0,
      penggerak,
      batasStatis,
      status: "Diam — gesek statis menyeimbangkan gaya sepanjang bidang",
      jenisGesek: "statis",
    };
  }

  const gesek = -Math.sign(penggerak) * koefisienKinetis * normal;
  const percepatan = (penggerak + gesek) / massa;

  return {
    normal,
    komponenBerat,
    gesek,
    percepatan,
    penggerak,
    batasStatis,
    status: percepatan > 0
      ? "Bergerak ke atas sepanjang bidang"
      : "Bergerak ke bawah sepanjang bidang",
    jenisGesek: "kinetis",
  };
}

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

export type BentukBendaTegar = "cakram" | "cincin" | "batang";

export type ParameterRotasi = {
  bentuk: BentukBendaTegar;
  massa: number;
  ukuran: number;
  gayaSatu: number;
  gayaDua: number;
  lenganSatu: number;
  lenganDua: number;
  sudutSatu: number;
  sudutDua: number;
  /** Jarak pusat massa ke poros; dipakai pada teorema sumbu sejajar. */
  jarakPusatKePoros?: number;
};

export type HasilRotasi = {
  momenInersia: number;
  persamaanInersia: string;
  torsiSatu: number;
  torsiDua: number;
  torsiResultan: number;
  percepatanSudut: number;
};

/**
 * Menghitung benda tegar terhadap sumbu tetap melalui pusat massa.
 * Torsi pertama positif (berlawanan jarum jam), torsi kedua negatif.
 */
export function hitungDinamikaRotasi({
  bentuk,
  massa,
  ukuran,
  gayaSatu,
  gayaDua,
  lenganSatu,
  lenganDua,
  sudutSatu,
  sudutDua,
  jarakPusatKePoros = 0,
}: ParameterRotasi): HasilRotasi {
  let momenInersia: number;
  let persamaanInersia: string;

  if (bentuk === "cakram") {
    momenInersia = 0.5 * massa * ukuran ** 2;
    persamaanInersia = String.raw`I=\frac{1}{2}mR^2`;
  } else if (bentuk === "cincin") {
    momenInersia = massa * ukuran ** 2;
    persamaanInersia = String.raw`I=mR^2`;
  } else {
    momenInersia = (massa * ukuran ** 2) / 12;
    persamaanInersia = String.raw`I=\frac{1}{12}mL^2`;
  }

  // Poros yang digeser dari pusat massa menggunakan teorema sumbu sejajar.
  momenInersia += massa * jarakPusatKePoros ** 2;
  if (jarakPusatKePoros > 1e-9) {
    persamaanInersia += String.raw`+md^2`;
  }

  const torsiSatu = lenganSatu * gayaSatu * Math.sin((sudutSatu * Math.PI) / 180);
  const torsiDua = -(lenganDua * gayaDua * Math.sin((sudutDua * Math.PI) / 180));
  const torsiResultan = torsiSatu + torsiDua;
  const percepatanSudut = momenInersia > 0 ? torsiResultan / momenInersia : 0;

  return {
    momenInersia,
    persamaanInersia,
    torsiSatu,
    torsiDua,
    torsiResultan,
    percepatanSudut,
  };
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

export type ParameterSandboxRuangBebas = {
  gravitasi: number;
  sudutBidang: number;
  titikLantaiX?: number;
  titikLantaiY?: number;
  lebarBalok?: number;
  tinggiBalok?: number;
  koefisienPantul?: number;
  koefisienGesek?: number;
  batasKanvas?: { kiri: number; kanan: number; atas: number; bawah: number };
};

/**
 * Satu langkah dinamika 2D untuk balok AABB.
 * Koordinat x ke kanan dan y ke bawah; gaya dalam N, massa kg, posisi meter.
 * Bidang miring diperlakukan sebagai garis tak berujung dengan kontak satu sisi.
 */
export function langkahSandboxRuangBebas(
  balok: BalokRuangBebas[],
  deltaWaktu: number,
  parameter: ParameterSandboxRuangBebas,
): BalokRuangBebas[] {
  if (deltaWaktu <= 0 || balok.length === 0) return balok;
  const dt = Math.min(deltaWaktu, 1 / 30);
  const lebar = (parameter.lebarBalok ?? 0.9) / 2;
  const tinggi = (parameter.tinggiBalok ?? 0.58) / 2;
  const theta = (parameter.sudutBidang * Math.PI) / 180;
  const nx = Math.sin(theta);
  const ny = -Math.cos(theta);
  const titikX = parameter.titikLantaiX ?? 6.15;
  const titikY = parameter.titikLantaiY ?? 5.95;
  const pantul = parameter.koefisienPantul ?? 0.08;
  const gesek = parameter.koefisienGesek ?? 0.62;
  const hasil = balok.map((item) => {
    const massa = Math.max(0.05, item.massa);
    const vx = item.vx + (item.gayaX / massa) * dt;
    const vy = item.vy + (parameter.gravitasi + item.gayaY / massa) * dt;
    return { ...item, massa, vx, vy, x: item.x + vx * dt, y: item.y + vy * dt };
  });

  // Kontak dengan lantai tak berujung. Proyeksi radius AABB menjaga seluruh sisi balok di atas bidang.
  for (const item of hasil) {
    const radiusNormal = lebar * Math.abs(nx) + tinggi * Math.abs(ny);
    const jarak = (item.x - titikX) * nx + (item.y - titikY) * ny;
    const penetrasi = radiusNormal - jarak;
    if (penetrasi > 0) {
      item.x += nx * penetrasi;
      item.y += ny * penetrasi;
      const kecepatanNormal = item.vx * nx + item.vy * ny;
      let impulsNormal = 0;
      if (kecepatanNormal < 0) {
        impulsNormal = -(1 + pantul) * kecepatanNormal * item.massa;
        item.vx += (impulsNormal / item.massa) * nx;
        item.vy += (impulsNormal / item.massa) * ny;
      }
      const tx = Math.cos(theta);
      const ty = Math.sin(theta);
      const kecepatanTangensial = item.vx * tx + item.vy * ty;
      const impulsGesek = Math.min(Math.abs(kecepatanTangensial) * item.massa, gesek * impulsNormal);
      if (impulsGesek > 0) {
        const koreksi = (Math.sign(kecepatanTangensial) * impulsGesek) / item.massa;
        item.vx -= koreksi * tx;
        item.vy -= koreksi * ty;
      }
      // Redam drift numerik kecil pada benda yang sedang menumpu.
      if (Math.abs(kecepatanNormal) < 0.025) {
        const sisaNormal = item.vx * nx + item.vy * ny;
        item.vx -= sisaNormal * nx;
        item.vy -= sisaNormal * ny;
      }
    }
  }

  // Dinding pembatas empat sisi. Setiap balok dipantulkan ringan dan tetap berada di viewport.
  const batas = parameter.batasKanvas;
  if (batas) {
    for (const item of hasil) {
      if (item.x - lebar < batas.kiri) {
        item.x = batas.kiri + lebar;
        if (item.vx < 0) item.vx = -item.vx * 0.18;
      }
      if (item.x + lebar > batas.kanan) {
        item.x = batas.kanan - lebar;
        if (item.vx > 0) item.vx = -item.vx * 0.18;
      }
      if (item.y - tinggi < batas.atas) {
        item.y = batas.atas + tinggi;
        if (item.vy < 0) item.vy = -item.vy * 0.18;
      }
      if (item.y + tinggi > batas.bawah) {
        item.y = batas.bawah - tinggi;
        if (item.vy > 0) item.vy = -item.vy * 0.18;
      }
    }
  }

  // Tumbukan antarbalok: koreksi penetrasi berbobot massa dan impuls normal.
  // Pengulangan dua kali membantu menjaga susunan bertumpuk lebih stabil.
  for (let putaran = 0; putaran < 2; putaran += 1) {
    for (let indeksA = 0; indeksA < hasil.length; indeksA += 1) {
      for (let indeksB = indeksA + 1; indeksB < hasil.length; indeksB += 1) {
        const a = hasil[indeksA];
        const b = hasil[indeksB];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const tumpangX = lebar * 2 - Math.abs(dx);
        const tumpangY = tinggi * 2 - Math.abs(dy);
        if (tumpangX <= 0 || tumpangY <= 0) continue;

        const invA = 1 / Math.max(0.05, a.massa);
        const invB = 1 / Math.max(0.05, b.massa);
        const jumlahInv = invA + invB;
        let normalX = 0;
        let normalY = 0;
        if (tumpangX < tumpangY) {
          normalX = Math.sign(dx || 1);
        } else if (tumpangY < tumpangX) {
          normalY = Math.sign(dy || 1);
        } else if (Math.abs(dx) >= Math.abs(dy)) {
          normalX = Math.sign(dx || 1);
        } else {
          normalY = Math.sign(dy || 1);
        }
        const penetrasi = Math.min(tumpangX, tumpangY);
        const koreksi = Math.max(0, penetrasi - 0.001) * 0.82 / jumlahInv;
        a.x -= normalX * koreksi * invA;
        a.y -= normalY * koreksi * invA;
        b.x += normalX * koreksi * invB;
        b.y += normalY * koreksi * invB;

        const kecepatanRelatif = (b.vx - a.vx) * normalX + (b.vy - a.vy) * normalY;
        if (kecepatanRelatif < 0) {
          const impuls = (-(1 + pantul) * kecepatanRelatif) / jumlahInv;
          a.vx -= impuls * invA * normalX;
          a.vy -= impuls * invA * normalY;
          b.vx += impuls * invB * normalX;
          b.vy += impuls * invB * normalY;

          // Gesekan tangensial sederhana mengurangi geser saat dua balok saling menumpu.
          const tx = -normalY;
          const ty = normalX;
          const kecepatanGeser = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
          const impulsTangensial = Math.min(Math.abs(kecepatanGeser) / jumlahInv, gesek * impuls);
          const arah = Math.sign(kecepatanGeser);
          a.vx += arah * impulsTangensial * invA * tx;
          a.vy += arah * impulsTangensial * invA * ty;
          b.vx -= arah * impulsTangensial * invB * tx;
          b.vy -= arah * impulsTangensial * invB * ty;
        }
      }
    }
  }

  // Koreksi akhir setelah tumbukan antarbalok: pemisahan pasangan tidak boleh
  // mendorong objek menembus dinding ruang simulasi.
  if (batas) {
    for (const item of hasil) {
      item.x = Math.max(batas.kiri + lebar, Math.min(batas.kanan - lebar, item.x));
      item.y = Math.max(batas.atas + tinggi, Math.min(batas.bawah - tinggi, item.y));
      if (item.x <= batas.kiri + lebar + 1e-8 && item.vx < 0) item.vx = 0;
      if (item.x >= batas.kanan - lebar - 1e-8 && item.vx > 0) item.vx = 0;
      if (item.y <= batas.atas + tinggi + 1e-8 && item.vy < 0) item.vy = 0;
      if (item.y >= batas.bawah - tinggi - 1e-8 && item.vy > 0) item.vy = 0;
    }
  }

  return hasil;
}

export type HasilLintasan = { posisi: number; kecepatan: number; percepatan: number };

/** Gerak Atwood ideal sampai salah satu massa mencapai batas lintasan, lalu berhenti karena kontak mekanis. */
export function lintasanAtwood(percepatan: number, waktu: number, jarakMaksimum = 1.4): HasilLintasan {
  const tanda = Math.sign(percepatan);
  const a = Math.abs(percepatan);
  if (a < 1e-9 || waktu <= 0) return { posisi: 0, kecepatan: 0, percepatan: 0 };
  const tTumbukan = Math.sqrt((2 * jarakMaksimum) / a);
  if (waktu >= tTumbukan) return { posisi: tanda * jarakMaksimum, kecepatan: 0, percepatan: 0 };
  return {
    posisi: tanda * 0.5 * a * waktu ** 2,
    kecepatan: tanda * a * waktu,
    percepatan,
  };
}

/**
 * Profil lift berangkat dan berhenti mulus dengan percepatan konstan pada paruh pertama,
 * lalu perlambatan konstan dengan besar sama pada paruh kedua.
 * Nilai parameter menentukan arah dan besar percepatan awal (m/s²).
 */
export function lintasanLift(waktu: number, percepatanPerintah: number, jarakLantai = 2): HasilLintasan {
  const tanda = Math.sign(percepatanPerintah);
  const a = Math.abs(percepatanPerintah);
  if (a < 1e-8 || waktu <= 0) return { posisi: 0, kecepatan: 0, percepatan: 0 };
  const waktuSetengah = Math.sqrt(jarakLantai / a);
  const kecepatanPuncak = a * waktuSetengah;
  if (waktu <= waktuSetengah) {
    return {
      posisi: tanda * 0.5 * a * waktu ** 2,
      kecepatan: tanda * a * waktu,
      percepatan: tanda * a,
    };
  }
  if (waktu <= 2 * waktuSetengah) {
    const t = waktu - waktuSetengah;
    return {
      posisi: tanda * (jarakLantai / 2 + kecepatanPuncak * t - 0.5 * a * t ** 2),
      kecepatan: tanda * (kecepatanPuncak - a * t),
      percepatan: -tanda * a,
    };
  }
  return { posisi: tanda * jarakLantai, kecepatan: 0, percepatan: 0 };
}

export type TitikGayaRotasi = { id: number; posisi: number; besar: number; sudut: number };

/** Torsi bertanda pada sumbu z: τ = r × F = r F sin(φ). */
export function hitungTorsiBanyakGaya(gaya: TitikGayaRotasi[], posisiPoros: number): number {
  return gaya.reduce((jumlah, item) => {
    const lengan = item.posisi - posisiPoros;
    return jumlah + lengan * item.besar * Math.sin((item.sudut * Math.PI) / 180);
  }, 0);
}