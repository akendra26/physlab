export type RelasiRoda = "seporos" | "bersinggungan" | "sabuk";

/**
 * Menghitung kecepatan sudut roda keluaran dari hubungan ideal antar-roda.
 * Seporos: omega sama; bersinggungan: kecepatan tangensial sama dengan arah
 * berlawanan; sabuk terbuka: kecepatan linear sabuk sama dengan arah putar sama.
 */
export function hitungKecepatanSudutTurunan(
  omegaSumber: number,
  jariSumber: number,
  jariTujuan: number,
  relasi: RelasiRoda,
): number {
  if (relasi === "seporos") return omegaSumber;
  const tanda = relasi === "bersinggungan" ? -1 : 1;
  return tanda * omegaSumber * jariSumber / jariTujuan;
}

/**
 * Menentukan pusat tiga roda pada sumbu x SVG.
 * Pasangan seporos digabung sebagai satu kelompok dengan koordinat pusat
 * persis sama. Jarak antarkelompok memperhitungkan radius terluar poros agar
 * roda lain tidak menembus selubung visual roda yang sudah bertumpuk.
 */
export function hitungPusatRoda(
  radiusPiksel: readonly [number, number, number],
  relasi12: RelasiRoda,
  relasi23: RelasiRoda,
): [number, number, number] {
  const kelompok: number[][] = [];
  let aktif = [0];

  if (relasi12 === "seporos") {
    aktif.push(1);
  } else {
    kelompok.push(aktif);
    aktif = [1];
  }

  if (relasi23 === "seporos") {
    aktif.push(2);
  } else {
    kelompok.push(aktif);
    aktif = [2];
  }
  kelompok.push(aktif);

  const radiusKelompok = kelompok.map((anggota) =>
    Math.max(...anggota.map((indeks) => radiusPiksel[indeks] * 1.08)),
  );
  const xKelompok: number[] = [Math.max(155, radiusKelompok[0] + 34)];

  for (let indeks = 1; indeks < kelompok.length; indeks += 1) {
    const relasiAntarKelompok = kelompok[indeks][0] === 1 ? relasi12 : relasi23;
    const jumlahRadiusLuar = radiusKelompok[indeks - 1] + radiusKelompok[indeks];
    const jarak = relasiAntarKelompok === "bersinggungan"
      ? jumlahRadiusLuar
      : Math.max(170, jumlahRadiusLuar * 1.7);
    xKelompok.push(xKelompok[indeks - 1] + jarak);
  }

  const pusat: number[] = [0, 0, 0];
  kelompok.forEach((anggota, indeksKelompok) => {
    anggota.forEach((indeksRoda) => {
      pusat[indeksRoda] = xKelompok[indeksKelompok];
    });
  });

  return [pusat[0], pusat[1], pusat[2]];
}


export interface TitikMataRantai {
  x: number;
  y: number;
  sudut: number;
}

export interface GeometriSabuk {
  path: string;
  mataRantai: TitikMataRantai[];
  titikSinggung: {
    atasSumber: { x: number; y: number };
    atasTujuan: { x: number; y: number };
    bawahTujuan: { x: number; y: number };
    bawahSumber: { x: number; y: number };
  };
}

const TAU = Math.PI * 2;
const keDerajat = (radian: number) => (radian * 180) / Math.PI;
const formatSvg = (nilai: number) => Number(nilai.toFixed(2));

function selisihSudutPositif(awal: number, akhir: number): number {
  return ((akhir - awal) % TAU + TAU) % TAU;
}

function sampelGaris(
  awal: { x: number; y: number },
  akhir: { x: number; y: number },
  jarakMataRantai: number,
): TitikMataRantai[] {
  const dx = akhir.x - awal.x;
  const dy = akhir.y - awal.y;
  const panjang = Math.hypot(dx, dy);
  const jumlah = Math.max(1, Math.ceil(panjang / jarakMataRantai));
  const sudut = keDerajat(Math.atan2(dy, dx));

  return Array.from({ length: jumlah }, (_, indeks) => {
    const fraksi = indeks / jumlah;
    return {
      x: awal.x + dx * fraksi,
      y: awal.y + dy * fraksi,
      sudut,
    };
  });
}

function sampelBusur(
  pusatX: number,
  pusatY: number,
  radius: number,
  sudutAwal: number,
  sapuan: number,
  jarakMataRantai: number,
): TitikMataRantai[] {
  const panjang = Math.abs(sapuan) * radius;
  const jumlah = Math.max(1, Math.ceil(panjang / jarakMataRantai));

  return Array.from({ length: jumlah }, (_, indeks) => {
    const sudut = sudutAwal + (sapuan * indeks) / jumlah;
    return {
      x: pusatX + Math.cos(sudut) * radius,
      y: pusatY + Math.sin(sudut) * radius,
      sudut: keDerajat(sudut + Math.PI / 2),
    };
  });
}

/**
 * Menghasilkan lintasan sabuk terbuka berdasarkan garis singgung persekutuan luar.
 * Pusat roda berada pada satu garis horizontal; mata rantai disampling mengikuti
 * dua ruas lurus dan dua busur lingkaran sehingga tetap rapat saat radius berubah.
 */
export function hitungGeometriSabuk(
  xSumber: number,
  xTujuan: number,
  yPusat: number,
  radiusSumber: number,
  radiusTujuan: number,
  jarakMataRantai = 13,
): GeometriSabuk | null {
  const jarakPusat = xTujuan - xSumber;
  const radiusSelisih = radiusSumber - radiusTujuan;

  if (
    ![xSumber, xTujuan, yPusat, radiusSumber, radiusTujuan, jarakMataRantai].every(Number.isFinite) ||
    jarakPusat <= Math.abs(radiusSelisih) ||
    radiusSumber <= 0 || radiusTujuan <= 0 ||
    jarakMataRantai <= 0
  ) {
    return null;
  }

  // Normal titik singgung: n · (C2 - C1) = r1 - r2.
  const komponenX = radiusSelisih / jarakPusat;
  const komponenY = Math.sqrt(Math.max(0, 1 - komponenX * komponenX));

  const atasSumber = {
    x: xSumber + radiusSumber * komponenX,
    y: yPusat - radiusSumber * komponenY,
  };
  const atasTujuan = {
    x: xTujuan + radiusTujuan * komponenX,
    y: yPusat - radiusTujuan * komponenY,
  };
  const bawahTujuan = {
    x: xTujuan + radiusTujuan * komponenX,
    y: yPusat + radiusTujuan * komponenY,
  };
  const bawahSumber = {
    x: xSumber + radiusSumber * komponenX,
    y: yPusat + radiusSumber * komponenY,
  };

  const sudutAtas = Math.atan2(-komponenY, komponenX);
  const sudutBawah = Math.atan2(komponenY, komponenX);
  const sapuanTujuan = selisihSudutPositif(sudutAtas, sudutBawah);
  const sapuanSumber = selisihSudutPositif(sudutBawah, sudutAtas);
  const busurTujuanBesar = sapuanTujuan > Math.PI ? 1 : 0;
  const busurSumberBesar = sapuanSumber > Math.PI ? 1 : 0;

  const path = [
    `M ${formatSvg(atasSumber.x)} ${formatSvg(atasSumber.y)}`,
    `L ${formatSvg(atasTujuan.x)} ${formatSvg(atasTujuan.y)}`,
    `A ${formatSvg(radiusTujuan)} ${formatSvg(radiusTujuan)} 0 ${busurTujuanBesar} 1 ${formatSvg(bawahTujuan.x)} ${formatSvg(bawahTujuan.y)}`,
    `L ${formatSvg(bawahSumber.x)} ${formatSvg(bawahSumber.y)}`,
    `A ${formatSvg(radiusSumber)} ${formatSvg(radiusSumber)} 0 ${busurSumberBesar} 1 ${formatSvg(atasSumber.x)} ${formatSvg(atasSumber.y)}`,
    "Z",
  ].join(" ");

  const mataRantai = [
    ...sampelGaris(atasSumber, atasTujuan, jarakMataRantai),
    ...sampelBusur(xTujuan, yPusat, radiusTujuan, sudutAtas, sapuanTujuan, jarakMataRantai),
    ...sampelGaris(bawahTujuan, bawahSumber, jarakMataRantai),
    ...sampelBusur(xSumber, yPusat, radiusSumber, sudutBawah, sapuanSumber, jarakMataRantai),
  ];

  return {
    path,
    mataRantai,
    titikSinggung: { atasSumber, atasTujuan, bawahTujuan, bawahSumber },
  };
}
