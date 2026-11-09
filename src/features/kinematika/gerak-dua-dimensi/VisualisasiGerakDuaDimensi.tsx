import { useEffect, useMemo, useRef } from "react";
import {
  hitungKeadaanGerak,
  hitungMetrikGerak,
  type ModeGerakDuaDimensi,
  type ParameterGerakDuaDimensi,
} from "./mesinGerakDuaDimensi";

type Props = {
  mode: ModeGerakDuaDimensi;
  params: ParameterGerakDuaDimensi;
  time: number;
  showVectors: boolean;
};

const WARNA = {
  siatka: "rgba(148, 163, 184, 0.12)",
  sumbu: "#64748b",
  lintasan: "#55e0c1",
  benda: "#ffca70",
  teks: "#9aabc2",
  vektor: "#f28e8e",
};

/** Visualisasi gerak vertikal dan gerak parabola pada bidang dua dimensi. */
export default function VisualisasiGerakDuaDimensi({ mode, params, time, showVectors }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Batas horizontal dihitung dari amplop semua arah 0°–360°.
  // Karena tidak bergantung pada sudut aktif, rotasi dial tidak mengubah zoom.
  const rentangHorizontalTetap = useMemo(() => {
    if (mode === "freefall" || params.speed <= 0) return 1;
    let maksimum = 0;
    for (let indeks = 0; indeks < 720; indeks += 1) {
      const sudut = (indeks * 0.5 * Math.PI) / 180;
      const vx = params.speed * Math.cos(sudut);
      const vy = params.speed * Math.sin(sudut);
      const durasi = (
        vy + Math.sqrt(vy ** 2 + 2 * params.gravity * params.initialHeight)
      ) / params.gravity;
      maksimum = Math.max(maksimum, Math.abs(vx * Math.max(0, durasi)));
    }
    return Math.max(1, maksimum * 1.1);
  }, [mode, params.gravity, params.initialHeight, params.speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const width = Math.max(320, canvas.clientWidth);
    const height = 360;
    const rasioPiksel = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * rasioPiksel);
    canvas.height = Math.round(height * rasioPiksel);
    canvas.style.height = `${height}px`;
    context.setTransform(rasioPiksel, 0, 0, rasioPiksel, 0, 0);

    const marginKiri = 48;
    const marginKanan = 22;
    const marginAtas = 24;
    const marginBawah = 40;
    const lebarPlot = width - marginKiri - marginKanan;
    const tinggiPlot = height - marginAtas - marginBawah;
    const metrik = hitungMetrikGerak(mode, params);
    const durasi = Math.max(metrik.duration, 0.01);
    // Skala parabola tidak berubah ketika sudut diputar: gunakan amplop maksimum
    // yang konservatif untuk semua sudut pada kecepatan dan ketinggian yang sama.
    const amplopY = params.initialHeight + (params.speed ** 2) / (2 * params.gravity);
    const rentangX = mode === "freefall" ? 1 : rentangHorizontalTetap;
    const minX = mode === "freefall" ? 0 : -rentangX;
    const maxX = mode === "freefall" ? 1 : rentangX;
    const rentangY = Math.max((mode === "freefall" ? metrik.maxHeight : amplopY) * 1.15, 1);

    const kePikselX = (nilai: number) => marginKiri + ((nilai - minX) / (maxX - minX)) * lebarPlot;
    const kePikselY = (nilai: number) => height - marginBawah - (nilai / rentangY) * tinggiPlot;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#0b1422";
    context.fillRect(0, 0, width, height);

    // Boundary box tetap dan tidak mengikuti perubahan sudut.
    context.strokeStyle = "rgba(145,182,255,.7)";
    context.lineWidth = 1.5;
    context.strokeRect(marginKiri, marginAtas, lebarPlot, tinggiPlot);

    // Garis kisi dan angka skala.
    context.strokeStyle = WARNA.siatka;
    context.lineWidth = 1;
    context.fillStyle = WARNA.teks;
    context.font = "11px Inter, system-ui, sans-serif";

    for (let indeks = 0; indeks <= 5; indeks += 1) {
      const x = marginKiri + (lebarPlot * indeks) / 5;
      context.beginPath();
      context.moveTo(x, marginAtas);
      context.lineTo(x, height - marginBawah);
      context.stroke();
      const nilai = mode === "freefall"
        ? (durasi * indeks / 5).toFixed(1)
        : (minX + ((maxX - minX) * indeks) / 5).toFixed(rentangX < 10 ? 1 : 0);
      context.fillText(nilai, x - 8, height - 17);
    }

    for (let indeks = 0; indeks <= 4; indeks += 1) {
      const y = marginAtas + (tinggiPlot * indeks) / 4;
      context.beginPath();
      context.moveTo(marginKiri, y);
      context.lineTo(width - marginKanan, y);
      context.stroke();
      const nilai = rentangY * (1 - indeks / 4);
      context.fillText(nilai.toFixed(rentangY < 10 ? 1 : 0), 6, y + 4);
    }

    // Sumbu koordinat.
    context.strokeStyle = WARNA.sumbu;
    context.beginPath();
    context.moveTo(marginKiri, marginAtas);
    context.lineTo(marginKiri, height - marginBawah);
    context.moveTo(marginKiri, height - marginBawah);
    context.lineTo(width - marginKanan, height - marginBawah);
    context.stroke();
    if (mode === "projectile") {
      const originX = kePikselX(0);
      context.strokeStyle = "rgba(145,182,255,.48)";
      context.setLineDash([4, 5]);
      context.beginPath();
      context.moveTo(originX, marginAtas);
      context.lineTo(originX, height - marginBawah);
      context.stroke();
      context.setLineDash([]);
    }

    const waktuSaatIni = Math.min(time, durasi);
    context.strokeStyle = WARNA.lintasan;
    context.lineWidth = 2.5;
    context.beginPath();

    for (let indeks = 0; indeks <= 120; indeks += 1) {
      const waktu = (durasi * indeks) / 120;
      const keadaan = hitungKeadaanGerak(mode, params, waktu);
      const x = mode === "freefall" ? marginKiri + (waktu / durasi) * lebarPlot : kePikselX(keadaan.x);
      const y = kePikselY(Math.max(0, keadaan.y));
      if (indeks === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();

    const keadaanSaatIni = hitungKeadaanGerak(mode, params, waktuSaatIni);
    const posisiX = mode === "freefall"
      ? marginKiri + (waktuSaatIni / durasi) * lebarPlot
      : kePikselX(keadaanSaatIni.x);
    const posisiY = kePikselY(Math.max(0, keadaanSaatIni.y));

    if (showVectors && mode === "projectile") {
      const skalaVektor = 0.22;
      const ujungX = posisiX + keadaanSaatIni.vx * skalaVektor;
      const ujungY = posisiY - keadaanSaatIni.vy * skalaVektor;
      context.strokeStyle = WARNA.vektor;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(posisiX, posisiY);
      context.lineTo(ujungX, ujungY);
      context.stroke();
      context.fillStyle = WARNA.vektor;
      context.fillText("v", ujungX + 4, ujungY);
    }

    gambarBenda(context, posisiX, posisiY);
    context.fillStyle = WARNA.teks;
    context.font = "12px Inter, system-ui, sans-serif";
    context.fillText(`t = ${time.toFixed(2)} s`, marginKiri + 8, 16);

    if (mode === "freefall") {
      context.fillText("Waktu (s)", width - 66, height - 5);
      context.save();
      context.translate(14, height / 2 + 25);
      context.rotate(-Math.PI / 2);
      context.fillText("Ketinggian (m)", 0, 0);
      context.restore();
    } else {
      context.fillText("Posisi x (m)", width - 75, height - 5);
      context.save();
      context.translate(14, height / 2 + 25);
      context.rotate(-Math.PI / 2);
      context.fillText("Posisi y (m)", 0, 0);
      context.restore();
    }
  }, [mode, params, rentangHorizontalTetap, time, showVectors]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={mode === "freefall" ? "Visualisasi gerak jatuh bebas" : "Visualisasi gerak parabola"}
      style={{ display: "block", width: "100%", borderRadius: 12 }}
    />
  );
}

function gambarBenda(context: CanvasRenderingContext2D, x: number, y: number) {
  context.fillStyle = "rgba(255, 202, 112, 0.18)";
  context.beginPath();
  context.arc(x, y, 12, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = WARNA.benda;
  context.beginPath();
  context.arc(x, y, 6, 0, Math.PI * 2);
  context.fill();
}
