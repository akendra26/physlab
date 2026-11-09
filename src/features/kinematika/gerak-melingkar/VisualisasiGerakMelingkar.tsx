import { useEffect, useRef } from "react";
import {
  hitungKeadaanGerakMelingkar,
  type ParameterGerakMelingkar,
} from "./mesinGerakMelingkar";

type Props = {
  parameter: ParameterGerakMelingkar;
  waktu: number;
  tampilkanVektor: boolean;
};

const WARNA = {
  latar: "#0b1422",
  kisi: "rgba(148, 163, 184, 0.13)",
  lintasan: "#55e0c1",
  benda: "#ffca70",
  teks: "#9aabc2",
  radius: "#8ea7ff",
  kecepatan: "#f28e8e",
  sentripetal: "#f6bd60",
};

/** Kanvas lintasan melingkar dengan vektor kecepatan tangensial dan percepatan sentripetal. */
export default function VisualisasiGerakMelingkar({ parameter, waktu, tampilkanVektor }: Props) {
  const kanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const kanvas = kanvasRef.current;
    const konteks = kanvas?.getContext("2d");
    if (!kanvas || !konteks) return;

    const lebar = Math.max(320, kanvas.clientWidth);
    const tinggi = 380;
    const rasioPiksel = Math.min(window.devicePixelRatio || 1, 2);
    kanvas.width = Math.round(lebar * rasioPiksel);
    kanvas.height = Math.round(tinggi * rasioPiksel);
    kanvas.style.height = `${tinggi}px`;
    konteks.setTransform(rasioPiksel, 0, 0, rasioPiksel, 0, 0);

    const pusatX = lebar / 2;
    const pusatY = tinggi / 2 + 8;
    const radiusPiksel = Math.min(118, lebar * 0.28);
    const keadaan = hitungKeadaanGerakMelingkar(parameter, Math.min(waktu, parameter.durasi));
    const theta = keadaan.sudut;
    const bendaX = pusatX + radiusPiksel * Math.cos(theta);
    const bendaY = pusatY - radiusPiksel * Math.sin(theta);

    konteks.clearRect(0, 0, lebar, tinggi);
    konteks.fillStyle = WARNA.latar;
    konteks.fillRect(0, 0, lebar, tinggi);

    // Kisi latar.
    konteks.strokeStyle = WARNA.kisi;
    konteks.lineWidth = 1;
    const jarakKisi = 32;
    for (let x = pusatX % jarakKisi; x < lebar; x += jarakKisi) {
      konteks.beginPath();
      konteks.moveTo(x, 0);
      konteks.lineTo(x, tinggi);
      konteks.stroke();
    }
    for (let y = pusatY % jarakKisi; y < tinggi; y += jarakKisi) {
      konteks.beginPath();
      konteks.moveTo(0, y);
      konteks.lineTo(lebar, y);
      konteks.stroke();
    }

    // Lingkaran lintasan.
    konteks.strokeStyle = "rgba(85, 224, 193, 0.48)";
    konteks.lineWidth = 2;
    konteks.setLineDash([6, 6]);
    konteks.beginPath();
    konteks.arc(pusatX, pusatY, radiusPiksel, 0, Math.PI * 2);
    konteks.stroke();
    konteks.setLineDash([]);

    // Jejak sudut yang sudah ditempuh. Jumlah sampel dibatasi agar tetap ringan.
    const thetaAwal = (parameter.sudutAwalDerajat * Math.PI) / 180;
    const selisihSudut = theta - thetaAwal;
    const jumlahSampel = Math.max(2, Math.min(600, Math.ceil(Math.abs(selisihSudut) * 24)));
    konteks.strokeStyle = WARNA.lintasan;
    konteks.lineWidth = 3;
    konteks.beginPath();
    for (let indeks = 0; indeks <= jumlahSampel; indeks += 1) {
      const sudut = thetaAwal + (selisihSudut * indeks) / jumlahSampel;
      const x = pusatX + radiusPiksel * Math.cos(sudut);
      const y = pusatY - radiusPiksel * Math.sin(sudut);
      if (indeks === 0) konteks.moveTo(x, y);
      else konteks.lineTo(x, y);
    }
    konteks.stroke();

    // Jari-jari dari pusat ke posisi benda.
    konteks.strokeStyle = WARNA.radius;
    konteks.lineWidth = 2;
    konteks.beginPath();
    konteks.moveTo(pusatX, pusatY);
    konteks.lineTo(bendaX, bendaY);
    konteks.stroke();
    konteks.fillStyle = WARNA.radius;
    konteks.font = "12px Inter, system-ui, sans-serif";
    const tengahRadiusX = (pusatX + bendaX) / 2;
    const tengahRadiusY = (pusatY + bendaY) / 2;
    konteks.fillText("R", tengahRadiusX + 7, tengahRadiusY - 7);

    // Pusat putaran.
    konteks.fillStyle = "#e9eef8";
    konteks.beginPath();
    konteks.arc(pusatX, pusatY, 4, 0, Math.PI * 2);
    konteks.fill();
    konteks.fillStyle = WARNA.teks;
    konteks.fillText("Pusat", pusatX + 9, pusatY + 17);

    if (tampilkanVektor) {
      // Vektor kecepatan tangensial: tegak lurus jari-jari.
      if (Math.abs(keadaan.kecepatanSudut) > 1e-6) {
        const tandaArah = Math.sign(keadaan.kecepatanSudut);
        const panjangV = Math.min(76, Math.max(22, keadaan.kecepatanTangensial * 4));
        const arahVx = -Math.sin(theta) * tandaArah;
        const arahVy = -Math.cos(theta) * tandaArah;
        gambarPanah(
          konteks,
          bendaX,
          bendaY,
          bendaX + arahVx * panjangV,
          bendaY + arahVy * panjangV,
          WARNA.kecepatan,
        );
        konteks.fillStyle = WARNA.kecepatan;
        konteks.fillText("v", bendaX + arahVx * (panjangV + 12), bendaY + arahVy * (panjangV + 12));
      }

      // Percepatan sentripetal selalu mengarah menuju pusat lingkaran.
      if (keadaan.percepatanSentripetal > 1e-6) {
        const panjangA = Math.min(66, Math.max(22, keadaan.percepatanSentripetal * 2.5));
        const arahX = (pusatX - bendaX) / radiusPiksel;
        const arahY = (pusatY - bendaY) / radiusPiksel;
        gambarPanah(
          konteks,
          bendaX,
          bendaY,
          bendaX + arahX * panjangA,
          bendaY + arahY * panjangA,
          WARNA.sentripetal,
        );
        konteks.fillStyle = WARNA.sentripetal;
        konteks.fillText("a꜀", bendaX + arahX * (panjangA + 12), bendaY + arahY * (panjangA + 12));
      }
    }

    // Benda yang bergerak pada lintasan.
    konteks.shadowColor = "rgba(255, 202, 112, 0.4)";
    konteks.shadowBlur = 17;
    konteks.fillStyle = WARNA.benda;
    konteks.beginPath();
    konteks.arc(bendaX, bendaY, 10, 0, Math.PI * 2);
    konteks.fill();
    konteks.shadowBlur = 0;

    // Label waktu dan keadaan sudut.
    konteks.fillStyle = WARNA.teks;
    konteks.font = "12px Inter, system-ui, sans-serif";
    konteks.fillText(`t = ${waktu.toFixed(2)} s`, 18, 22);
    konteks.fillText(`θ = ${keadaan.sudutDerajat.toFixed(1)}°`, 18, 42);
    konteks.fillText(`ω = ${keadaan.kecepatanSudut.toFixed(2)} rad/s`, lebar - 188, 22);

    // Legenda vektor.
    konteks.fillStyle = WARNA.kecepatan;
    konteks.fillText("v: kecepatan tangensial", 18, tinggi - 34);
    konteks.fillStyle = WARNA.sentripetal;
    konteks.fillText("a꜀: percepatan sentripetal", 18, tinggi - 15);
  }, [parameter, waktu, tampilkanVektor]);

  return (
    <canvas
      ref={kanvasRef}
      role="img"
      aria-label="Visualisasi lintasan gerak melingkar, jari-jari, kecepatan tangensial, dan percepatan sentripetal"
      style={{ display: "block", width: "100%", borderRadius: 12 }}
    />
  );
}

function gambarPanah(
  konteks: CanvasRenderingContext2D,
  awalX: number,
  awalY: number,
  akhirX: number,
  akhirY: number,
  warna: string,
) {
  const sudut = Math.atan2(akhirY - awalY, akhirX - awalX);
  konteks.strokeStyle = warna;
  konteks.fillStyle = warna;
  konteks.lineWidth = 2.5;
  konteks.beginPath();
  konteks.moveTo(awalX, awalY);
  konteks.lineTo(akhirX, akhirY);
  konteks.stroke();
  konteks.beginPath();
  konteks.moveTo(akhirX, akhirY);
  konteks.lineTo(akhirX - 9 * Math.cos(sudut - Math.PI / 6), akhirY - 9 * Math.sin(sudut - Math.PI / 6));
  konteks.lineTo(akhirX - 9 * Math.cos(sudut + Math.PI / 6), akhirY - 9 * Math.sin(sudut + Math.PI / 6));
  konteks.closePath();
  konteks.fill();
}
