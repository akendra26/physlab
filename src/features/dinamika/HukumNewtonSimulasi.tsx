import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import KartuBesaran from "../../components/simulasi/KartuBesaran";
import ModelMatematika from "../../components/simulasi/ModelMatematika";
import ParameterSlider from "../../components/simulasi/ParameterSlider";
import GrafikWaktuNyata from "./GrafikWaktuNyata";
import { batasi, dapatkanTitikSvg } from "./InteraksiSvg";
import {
  langkahSandboxRuangBebas,
  type BalokRuangBebas,
} from "./mesinDinamika";

type Riwayat = { waktu: number; x: number; y: number; vx: number; vy: number; kecepatan: number; percepatan: number };
type Tarikan = { jenis: "balok"; id: number; offsetX: number; offsetY: number } | { jenis: "gaya"; id: number } | null;

type PropsKontrolSimulasi = {
  waktu: number;
  durasi: number;
  berjalan: boolean;
  pengaliKecepatan: number;
  tanpaBatas: boolean;
  onUbahModeWaktu: (aktif: boolean) => void;
  onUbahWaktu: (waktu: number) => void;
  onMulaiJeda: () => void;
  onAturUlang: () => void;
  onUbahKecepatan: (kecepatan: number) => void;
  bisaGeser: boolean;
};

function KontrolSimulasiDinamika({
  waktu,
  durasi,
  berjalan,
  pengaliKecepatan,
  tanpaBatas,
  onUbahModeWaktu,
  onUbahWaktu,
  onMulaiJeda,
  onAturUlang,
  onUbahKecepatan,
  bisaGeser,
}: PropsKontrolSimulasi) {
  return (
    <div className="kontrol-simulasi-dinamika">
      <button type="button" onClick={onMulaiJeda}>
        {berjalan ? "Ⅱ Jeda" : "▶ Mulai"}
      </button>
      <button type="button" onClick={onAturUlang}>■ Stop / Reset</button>
      {tanpaBatas ? (
        <span className="infinite-time-readout">t = {waktu.toFixed(1)} s · ∞</span>
      ) : (
        <label>
          Waktu {waktu.toFixed(1)} / {durasi.toFixed(0)} s
          <input
            type="range"
            min={0}
            max={durasi}
            step={0.1}
            value={Math.min(waktu, durasi)}
            disabled={!bisaGeser}
            onChange={(event) => onUbahWaktu(Number(event.target.value))}
            aria-label="Waktu simulasi"
          />
        </label>
      )}
      <label className="toggle-control infinite-time-toggle">
        <input type="checkbox" checked={tanpaBatas} onChange={(event) => onUbahModeWaktu(event.target.checked)} />
        <span className="toggle-track" />
        <span>Tanpa batas</span>
      </label>
      <label>
        Kecepatan
        <select
          value={pengaliKecepatan}
          onChange={(event) => onUbahKecepatan(Number(event.target.value))}
          aria-label="Pengali kecepatan simulasi"
        >
          <option value={0.5}>0,5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
      </label>
    </div>
  );
}

const DURASI = 30;
const SKALA = 65;
const LEBAR_BALOK = 0.9;
const TINGGI_BALOK = 0.58;
const PIXEL_PER_NEWTON = 0.18;
const BATAS_GAYA = 1000;
const BALOK_AWAL: BalokRuangBebas[] = [{
  id: 1, nama: "Balok 1", massa: 5, x: 6.15, y: 4.8, vx: 0, vy: 0, gayaX: 24, gayaY: -8,
}];

function buatTitikAwal(balok: BalokRuangBebas): Riwayat {
  return { waktu: 0, x: balok.x, y: balok.y, vx: balok.vx, vy: balok.vy, kecepatan: Math.hypot(balok.vx, balok.vy), percepatan: 0 };
}

export default function HukumNewtonSimulasi() {
  const [balok, setBalok] = useState<BalokRuangBebas[]>(BALOK_AWAL);
  const [balokAktifId, setBalokAktifId] = useState(1);
  const [gravitasi, setGravitasi] = useState(9.81);
  const [sudutBidang, setSudutBidang] = useState(0);
  const [modeTambah, setModeTambah] = useState(false);
  const [berjalan, setBerjalan] = useState(false);
  const [waktu, setWaktu] = useState(0);
  const [pengaliKecepatan, setPengaliKecepatan] = useState(1);
  const [tanpaBatas, setTanpaBatas] = useState(false);
  const [riwayat, setRiwayat] = useState<Riwayat[]>([buatTitikAwal(BALOK_AWAL[0])]);
  const riwayatRef = useRef<Riwayat[]>([buatTitikAwal(BALOK_AWAL[0])]);
  const balokRef = useRef(balok);
  const waktuRef = useRef(0);
  const idBerikutnya = useRef(2);
  const tarikanRef = useRef<Tarikan>(null);
  const balokAktifIdRef = useRef(1);
  const akumulatorGrafik = useRef(0);

  const balokAktif = balok.find((item) => item.id === balokAktifId) ?? balok[0];
  useEffect(() => { balokRef.current = balok; }, [balok]);
  useEffect(() => { balokAktifIdRef.current = balokAktifId; }, [balokAktifId]);
  useEffect(() => {
    if (!berjalan) return undefined;
    let bingkai = 0;
    let sebelumnya = 0;
    const animasikan = (capWaktu: number) => {
      if (!sebelumnya) sebelumnya = capWaktu;
      const dt = Math.min((capWaktu - sebelumnya) / 1000, 1 / 30) * pengaliKecepatan;
      sebelumnya = capWaktu;
      if (dt > 0) {
        balokRef.current = langkahSandboxRuangBebas(balokRef.current, dt, {
          gravitasi,
          sudutBidang,
          titikLantaiX: 400 / SKALA,
          titikLantaiY: 390 / SKALA,
          lebarBalok: LEBAR_BALOK,
          tinggiBalok: TINGGI_BALOK,
          batasKanvas: { kiri: 0, kanan: 800 / SKALA, atas: 0, bawah: 480 / SKALA },
        });
        waktuRef.current = tanpaBatas
          ? waktuRef.current + dt
          : Math.min(DURASI, waktuRef.current + dt);
        akumulatorGrafik.current += dt;
        setBalok([...balokRef.current]);
        setWaktu(waktuRef.current);
        if (akumulatorGrafik.current >= 0.08) {
          const selangSampel = akumulatorGrafik.current;
          akumulatorGrafik.current = 0;
          const terpilih = balokRef.current.find((item) => item.id === balokAktifIdRef.current);
          if (terpilih) {
            const lama = riwayatRef.current[riwayatRef.current.length - 1];
            const sampel: Riwayat = {
              waktu: waktuRef.current,
              x: terpilih.x,
              y: terpilih.y,
              vx: terpilih.vx,
              vy: terpilih.vy,
              kecepatan: Math.hypot(terpilih.vx, terpilih.vy),
              percepatan: lama
                ? Math.hypot(terpilih.vx - lama.vx, terpilih.vy - lama.vy) / selangSampel
                : 0,
            };
            riwayatRef.current = [...riwayatRef.current, sampel].slice(-90);
            setRiwayat(riwayatRef.current);
          }
        }
        if (!tanpaBatas && waktuRef.current >= DURASI) {
          setBerjalan(false);
          return;
        }
      }
      bingkai = window.requestAnimationFrame(animasikan);
    };
    bingkai = window.requestAnimationFrame(animasikan);
    return () => window.cancelAnimationFrame(bingkai);
  }, [berjalan, gravitasi, pengaliKecepatan, sudutBidang, tanpaBatas]);

  const perbaruiBalok = (id: number, perubahan: Partial<BalokRuangBebas>) => {
    const berikutnya = balokRef.current.map((item) => item.id === id ? { ...item, ...perubahan } : item);
    balokRef.current = berikutnya;
    setBalok(berikutnya);
  };

  const pilihBalok = (id: number) => {
    setBalokAktifId(id);
    const terpilih = balokRef.current.find((item) => item.id === id);
    if (terpilih) {
      riwayatRef.current = [buatTitikAwal(terpilih)];
      setRiwayat(riwayatRef.current);
    }
  };

  const tambahBalok = (x = 4.6, y = 3.6) => {
    const id = idBerikutnya.current++;
    const baru: BalokRuangBebas = {
      id,
      nama: `Balok ${id}`,
      massa: 3 + (id % 4),
      x: batasi(x, 0.5, 11.8),
      y: batasi(y, 0.45, 6.8),
      vx: 0,
      vy: 0,
      gayaX: 0,
      gayaY: 0,
    };
    const berikutnya = [...balokRef.current, baru];
    balokRef.current = berikutnya;
    setBalok(berikutnya);
    setBalokAktifId(id);
    riwayatRef.current = [buatTitikAwal(baru)];
    setRiwayat(riwayatRef.current);
    setModeTambah(false);
  };

  const hapusBalok = () => {
    if (balokRef.current.length <= 1) return;
    const berikutnya = balokRef.current.filter((item) => item.id !== balokAktifId);
    balokRef.current = berikutnya;
    setBalok(berikutnya);
    setBalokAktifId(berikutnya[0].id);
    riwayatRef.current = [buatTitikAwal(berikutnya[0])];
    setRiwayat(riwayatRef.current);
  };

  const aturUlang = () => {
    setBerjalan(false);
    waktuRef.current = 0;
    setWaktu(0);
    balokRef.current = BALOK_AWAL;
    setBalok(BALOK_AWAL);
    setBalokAktifId(1);
    idBerikutnya.current = 2;
    setSudutBidang(0);
    setGravitasi(9.81);
    setModeTambah(false);
    riwayatRef.current = [buatTitikAwal(BALOK_AWAL[0])];
    setRiwayat(riwayatRef.current);
  };

  const mulaiTarikBalok = (id: number, event: ReactPointerEvent<SVGRectElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const svg = event.currentTarget.ownerSVGElement;
    svg?.setPointerCapture(event.pointerId);
    let titik: { x: number; y: number } | null = null;
    if (svg) {
      const matriks = svg.getScreenCTM();
      if (matriks) {
        const posisi = svg.createSVGPoint();
        posisi.x = event.clientX;
        posisi.y = event.clientY;
        const lokal = posisi.matrixTransform(matriks.inverse());
        titik = { x: lokal.x, y: lokal.y };
      }
    }
    const item = balokRef.current.find((entri) => entri.id === id);
    if (!titik || !item) return;
    setBalokAktifId(id);
    tarikanRef.current = {
      jenis: "balok",
      id,
      offsetX: titik.x - item.x * SKALA,
      offsetY: titik.y - item.y * SKALA,
    };
  };

  const mulaiTarikGaya = (event: ReactPointerEvent<SVGCircleElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    tarikanRef.current = { jenis: "gaya", id: balokAktif.id };
  };

  const gerakPenunjuk = (event: ReactPointerEvent<SVGSVGElement>) => {
    const tarikan = tarikanRef.current;
    if (!tarikan) return;
    const titik = dapatkanTitikSvg(event);
    if (!titik) return;
    if (tarikan.jenis === "balok") {
      perbaruiBalok(tarikan.id, {
        x: batasi((titik.x - tarikan.offsetX) / SKALA, LEBAR_BALOK / 2, 800 / SKALA - LEBAR_BALOK / 2),
        y: batasi((titik.y - tarikan.offsetY) / SKALA, TINGGI_BALOK / 2, 480 / SKALA - TINGGI_BALOK / 2),
        vx: 0,
        vy: 0,
      });
    } else {
      const pusatX = balokAktif.x * SKALA;
      const pusatY = balokAktif.y * SKALA;
      perbaruiBalok(tarikan.id, {
        gayaX: batasi((titik.x - pusatX) / PIXEL_PER_NEWTON, -BATAS_GAYA, BATAS_GAYA),
        gayaY: batasi((titik.y - pusatY) / PIXEL_PER_NEWTON, -BATAS_GAYA, BATAS_GAYA),
      });
    }
  };

  const akhiriTarikan = (event: ReactPointerEvent<SVGSVGElement>) => {
    tarikanRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const klikArea = (event: ReactPointerEvent<SVGRectElement>) => {
    if (!modeTambah) return;
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const matriks = svg.getScreenCTM();
    if (!matriks) return;
    const posisi = svg.createSVGPoint();
    posisi.x = event.clientX;
    posisi.y = event.clientY;
    const lokal = posisi.matrixTransform(matriks.inverse());
    tambahBalok(lokal.x / SKALA, lokal.y / SKALA);
    event.stopPropagation();
  };

  const posisiLantai = { x: 400, y: 390 };
  const sudutRad = (sudutBidang * Math.PI) / 180;
  const tX = Math.cos(sudutRad);
  const tY = Math.sin(sudutRad);
  const pX1 = posisiLantai.x - tX * 900;
  const pY1 = posisiLantai.y - tY * 900;
  const pX2 = posisiLantai.x + tX * 900;
  const pY2 = posisiLantai.y + tY * 900;
  const pusatAktifX = balokAktif.x * SKALA;
  const pusatAktifY = balokAktif.y * SKALA;
  const ujungGayaX = pusatAktifX + balokAktif.gayaX * PIXEL_PER_NEWTON;
  const ujungGayaY = pusatAktifY + balokAktif.gayaY * PIXEL_PER_NEWTON;
  const kecepatan = Math.hypot(balokAktif.vx, balokAktif.vy);
  const momentum = balokAktif.massa * kecepatan;
  const sampelSebelumnya = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null;
  const impuls = sampelSebelumnya
    ? balokAktif.massa * Math.hypot(balokAktif.vx - sampelSebelumnya.vx, balokAktif.vy - sampelSebelumnya.vy)
    : 0;
  const seriGrafik = [
    { label: "Posisi x", satuan: "m", warna: "#55e0c1", nilai: riwayat.map((item) => item.x) },
    { label: "Kecepatan", satuan: "m/s", warna: "#8ea7ff", nilai: riwayat.map((item) => item.kecepatan) },
    { label: "Percepatan resultan", satuan: "m/s²", warna: "#f6bd60", nilai: riwayat.map((item) => item.percepatan) },
  ];

  const persamaan = [
    { judul: "Hukum II Newton dalam dua dimensi", latex: String.raw`\sum F_x=ma_x,\qquad \sum F_y=ma_y` },
    { judul: "Momentum dan impuls", latex: String.raw`\vec p=m\vec v,\qquad \vec J=\Delta\vec p=\int\vec F\,dt` },
    { judul: "Tumbukan dua benda", latex: String.raw`\vec J_1=-\vec J_2,\qquad \Delta\vec p_1=-\Delta\vec p_2` },
    { judul: "Gaya berat", latex: String.raw`\vec W=m\vec g` },
  ];
  const variabel = [
    { simbol: String.raw`m`, nama: "Massa balok", satuan: "kg" },
    { simbol: String.raw`F_x,F_y`, nama: "Komponen gaya luar bebas pada bidang 2D", satuan: "N" },
    { simbol: String.raw`p`, nama: "Momentum linear", satuan: "kg·m/s" },
    { simbol: String.raw`J`, nama: "Impuls selama selang waktu", satuan: "N·s" },
    { simbol: String.raw`e`, nama: "Koefisien restitusi tumbukan", satuan: "tanpa satuan" },
    { simbol: String.raw`\theta`, nama: "Orientasi bidang tak berujung", satuan: "°" },
  ];

  return (
    <section className="dinamika-simulasi">
      <div className="dinamika-section-heading">
        <div>
          <p className="eyebrow">SANDBOX GAYA / TRANSLASI 2D</p>
          <h2>Hukum Newton &amp; Sandbox Gaya</h2>
          <p>Tarik balok untuk memindahkannya, tarik ujung panah ke arah mana pun, lalu biarkan momentum, tumbukan, dan susunan balok berkembang secara langsung.</p>
        </div>
        <button type="button" className="dinamika-reset" onClick={aturUlang}>Atur ulang</button>
      </div>

      <div className="dinamika-workspace">
        <aside className="panel control-panel">
          <div className="panel-heading"><div><p className="eyebrow">PENGATURAN</p><h2>Objek dan gaya</h2></div></div>
          <div className="pengelola-blok">
            <span className="dinamika-field-label">Balok aktif ({balok.length} objek)</span>
            <select className="dinamika-select" value={balokAktifId} onChange={(event) => pilihBalok(Number(event.target.value))} aria-label="Pilih balok aktif">
              {balok.map((item) => <option key={item.id} value={item.id}>{item.nama}</option>)}
            </select>
            <button type="button" className={`tombol-teks-kecil ${modeTambah ? "is-selected" : ""}`} onClick={() => setModeTambah((aktif) => !aktif)}>
              {modeTambah ? "Klik area simulasi untuk menempatkan balok…" : "＋ Tambah balok di lokasi pilihan"}
            </button>
            <button type="button" className="tombol-hapus-blok" onClick={hapusBalok} disabled={balok.length <= 1}>Hapus balok aktif</button>
          </div>
          <ParameterSlider label={`Massa ${balokAktif.nama}`} value={balokAktif.massa} min={0.5} max={50} step={0.5} unit="kg" onChange={(nilai) => perbaruiBalok(balokAktif.id, { massa: nilai })} />
          <ParameterSlider label="Komponen gaya horizontal (Fx)" value={balokAktif.gayaX} min={-BATAS_GAYA} max={BATAS_GAYA} step={1} unit="N" onChange={(nilai) => perbaruiBalok(balokAktif.id, { gayaX: nilai })} />
          <ParameterSlider label="Komponen gaya vertikal (Fy)" value={balokAktif.gayaY} min={-BATAS_GAYA} max={BATAS_GAYA} step={1} unit="N" onChange={(nilai) => perbaruiBalok(balokAktif.id, { gayaY: nilai })} />
          <ParameterSlider label="Percepatan gravitasi" value={gravitasi} min={0} max={20} step={0.01} unit="m/s²" onChange={setGravitasi} />
          <ParameterSlider label="Rotasi bidang 360°" value={sudutBidang} min={0} max={360} step={1} unit="°" onChange={setSudutBidang} />
          <p className="dinamika-control-note">Garis bidang adalah permukaan tak berujung. Balok dapat ditumpuk dan saling bertumbukan. Tarik lingkaran di ujung panah hijau ke arah horizontal maupun vertikal untuk mengatur Fx dan Fy sekaligus.</p>
        </aside>

        <div className="dinamika-main-column">
          <section className="panel dinamika-visual-panel">
            <div className="simulation-header">
              <div><p className="eyebrow">RUANG BEBAS 2D / FISIKA KONTAK</p><h2>Lantai luas dan tumbukan antarbalok</h2></div>
              <span className="model-badge">BIDANG {sudutBidang.toFixed(0)}°</span>
            </div>
            <svg
              viewBox="0 0 800 480"
              role="img"
              aria-label="Sandbox fisika dua dimensi dengan lantai tak berujung, balok yang dapat dipindah, tumbukan, dan vektor gaya bebas"
              onPointerMove={gerakPenunjuk}
              onPointerUp={akhiriTarikan}
              onPointerCancel={akhiriTarikan}
              className={`kanvas-sandbox-2d ${modeTambah ? "mode-tambah-aktif" : ""}`}
            >
              <defs>
                <pattern id="kisi-sandbox-2d" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#304158" strokeWidth=".7" opacity=".5" />
                </pattern>
                <marker id="panah-gaya-2d" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#55e0c1" /></marker>
              </defs>
              <rect x="0" y="0" width="800" height="480" fill="url(#kisi-sandbox-2d)" onPointerDown={klikArea} className="area-sandbox-spawn" />
              <rect x="8" y="8" width="784" height="464" rx="10" fill="none" stroke="#91b6ff" strokeWidth="2" strokeDasharray="8 6" opacity=".85" />
              <line x1={pX1} y1={pY1} x2={pX2} y2={pY2} stroke="#71839b" strokeWidth="9" strokeLinecap="round" />
              <line x1={pX1} y1={pY1 - 7} x2={pX2} y2={pY2 - 7} stroke="#a9b8cb" strokeWidth="2" opacity=".45" />
              <circle cx={posisiLantai.x} cy={posisiLantai.y} r="5" fill="#f6bd60" />
              <text x="18" y="24" fill="#91a1b8" fontSize="12">Klik area kosong setelah memilih tambah balok · Tarik balok untuk memindahkannya</text>
              <text x="18" y="44" fill="#71839b" fontSize="10">Skala ruang: 1 m = {SKALA} piksel · Dinding pembatas empat sisi</text>

              {balok.map((item) => {
                const x = item.x * SKALA;
                const y = item.y * SKALA;
                const aktif = item.id === balokAktifId;
                return (
                  <g key={item.id}>
                    <rect
                      x={x - LEBAR_BALOK * SKALA / 2}
                      y={y - TINGGI_BALOK * SKALA / 2}
                      width={LEBAR_BALOK * SKALA}
                      height={TINGGI_BALOK * SKALA}
                      rx="7"
                      fill={aktif ? "#1d4250" : "#20334a"}
                      stroke={aktif ? "#55e0c1" : "#8496ad"}
                      strokeWidth={aktif ? 3 : 2}
                      onPointerDown={(event) => mulaiTarikBalok(item.id, event)}
                      className="balok-dapat-digeser"
                      aria-label={`Pilih dan geser ${item.nama}`}
                    />
                    <text x={x} y={y + 4} textAnchor="middle" fill="#e9eef8" fontSize="13" fontWeight="700" pointerEvents="none">m{item.id}</text>
                    <text x={x} y={y + 25} textAnchor="middle" fill="#aebbd0" fontSize="10" pointerEvents="none">{item.massa.toFixed(1)} kg</text>
                  </g>
                );
              })}

              <g className="vektor-dapat-ditarik">
                <line x1={pusatAktifX} y1={pusatAktifY} x2={ujungGayaX} y2={ujungGayaY} stroke="#55e0c1" strokeWidth="4" strokeLinecap="round" markerEnd="url(#panah-gaya-2d)" />
                <circle cx={ujungGayaX} cy={ujungGayaY} r="11" fill="#55e0c1" fillOpacity=".16" stroke="#55e0c1" strokeWidth="2" className="pegangan-vektor" onPointerDown={mulaiTarikGaya} aria-label="Tarik vektor gaya ke segala arah dalam bidang 2D" />
                <text x={ujungGayaX + 12} y={ujungGayaY - 10} fill="#55e0c1" fontSize="13" fontWeight="700">F = ({balokAktif.gayaX.toFixed(0)}, {balokAktif.gayaY.toFixed(0)}) N</text>
              </g>
            </svg>
            <div className="dinamika-legend"><span><i className="legend-mint" /> Gaya luar 2D</span><span><i className="legend-blue" /> Balok aktif</span><span><i className="legend-amber" /> Titik acuan bidang</span></div>
            <p className="dinamika-status-line">{balok.length} balok aktif di ruang simulasi. Momentum balok terpilih {momentum.toFixed(2)} kg·m/s. Tumbukan dihitung dengan impuls normal dan koreksi penetrasi.</p>
            <KontrolSimulasiDinamika
              waktu={waktu}
              durasi={DURASI}
              berjalan={berjalan}
              pengaliKecepatan={pengaliKecepatan}
              tanpaBatas={tanpaBatas}
              onUbahModeWaktu={setTanpaBatas}
              onUbahWaktu={() => undefined}
              onMulaiJeda={() => setBerjalan((aktif) => !aktif && (tanpaBatas || waktuRef.current < DURASI))}
              onAturUlang={aturUlang}
              onUbahKecepatan={setPengaliKecepatan}
              bisaGeser={false}
            />
          </section>
          <section className="metrics-grid dinamika-metrics-grid">
            <KartuBesaran label="Kecepatan balok aktif" value={`${kecepatan.toFixed(3)} m/s`} ikon="v" aksen="mint" />
            <KartuBesaran label="Momentum linear" value={`${momentum.toFixed(2)} kg·m/s`} ikon="p" aksen="blue" />
            <KartuBesaran label="Impuls antar-sampel" value={`${impuls.toFixed(2)} N·s`} ikon="J" aksen="amber" />
          </section>
          <GrafikWaktuNyata judul="Posisi, kecepatan, dan percepatan balok terpilih" waktu={waktu} seri={seriGrafik} waktuSampel={riwayat.map((item) => item.waktu)} keterangan="Grafik diperbarui saat simulasi berjalan; tiap besaran memakai rentang skala vertikal sendiri." />
        </div>
      </div>

      <ModelMatematika
        deskripsi="Model translasi dua dimensi untuk banyak balok pada bidang tak berujung. Setiap balok menerima gaya luar Fx dan Fy serta gravitasi; kontak lantai dan tumbukan antarbalok menghasilkan impuls dan perubahan momentum."
        persamaan={persamaan}
        variabel={variabel}
        catatan={(
          <>
            <p>Gaya bebas dinyatakan sebagai vektor F = (Fx, Fy), dengan sumbu y positif ke bawah pada tampilan. Drag panah mengubah kedua komponen secara simultan.</p>
            <p>Balok diperlakukan sebagai persegi panjang AABB, sedangkan bidang miring dihitung sebagai garis tak berujung yang dapat diputar 0°–360°. Tumbukan menggunakan koefisien restitusi 0,08 dan model gesekan kontak sederhana.</p>
            <p>Model cocok untuk eksperimen konseptual momentum, impuls, tumbukan, dan penumpukan. Untuk analisis rekayasa presisi tinggi, diperlukan solver kontak rigid-body dengan sub-langkah adaptif dan rotasi setiap benda.</p>
          </>
        )}
      />
    </section>
  );
}