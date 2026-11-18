import { useEffect, useRef } from "react";
import { useBahasa } from "../../i18n/BahasaContext";

type SeriGrafik = {
  label: string;
  satuan: string;
  warna: string;
  nilai: number[];
};

type Props = {
  judul: string;
  waktu: number;
  seri: SeriGrafik[];
  waktuSampel?: number[];
  keterangan?: string;
};

/** Grafik kanvas tanpa pustaka eksternal. Setiap besaran memakai panel skala vertikal sendiri. */
export default function GrafikWaktuNyata({ judul, waktu, seri, waktuSampel, keterangan }: Props) {
  const isId = useBahasa() === "id";
  const kanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const kanvas = kanvasRef.current;
    const konteks = kanvas?.getContext("2d");
    if (!kanvas || !konteks) return undefined;

    const gambar = () => {
      const lebar = Math.max(1, kanvas.clientWidth || kanvas.parentElement?.clientWidth || 560);
      const tinggi = 236;
      const rasio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      kanvas.width = Math.round(lebar * rasio);
      kanvas.height = Math.round(tinggi * rasio);
      kanvas.style.height = `${tinggi}px`;
      konteks.setTransform(rasio, 0, 0, rasio, 0, 0);
      konteks.clearRect(0, 0, lebar, tinggi);

      const jumlahSeri = Math.max(1, seri.length);
      const kiri = 58;
      const kanan = lebar - 14;
      const atas = 9;
      const bawah = 24;
      const tinggiPanel = (tinggi - atas - bawah) / jumlahSeri;
      const semuaNilai = seri.flatMap((item) => item.nilai.filter(Number.isFinite));
      const jumlahTitik = Math.max(2, ...seri.map((item) => item.nilai.length));
      const jumlahWaktu = waktuSampel?.length ?? 0;
      const waktuAwal = jumlahWaktu > 0
        ? waktuSampel![0]
        : Math.max(0, waktu - Math.max(0, jumlahTitik - 1) * 0.08);
      const waktuAkhir = jumlahWaktu > 0 ? waktuSampel![jumlahWaktu - 1] : waktu;
      const rentangWaktu = Math.max(1e-9, waktuAkhir - waktuAwal);

      seri.forEach((item, indeks) => {
        const yAtas = atas + indeks * tinggiPanel;
        const yBawah = yAtas + tinggiPanel - 13;
        const nilai = item.nilai.filter(Number.isFinite);
        let minimum = nilai.length ? Math.min(...nilai) : -1;
        let maksimum = nilai.length ? Math.max(...nilai) : 1;
        if (Math.abs(maksimum - minimum) < 1e-9) {
          const ruang = Math.max(1, Math.abs(maksimum) * 0.15);
          minimum -= ruang;
          maksimum += ruang;
        } else {
          const ruang = (maksimum - minimum) * 0.12;
          minimum -= ruang;
          maksimum += ruang;
        }

        konteks.strokeStyle = "rgba(145, 161, 184, 0.17)";
        konteks.lineWidth = 1;
        for (let garis = 0; garis <= 2; garis += 1) {
          const y = yAtas + 13 + ((yBawah - (yAtas + 13)) * garis) / 2;
          konteks.beginPath();
          konteks.moveTo(kiri, y);
          konteks.lineTo(kanan, y);
          konteks.stroke();
        }

        konteks.fillStyle = "#dbe5f1";
        konteks.font = "600 10px sans-serif";
        konteks.fillText(`${item.label} (${item.satuan})`, 7, yAtas + 12);
        konteks.fillStyle = "#8392a8";
        konteks.font = "9px monospace";
        konteks.fillText(maksimum.toFixed(2), 8, yAtas + 25);
        konteks.fillText(minimum.toFixed(2), 8, yBawah);

        if (nilai.length > 1) {
          konteks.strokeStyle = item.warna;
          konteks.lineWidth = 2;
          konteks.lineJoin = "round";
          konteks.lineCap = "round";
          konteks.beginPath();
          item.nilai.forEach((angka, titik) => {
            if (!Number.isFinite(angka)) return;
            const waktuTitik = waktuSampel?.[titik];
            const fraksiWaktu = Number.isFinite(waktuTitik)
              ? ((waktuTitik as number) - waktuAwal) / rentangWaktu
              : titik / Math.max(1, jumlahTitik - 1);
            const x = kiri + (kanan - kiri) * fraksiWaktu;
            const y = yBawah - ((angka - minimum) / (maksimum - minimum)) * (yBawah - yAtas - 17);
            if (titik === 0) konteks.moveTo(x, y);
            else konteks.lineTo(x, y);
          });
          konteks.stroke();
        }
      });

      konteks.fillStyle = "#8392a8";
      konteks.font = "9px monospace";
      konteks.fillText(`${waktuAwal.toFixed(1)} s`, kiri, tinggi - 4);
      konteks.textAlign = "right";
      konteks.fillText(`${waktuAkhir.toFixed(1)} s`, kanan, tinggi - 4);
      konteks.textAlign = "left";
      if (semuaNilai.length === 0) {
        konteks.fillText(isId ? "Menunggu data simulasi…" : "Waiting for simulation data…", kiri + 8, tinggi / 2);
      }
    };

    gambar();
    const host = kanvas.parentElement ?? kanvas;
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => gambar());
      observer.observe(host);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", gambar);
    return () => window.removeEventListener("resize", gambar);
  }, [judul, seri, waktu, waktuSampel, isId]);

  return (
    <section className="panel panel-grafik-dinamika dinamika-analysis-visual analysis-section" aria-label={`${isId ? "Grafik waktu nyata" : "Real-time graph"}: ${judul}`}>
      <div className="simulation-header">
        <div>
          <p className="eyebrow">{isId ? "GRAFIK KANVAS WAKTU NYATA" : "REAL-TIME CANVAS GRAPH"}</p>
          <h2>{judul}</h2>
        </div>
        <span className="model-badge">t = {waktu.toFixed(2)} s</span>
      </div>
      <canvas ref={kanvasRef} className="kanvas-grafik-dinamika" role="img" aria-label={isId ? `Grafik ${seri.map((item) => item.label).join(", ")} terhadap waktu` : `${seri.map((item) => item.label).join(", ")} over time graph`} />
      <div className="legenda-grafik-dinamika">
        {seri.map((item) => (
          <span key={item.label}><i style={{ backgroundColor: item.warna }} />{item.label}</span>
        ))}
      </div>
      {keterangan && <p className="keterangan-grafik-dinamika">{keterangan}</p>}
    </section>
  );
}