import { useEffect } from "react";
import useCanvasDimensions from "../../../components/simulasi/useCanvasDimensions";
import {
  hitungKeadaanGerakVertikal,
  hitungMetrikGerakVertikal,
  type ParameterGerakVertikal,
} from "./mesinGerakVertikal";

type Props = {
  parameter: ParameterGerakVertikal;
  waktu: number;
  tampilkanVektor: boolean;
  scaleMode?: "boundary-box" | "actual-scale";
};

const WARNA = {
  latar: "#0b1422",
  kisi: "rgba(148, 163, 184, 0.13)",
  sumbu: "#64748b",
  lintasan: "#55e0c1",
  benda: "#ffca70",
  teks: "#9aabc2",
  vektor: "#f28e8e",
  puncak: "#8ea7ff",
};

/** Kanvas gerak vertikal dengan arah sumbu positif ke atas. */
export default function VisualisasiGerakVertikal({ parameter, waktu, tampilkanVektor, scaleMode = "boundary-box" }: Props) {
  const { canvasRef: kanvasRef, width: lebar, height: tinggi, pixelRatio: rasioPiksel } = useCanvasDimensions(16 / 9, 220);

  useEffect(() => {
    const kanvas = kanvasRef.current;
    const konteks = kanvas?.getContext("2d");
    if (!kanvas || !konteks) return;

    kanvas.width = Math.round(lebar * rasioPiksel);
    kanvas.height = Math.round(tinggi * rasioPiksel);
    konteks.setTransform(rasioPiksel, 0, 0, rasioPiksel, 0, 0);

    const metrik = hitungMetrikGerakVertikal(parameter);
    const tinggiPlot = scaleMode === "boundary-box" ? 100 : Math.max(1, metrik.tinggiMaksimum * 1.15);
    const marginAtas = 48;
    const marginBawah = 46;
    const garisTanah = tinggi - marginBawah;
    const garisBenda = lebar * 0.48;
    const plotTinggi = tinggi - marginAtas - marginBawah;
    const kePikselY = (posisi: number) => garisTanah - (posisi / tinggiPlot) * plotTinggi;
    const keadaan = hitungKeadaanGerakVertikal(parameter, Math.max(0, waktu));
    const posisiBendaY = kePikselY(keadaan.posisi);

    konteks.clearRect(0, 0, lebar, tinggi);
    konteks.fillStyle = WARNA.latar;
    konteks.fillRect(0, 0, lebar, tinggi);

    // Kisi horizontal dengan penanda ketinggian.
    konteks.strokeStyle = WARNA.kisi;
    konteks.lineWidth = 1;
    konteks.font = "11px Inter, system-ui, sans-serif";
    konteks.fillStyle = WARNA.teks;
    for (let indeks = 0; indeks <= 5; indeks += 1) {
      const y = marginAtas + (plotTinggi * indeks) / 5;
      const nilai = tinggiPlot * (1 - indeks / 5);
      konteks.beginPath();
      konteks.moveTo(42, y);
      konteks.lineTo(lebar - 22, y);
      konteks.stroke();
      konteks.fillText(nilai.toFixed(1), 8, y + 4);
    }

    // Garis tanah dan sumbu vertikal.
    konteks.strokeStyle = WARNA.sumbu;
    konteks.lineWidth = 2;
    konteks.beginPath();
    konteks.moveTo(42, garisTanah);
    konteks.lineTo(lebar - 22, garisTanah);
    konteks.moveTo(garisBenda, marginAtas - 4);
    konteks.lineTo(garisBenda, garisTanah);
    konteks.stroke();
    konteks.fillStyle = WARNA.teks;
    konteks.fillText("Tanah (y = 0)", 50, garisTanah + 22);
    konteks.strokeStyle = "rgba(145,182,255,.68)";
    konteks.lineWidth = 1.5;
    konteks.strokeRect(42, marginAtas, lebar - 64, plotTinggi);

    // Boundary mode clips the body/trajectory at the fixed 100 m viewport.
    konteks.save();
    konteks.beginPath();
    konteks.rect(42, marginAtas, lebar - 64, plotTinggi);
    konteks.clip();

    // Penanda tinggi maksimum.
    const posisiPuncak = kePikselY(metrik.tinggiMaksimum);
    konteks.strokeStyle = WARNA.puncak;
    konteks.setLineDash([5, 5]);
    konteks.beginPath();
    konteks.moveTo(garisBenda + 13, posisiPuncak);
    konteks.lineTo(lebar - 28, posisiPuncak);
    konteks.stroke();
    konteks.setLineDash([]);
    konteks.fillStyle = WARNA.puncak;
    konteks.fillText(`Tinggi maksimum: ${metrik.tinggiMaksimum.toFixed(2)} m`, garisBenda + 20, Math.max(18, posisiPuncak - 8));

    // Lintasan yang sudah ditempuh benda.
    const posisiAwalY = kePikselY(parameter.tinggiAwal);
    konteks.strokeStyle = WARNA.lintasan;
    konteks.lineWidth = 3;
    konteks.beginPath();
    konteks.moveTo(garisBenda, posisiAwalY);
    konteks.lineTo(garisBenda, posisiBendaY);
    konteks.stroke();

    // Penanda posisi awal.
    konteks.fillStyle = "#8ea7ff";
    konteks.beginPath();
    konteks.arc(garisBenda, posisiAwalY, 5, 0, Math.PI * 2);
    konteks.fill();
    konteks.fillStyle = WARNA.teks;
    konteks.fillText("Posisi awal", garisBenda + 12, posisiAwalY + 18);

    // Vektor kecepatan vertikal; arah panah mengikuti tanda kecepatan.
    if (tampilkanVektor && Math.abs(keadaan.kecepatan) > 0.001) {
      const panjang = Math.min(82, Math.max(22, Math.abs(keadaan.kecepatan) * 3));
      const arah = Math.sign(keadaan.kecepatan);
      const ujungY = posisiBendaY - arah * panjang;
      const awalX = garisBenda + 36;
      konteks.strokeStyle = WARNA.vektor;
      konteks.fillStyle = WARNA.vektor;
      konteks.lineWidth = 2.5;
      konteks.beginPath();
      konteks.moveTo(awalX, posisiBendaY);
      konteks.lineTo(awalX, ujungY);
      konteks.stroke();
      konteks.beginPath();
      konteks.moveTo(awalX, ujungY);
      konteks.lineTo(awalX - 5, ujungY + arah * 8);
      konteks.lineTo(awalX + 5, ujungY + arah * 8);
      konteks.closePath();
      konteks.fill();
      konteks.fillText("v", awalX + 9, ujungY + 4);
    }

    // Vektor percepatan gravitasi konstan, selalu mengarah ke bawah.
    const gravitasiX = garisBenda - 40;
    const gravitasiY1 = Math.max(marginAtas + 8, posisiBendaY - 12);
    const gravitasiY2 = Math.min(garisTanah - 8, gravitasiY1 + 48);
    konteks.strokeStyle = "#f6bd60";
    konteks.fillStyle = "#f6bd60";
    konteks.lineWidth = 2.5;
    konteks.beginPath();
    konteks.moveTo(gravitasiX, gravitasiY1);
    konteks.lineTo(gravitasiX, gravitasiY2);
    konteks.stroke();
    konteks.beginPath();
    konteks.moveTo(gravitasiX, gravitasiY2);
    konteks.lineTo(gravitasiX - 5, gravitasiY2 - 8);
    konteks.lineTo(gravitasiX + 5, gravitasiY2 - 8);
    konteks.closePath();
    konteks.fill();
    konteks.fillText("g", gravitasiX - 4, gravitasiY2 + 13);

    // Benda bergerak.
    konteks.shadowColor = "rgba(255, 202, 112, 0.35)";
    konteks.shadowBlur = 16;
    konteks.fillStyle = WARNA.benda;
    konteks.beginPath();
    konteks.arc(garisBenda, posisiBendaY, 10, 0, Math.PI * 2);
    konteks.fill();
    konteks.shadowBlur = 0;

    konteks.restore();

    // Informasi keadaan saat ini.
    konteks.fillStyle = WARNA.teks;
    konteks.font = "12px Inter, system-ui, sans-serif";
    konteks.fillText(`t = ${waktu.toFixed(2)} s`, 50, 20);
    konteks.fillText(`y = ${keadaan.posisi.toFixed(2)} m`, 150, 20);
    konteks.fillText(`v = ${keadaan.kecepatan.toFixed(2)} m/s`, 260, 20);
    konteks.fillText(`a = ${keadaan.percepatan.toFixed(2)} m/s²`, 50, 39);
    konteks.fillText(scaleMode === "boundary-box" ? "BOUNDARY BOX · skala tetap 0–100 m" : "ACTUAL SCALE · auto range", 50, tinggi - 8);
  }, [parameter, waktu, tampilkanVektor, scaleMode, lebar, tinggi, rasioPiksel]);

  return (
    <canvas
      ref={kanvasRef}
      role="img"
      aria-label="Visualisasi benda bergerak vertikal terhadap gravitasi"
      style={{ display: "block", width: "100%", height: tinggi, aspectRatio: `${lebar}/${tinggi}`, borderRadius: 12 }}
    />
  );
}
