import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import KartuBesaran from "../../components/simulasi/KartuBesaran";
import ModelMatematika from "../../components/simulasi/ModelMatematika";
import ParameterSlider from "../../components/simulasi/ParameterSlider";
import KontrolSimulasiDinamika from "../dinamika/KontrolSimulasiDinamika";
import { batasi, dapatkanTitikSvg } from "./InteraksiSvg";
import { hitungTorsiBanyakGaya, type BentukBendaTegar, type TitikGayaRotasi } from "./mesinDinamika";

function useJamSimulasi(durasi: number) {
  const [waktu, setWaktu] = useState(0);
  const [berjalan, setBerjalan] = useState(false);
  const [pengaliKecepatan, setPengaliKecepatan] = useState(1);
  const [tanpaBatas, setTanpaBatas] = useState(false);
  const frameRef = useRef<number | null>(null);
  const waktuTerakhirRef = useRef<number | null>(null);

  useEffect(() => {
    if (!berjalan) {
      waktuTerakhirRef.current = null;
      return;
    }

    const langkah = (now: number) => {
      if (waktuTerakhirRef.current === null) waktuTerakhirRef.current = now;
      const delta = (now - waktuTerakhirRef.current) / 1000;
      waktuTerakhirRef.current = now;

      setWaktu((sebelumnya) => {
        const berikutnya = sebelumnya + delta * pengaliKecepatan;
        if (!tanpaBatas && berikutnya >= durasi) {
          setBerjalan(false);
          return durasi;
        }
        return berikutnya;
      });

      frameRef.current = requestAnimationFrame(langkah);
    };

    frameRef.current = requestAnimationFrame(langkah);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      waktuTerakhirRef.current = null;
    };
  }, [berjalan, durasi, pengaliKecepatan, tanpaBatas]);

  const aturUlang = () => {
    setWaktu(0);
    setBerjalan(false);
    waktuTerakhirRef.current = null;
  };

  const mulaiJeda = () => {
    setBerjalan((sebelumnya) => !sebelumnya);
  };

  const aturWaktu = (nilai: number) => {
    setWaktu(Math.min(Math.max(nilai, 0), durasi));
    setBerjalan(false);
  };

  return {
    waktu,
    berjalan,
    pengaliKecepatan,
    tanpaBatas,
    setTanpaBatas,
    mulaiJeda,
    aturUlang,
    aturWaktu,
    setPengaliKecepatan,
  };
}

type ModePoros = "tetap" | "bebas";
type Gaya = TitikGayaRotasi;
type TarikanRotasi = { jenis: "pivot" | "titik" | "vektor"; id?: number };
const DURASI = 12;
const BATAS_SUDUT_PENAHAN = (42 * Math.PI) / 180;
const WARNA_GAYA = ["#55e0c1", "#f6bd60", "#8ea7ff", "#e58db2", "#b8a1ff", "#80d5e8"];
const GAYA_AWAL: Gaya[] = [
  { id: 1, posisi: -0.55, besar: 30, sudut: 0 },
  { id: 2, posisi: 0.55, besar: 30, sudut: 180 },
];

const NAMA_BENTUK: Record<BentukBendaTegar, string> = {
  cakram: "Cakram pejal",
  cincin: "Cincin tipis",
  batang: "Batang homogen",
};

function hitungInersiaPusat(bentuk: BentukBendaTegar, massa: number, ukuran: number) {
  if (bentuk === "cakram") return 0.5 * massa * ukuran ** 2;
  if (bentuk === "cincin") return massa * ukuran ** 2;
  return massa * ukuran ** 2 / 12;
}

type SeriGrafikRotasi = { label: string; satuan: string; warna: string; nilai: number[] };

function GrafikWaktuNyata({ judul, seri, keterangan }: {
  judul: string;
  waktu: number;
  seri: SeriGrafikRotasi[];
  waktuSampel: number[];
  keterangan: string;
}) {
  return (
    <section className="panel grafik-waktu-nyata">
      <div className="simulation-header"><h2>{judul}</h2></div>
      {seri.map((item) => {
        const nilai = item.nilai.slice(-90);
        const minimum = Math.min(0, ...nilai);
        const rentang = Math.max(...nilai, 0) - minimum || 1;
        const points = nilai.map((value, index) => {
          const x = nilai.length > 1 ? (index / (nilai.length - 1)) * 300 : 300;
          const y = 44 - ((value - minimum) / rentang) * 36;
          return `${x},${y}`;
        }).join(" ");
        const terakhir = nilai[nilai.length - 1] ?? 0;
        return (
          <div className="grafik-seri" key={item.label}>
            <div className="grafik-seri-heading">
              <span style={{ color: item.warna }}>{item.label}</span>
              <strong>{terakhir.toFixed(2)} {item.satuan}</strong>
            </div>
            <svg viewBox="0 0 300 52" role="img" aria-label={`${item.label}: ${terakhir.toFixed(2)} ${item.satuan}`}>
              <line x1="0" y1="44" x2="300" y2="44" stroke="#26364c" />
              <polyline points={points} fill="none" stroke={item.warna} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        );
      })}
      <p className="dinamika-control-note">{keterangan}</p>
    </section>
  );
}

export default function DinamikaRotasiSimulasi() {
  const [bentuk, setBentuk] = useState<BentukBendaTegar>("batang");
  const [modePoros, setModePoros] = useState<ModePoros>("tetap");
  const [massa, setMassa] = useState(4);
  const [ukuran, setUkuran] = useState(2);
  const [gaya, setGaya] = useState<Gaya[]>(GAYA_AWAL);
  const [posisiPivot, setPosisiPivot] = useState(0);
  const [redaman, setRedaman] = useState(0.22);
  const playback = useJamSimulasi(DURASI);
  const tarikanRotasiRef = useRef<TarikanRotasi | null>(null);
  const waktuIntegrasiRef = useRef(0);
  const akumulatorGrafikRef = useRef(0);
  const gerakRotasiRef = useRef({ sudut: 0, kecepatanSudut: 0, percepatanSudut: 0 });
  const [gerakRotasi, setGerakRotasi] = useState(gerakRotasiRef.current);
  const [riwayatRotasi, setRiwayatRotasi] = useState<Array<{ waktu: number; sudut: number; kecepatan: number; percepatan: number }>>([
    { waktu: 0, sudut: 0, kecepatan: 0, percepatan: 0 },
  ]);

  const jangkauan = bentuk === "batang" ? ukuran / 2 : ukuran;
  const batasPivot = jangkauan * 0.9;
  const porosEfektif = modePoros === "tetap" ? posisiPivot : 0;
  const momenInersiaPusat = hitungInersiaPusat(bentuk, massa, ukuran);
  const momenInersia = modePoros === "tetap"
    ? momenInersiaPusat + massa * porosEfektif ** 2
    : momenInersiaPusat;
  const torsiResultan = useMemo(
    () => hitungTorsiBanyakGaya(gaya, porosEfektif),
    [gaya, porosEfektif],
  );
  const percepatanBebas = momenInersia > 0
    ? (torsiResultan - redaman * gerakRotasi.kecepatanSudut) / momenInersia
    : 0;
  const menyentuhStopAtas =
    modePoros === "tetap" &&
    gerakRotasi.sudut >= BATAS_SUDUT_PENAHAN - 1e-6 &&
    percepatanBebas > 0;
  const menyentuhStopBawah =
    modePoros === "tetap" &&
    gerakRotasi.sudut <= -BATAS_SUDUT_PENAHAN + 1e-6 &&
    percepatanBebas < 0;
  const percepatanSudut = menyentuhStopAtas || menyentuhStopBawah
    ? 0
    : percepatanBebas;
  const kecepatanSudut = gerakRotasi.kecepatanSudut;
  const sudutPutarRad = gerakRotasi.sudut;
  const sudutPutarDerajat = (sudutPutarRad * 180) / Math.PI;

  useEffect(() => {
    const deltaTotal = playback.waktu - waktuIntegrasiRef.current;
    waktuIntegrasiRef.current = playback.waktu;
    if (deltaTotal <= 0) return;
    const jumlahLangkah = Math.max(1, Math.ceil(deltaTotal / (1 / 120)));
    const dt = deltaTotal / jumlahLangkah;
    let keadaan = { ...gerakRotasiRef.current };
    let akumulator = akumulatorGrafikRef.current;
    const sampel: Array<{ waktu: number; sudut: number; kecepatan: number; percepatan: number }> = [];

    for (let indeks = 0; indeks < jumlahLangkah; indeks += 1) {
      // Redaman viskos memperlambat rotasi dan mencegah gerak yang terlalu brutal.
      const alpha = momenInersia > 0
        ? (torsiResultan - redaman * keadaan.kecepatanSudut) / momenInersia
        : 0;
      let kecepatanBaru = keadaan.kecepatanSudut + alpha * dt;
      let sudutBaru = keadaan.sudut + keadaan.kecepatanSudut * dt + 0.5 * alpha * dt ** 2;
      let percepatanAktual = alpha;

      // Fixed pivot memiliki penahan mekanis. Jika satu langkah integrasi
      // melewati stopper, sudut dikunci dan kecepatan sudut dihentikan total.
      if (modePoros === "tetap") {
        if (sudutBaru >= BATAS_SUDUT_PENAHAN) {
          sudutBaru = BATAS_SUDUT_PENAHAN;
          if (kecepatanBaru > 0 || alpha > 0) kecepatanBaru = 0;
          percepatanAktual = 0;
        } else if (sudutBaru <= -BATAS_SUDUT_PENAHAN) {
          sudutBaru = -BATAS_SUDUT_PENAHAN;
          if (kecepatanBaru < 0 || alpha < 0) kecepatanBaru = 0;
          percepatanAktual = 0;
        }
      }
      keadaan = { sudut: sudutBaru, kecepatanSudut: kecepatanBaru, percepatanSudut: percepatanAktual };
      akumulator += dt;
      if (akumulator >= 0.08) {
        sampel.push({
          waktu: playback.waktu - deltaTotal + (indeks + 1) * dt,
          sudut: keadaan.sudut,
          kecepatan: keadaan.kecepatanSudut,
          percepatan: keadaan.percepatanSudut,
        });
        akumulator = 0;
      }
    }
    gerakRotasiRef.current = keadaan;
    akumulatorGrafikRef.current = akumulator;
    setGerakRotasi(keadaan);
    if (sampel.length) setRiwayatRotasi((lama) => [...lama, ...sampel].slice(-90));
  }, [momenInersia, modePoros, playback.waktu, redaman, torsiResultan]);

  const resetGerakRotasi = () => {
    const awal = { sudut: 0, kecepatanSudut: 0, percepatanSudut: 0 };
    waktuIntegrasiRef.current = 0;
    akumulatorGrafikRef.current = 0;
    gerakRotasiRef.current = awal;
    setGerakRotasi(awal);
    setRiwayatRotasi([{ waktu: 0, sudut: 0, kecepatan: 0, percepatan: 0 }]);
  };

  const ubahGaya = (id: number, perubahan: Partial<Gaya>) => {
    setGaya((sebelumnya) => sebelumnya.map((item) => item.id === id ? { ...item, ...perubahan } : item));
  };

  const tambahGaya = () => {
    const id = Math.max(0, ...gaya.map((item) => item.id)) + 1;
    const tanda = gaya.length % 2 === 0 ? -1 : 1;
    const baru: Gaya = {
      id,
      posisi: tanda * jangkauan * 0.65,
      besar: 20,
      sudut: 90,
    };
    setGaya((sebelumnya) => [...sebelumnya, baru]);
  };

  const hapusGaya = (id: number) => {
    setGaya((sebelumnya) => sebelumnya.filter((item) => item.id !== id));
  };

  const ubahModePoros = (mode: ModePoros) => {
    setModePoros(mode);
    if (mode === "bebas") setPosisiPivot(0);
    playback.aturUlang();
    resetGerakRotasi();
  };

  const reset = () => {
    playback.aturUlang();
    resetGerakRotasi();
    setBentuk("batang");
    setModePoros("tetap");
    setMassa(4);
    setUkuran(2);
    setGaya(GAYA_AWAL);
    setPosisiPivot(0);
    setRedaman(0.22);
    tarikanRotasiRef.current = null;
  };

  const mulaiTarikPivot = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (modePoros !== "tetap") return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    tarikanRotasiRef.current = { jenis: "pivot" };
  };

  const mulaiTarikGaya = (
    jenis: "titik" | "vektor",
    id: number,
    event: ReactPointerEvent<SVGCircleElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    tarikanRotasiRef.current = { jenis, id };
  };

  const gerakInteraksi = (event: ReactPointerEvent<SVGSVGElement>) => {
    const tarikan = tarikanRotasiRef.current;
    if (!tarikan) return;
    const titik = dapatkanTitikSvg(event);
    if (!titik) return;

    const pikselPerMeter = 130 / jangkauan;
    if (tarikan.jenis === "pivot" && modePoros === "tetap") {
      setPosisiPivot(batasi((titik.x - 270) / pikselPerMeter, -batasPivot, batasPivot));
      return;
    }

    if (tarikan.id === undefined) return;
    // Balik transformasi visual batang agar pointer tetap bekerja dalam
    // koordinat lokal batang, meskipun benda sedang berotasi.
    const sudut = sudutPutarRad;
    const dx = titik.x - pusatRotasiX;
    const dy = titik.y - pusatRotasiY;
    const xLokal = pusatRotasiX + dx * Math.cos(sudut) - dy * Math.sin(sudut);
    const yLokal = pusatRotasiY + dx * Math.sin(sudut) + dy * Math.cos(sudut);

    if (tarikan.jenis === "titik") {
      const posisiBaru = batasi((xLokal - 270) / pikselPerMeter, -jangkauan, jangkauan);
      ubahGaya(tarikan.id, { posisi: posisiBaru });
      return;
    }

    const gayaAktif = gaya.find((item) => item.id === tarikan.id);
    if (!gayaAktif) return;
    const titikKerjaX = 270 + gayaAktif.posisi * pikselPerMeter;
    const vektorX = xLokal - titikKerjaX;
    const vektorY = 150 - yLokal;
    const besarBaru = batasi(Math.hypot(vektorX, vektorY) / 0.75, 0, 150);
    const sudutBaru = (Math.atan2(vektorY, vektorX) * 180 / Math.PI + 360) % 360;
    ubahGaya(tarikan.id, { besar: besarBaru, sudut: sudutBaru });
  };

  const akhiriTarikan = (event: ReactPointerEvent<SVGSVGElement>) => {
    tarikanRotasiRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const pikselPerMeter = 130 / jangkauan;
  const xKiri = 270 - jangkauan * pikselPerMeter;
  const xKanan = 270 + jangkauan * pikselPerMeter;
  const xPivot = 270 + porosEfektif * pikselPerMeter;
  const pusatRotasiX = modePoros === "tetap" ? xPivot : 270;
  const pusatRotasiY = 150;
  const gayaDenganWarna = gaya.map((item, indeks) => ({ ...item, warna: WARNA_GAYA[indeks % WARNA_GAYA.length] }));
  const seriGrafik = [
    { label: "Sudut", satuan: "rad", warna: "#55e0c1", nilai: riwayatRotasi.map((item) => item.sudut) },
    { label: "Kecepatan sudut", satuan: "rad/s", warna: "#8ea7ff", nilai: riwayatRotasi.map((item) => item.kecepatan) },
    { label: "Percepatan sudut", satuan: "rad/s²", warna: "#f6bd60", nilai: riwayatRotasi.map((item) => item.percepatan) },
  ];

  const persamaan = [
    { judul: "Torsi setiap titik gaya", latex: String.raw`\tau_i=(x_i-x_p)F_i\sin\phi_i` },
    { judul: "Resultan torsi banyak gaya", latex: String.raw`\tau_{\text{net}}=\sum_i\tau_i` },
    { judul: "Hukum II Newton untuk rotasi", latex: String.raw`\sum\tau=I\alpha` },
    { judul: `Momen inersia pusat massa — ${NAMA_BENTUK[bentuk]}`, latex: bentuk === "batang" ? String.raw`I_{CM}=\frac{1}{12}mL^2` : bentuk === "cakram" ? String.raw`I_{CM}=\frac{1}{2}mR^2` : String.raw`I_{CM}=mR^2` },
    { judul: "Teorema sumbu sejajar untuk pivot tetap", latex: String.raw`I_p=I_{CM}+md^2` },
  ];
  const variabel = [
    { simbol: String.raw`\tau`, nama: "Torsi resultan terhadap pusat rotasi", satuan: "N·m" },
    { simbol: String.raw`x_i`, nama: "Posisi titik kerja gaya pada batang", satuan: "m" },
    { simbol: String.raw`F_i`, nama: "Besar gaya ke-i", satuan: "N" },
    { simbol: String.raw`\phi_i`, nama: "Sudut gaya terhadap batang", satuan: "°" },
    { simbol: String.raw`I`, nama: "Momen inersia terhadap poros aktual", satuan: "kg·m²" },
    { simbol: String.raw`\alpha`, nama: "Percepatan sudut", satuan: "rad/s²" },
  ];

  return (
    <section className="dinamika-simulasi">
      <div className="dinamika-section-heading">
        <div>
          <p className="eyebrow">TORSI / MOMEN INERSIA</p>
          <h2>Dinamika Rotasi &amp; Kesetimbangan</h2>
          <p>Tambahkan beberapa gaya pada titik kerja berbeda. Pilih poros tetap dengan penahan atau rotasi bebas terhadap pusat massa.</p>
        </div>
        <button type="button" className="dinamika-reset" onClick={reset}>Atur ulang</button>
      </div>

      <div className="dinamika-workspace">
        <aside className="panel control-panel">
          <div className="panel-heading"><div><p className="eyebrow">PENGATURAN</p><h2>Parameter rotasi</h2></div></div>
          <div className="dinamika-field-group">
            <label className="dinamika-field-label" htmlFor="bentuk-benda-tegar-rev">Bentuk benda tegar</label>
            <select id="bentuk-benda-tegar-rev" className="dinamika-select" value={bentuk} onChange={(event) => {
              const berikutnya = event.target.value as BentukBendaTegar;
              const jangkauanBerikutnya = berikutnya === "batang" ? ukuran / 2 : ukuran;
              setBentuk(berikutnya);
              setPosisiPivot((sebelumnya) => batasi(sebelumnya, -jangkauanBerikutnya * 0.9, jangkauanBerikutnya * 0.9));
              setGaya((sebelumnya) => sebelumnya.map((item) => ({ ...item, posisi: batasi(item.posisi, -jangkauanBerikutnya, jangkauanBerikutnya) })));
              playback.aturUlang();
              resetGerakRotasi();
            }}>
              <option value="batang">Batang homogen</option>
              <option value="cakram">Cakram pejal</option>
              <option value="cincin">Cincin tipis</option>
            </select>
          </div>
          <ParameterSlider label="Massa benda" value={massa} min={0.5} max={30} step={0.5} unit="kg" onChange={setMassa} />
          <ParameterSlider label={bentuk === "batang" ? "Panjang batang" : "Jari-jari benda"} value={ukuran} min={0.2} max={2} step={0.05} unit="m" onChange={(nilai) => {
            const jangkauanBaru = bentuk === "batang" ? nilai / 2 : nilai;
            setUkuran(nilai);
            setPosisiPivot((sebelumnya) => batasi(sebelumnya, -jangkauanBaru * 0.9, jangkauanBaru * 0.9));
            setGaya((sebelumnya) => sebelumnya.map((item) => ({ ...item, posisi: batasi(item.posisi, -jangkauanBaru, jangkauanBaru) })));
            playback.aturUlang();
            resetGerakRotasi();
          }} />
          <ParameterSlider label="Redaman viskos rotasi" value={redaman} min={0} max={1.5} step={0.01} unit="N·m·s/rad" onChange={setRedaman} />

          <div className="dinamika-control-divider" />
          <p className="dinamika-control-section-title">Mode penahan / poros</p>
          <div className="pilihan-mode pilihan-mode-poros">
            <button type="button" className={modePoros === "tetap" ? "pilihan-mode-aktif" : ""} onClick={() => ubahModePoros("tetap")}>Dengan Penahan (Fixed Pivot)</button>
            <button type="button" className={modePoros === "bebas" ? "pilihan-mode-aktif" : ""} onClick={() => ubahModePoros("bebas")}>Tanpa Penahan (Free Rotation)</button>
          </div>
          {modePoros === "tetap" ? (
            <>
              <ParameterSlider label="Posisi poros dari pusat massa" value={posisiPivot} min={-batasPivot} max={batasPivot} step={0.01} unit="m" onChange={setPosisiPivot} />
              <p className="dinamika-control-note">Poros dikunci oleh engsel tetap. Batang tertahan oleh stopper mekanis pada ±42°. Geser poros dan titik kerja gaya pada batang.</p>
            </>
          ) : (
            <p className="dinamika-control-note">Tidak ada penahan eksternal. Benda berotasi terhadap pusat massanya; posisi poros dinonaktifkan dan momen inersia memakai I pusat massa.</p>
          )}

          <div className="dinamika-control-divider" />
          <div className="pengelola-gaya-heading">
            <p className="dinamika-control-section-title">Titik kerja gaya ({gaya.length})</p>
            <button type="button" className="tombol-teks-kecil" onClick={tambahGaya}>＋ Tambah gaya</button>
          </div>
          <div className="daftar-gaya-rotasi">
            {gaya.map((item, indeks) => (
              <div className="kartu-gaya-rotasi" key={item.id}>
                <div className="kartu-gaya-rotasi-header">
                  <strong style={{ color: WARNA_GAYA[indeks % WARNA_GAYA.length] }}>Gaya {indeks + 1}</strong>
                  <button type="button" className="tombol-hapus-blok" onClick={() => hapusGaya(item.id)} disabled={gaya.length <= 1}>Hapus</button>
                </div>
                <ParameterSlider label="Posisi dari pusat massa" value={item.posisi} min={-jangkauan} max={jangkauan} step={0.01} unit="m" onChange={(nilai) => ubahGaya(item.id, { posisi: nilai })} />
                <ParameterSlider label="Besar gaya" value={item.besar} min={0} max={150} step={1} unit="N" onChange={(nilai) => ubahGaya(item.id, { besar: nilai })} />
                <ParameterSlider label="Sudut gaya terhadap batang" value={item.sudut} min={0} max={360} step={1} unit="°" onChange={(nilai) => ubahGaya(item.id, { sudut: nilai })} />
              </div>
            ))}
          </div>
        </aside>

        <div className="dinamika-main-column">
          <section className="panel dinamika-visual-panel">
            <div className="simulation-header"><div><p className="eyebrow">DIAGRAM TORSI MULTIGAYA</p><h2>Batang, titik gaya, dan poros</h2></div><span className="model-badge">{modePoros === "tetap" ? "PIVOT TETAP" : "ROTASI BEBAS"}</span></div>
            <svg viewBox="0 0 540 300" role="img" aria-label="Batang dengan banyak gaya, arah vektor, dan poros yang dapat digeser jika mode penahan aktif" onPointerMove={gerakInteraksi} onPointerUp={akhiriTarikan} onPointerCancel={akhiriTarikan}>
              <rect x="7" y="7" width="526" height="286" rx="10" fill="none" stroke="rgba(145,182,255,.42)" strokeWidth="1.3" strokeDasharray="5 6" pointerEvents="none" />
              <defs>
                {WARNA_GAYA.map((warna, indeks) => (
                  <marker key={warna} id={`panah-torsi-multi-${indeks}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={warna} /></marker>
                ))}
              </defs>
              <line x1="55" y1="150" x2="485" y2="150" stroke="#26364c" strokeWidth="1" strokeDasharray="4 7" />
              {modePoros === "tetap" && (() => {
                const jariStop = 64;
                const batasRad = BATAS_SUDUT_PENAHAN;
                const kiriStopX = pusatRotasiX + jariStop * Math.cos(Math.PI - batasRad);
                const kiriStopY = pusatRotasiY - jariStop * Math.sin(Math.PI - batasRad);
                const kananStopX = pusatRotasiX + jariStop * Math.cos(batasRad);
                const kananStopY = pusatRotasiY - jariStop * Math.sin(batasRad);
                return (
                  <g className="rotasi-fixed-stops" pointerEvents="none">
                    <path
                      d={`M ${pusatRotasiX + jariStop * Math.cos(Math.PI - batasRad)} ${pusatRotasiY - jariStop * Math.sin(Math.PI - batasRad)} A ${jariStop} ${jariStop} 0 0 1 ${kananStopX} ${kananStopY}`}
                      fill="none" stroke="#f6bd60" strokeOpacity=".48" strokeWidth="4" strokeDasharray="4 5"
                    />
                    <rect x={kiriStopX - 7} y={kiriStopY - 7} width="14" height="14" rx="3" transform={`rotate(-42 ${kiriStopX} ${kiriStopY})`} fill="#f6bd60" stroke="#ffe0a8" strokeWidth="1.4" />
                    <rect x={kananStopX - 7} y={kananStopY - 7} width="14" height="14" rx="3" transform={`rotate(42 ${kananStopX} ${kananStopY})`} fill="#f6bd60" stroke="#ffe0a8" strokeWidth="1.4" />
                    <text x={pusatRotasiX} y="48" textAnchor="middle" fill="#f6bd60" fontSize="10">PENAHAN MEKANIS · BATAS ±42°</text>
                  </g>
                );
              })()}
              <g transform={`rotate(${-(((sudutPutarDerajat % 360) + 360) % 360)} ${pusatRotasiX} ${pusatRotasiY})`}>
                {bentuk === "cakram" ? (
                  <circle cx="270" cy="150" r={jangkauan * pikselPerMeter} fill="#183247" fillOpacity=".6" stroke="#8ea7ff" strokeWidth="5" />
                ) : bentuk === "cincin" ? (
                  <circle cx="270" cy="150" r={jangkauan * pikselPerMeter} fill="none" stroke="#8ea7ff" strokeWidth="9" />
                ) : (
                  <>
                    <rect x={xKiri} y="143" width={xKanan - xKiri} height="14" rx="7" fill="#29445f" stroke="#8ea7ff" strokeWidth="2.5" />
                    <line x1={xKiri + 7} y1="147" x2={xKanan - 7} y2="147" stroke="#c2d3e9" strokeOpacity=".55" strokeWidth="1.5" />
                  </>
                )}
                <line x1={xKiri} y1="150" x2={xKanan} y2="150" stroke="#a7b8ce" strokeWidth="2" opacity=".7" />
                <circle cx="270" cy="150" r="7" fill="#15263b" stroke="#e9eef8" strokeWidth="2" />
                <g className="benda-tegar-load-marker">
                  <rect x="256" y="112" width="28" height="24" rx="4" fill="#f6bd60" fillOpacity=".88" stroke="#ffe0a8" strokeWidth="1.5" />
                  <text x="270" y="128" textAnchor="middle" fill="#38270f" fontSize="9" fontWeight="700">m</text>
                  <line x1="270" y1="136" x2="270" y2="143" stroke="#f6bd60" strokeWidth="2" />
                </g>
                {gayaDenganWarna.map((item, indeks) => {
                  const x = 270 + item.posisi * pikselPerMeter;
                  const panjang = item.besar * 0.75;
                  const rad = item.sudut * Math.PI / 180;
                  const ujungX = x + panjang * Math.cos(rad);
                  const ujungY = 150 - panjang * Math.sin(rad);
                  return (
                    <g key={item.id}>
                      <line x1={x} y1="150" x2={ujungX} y2={ujungY} stroke={item.warna} strokeWidth="3" markerEnd={`url(#panah-torsi-multi-${indeks % WARNA_GAYA.length})`} />
                      <circle cx={x} cy="150" r="8" fill={item.warna} fillOpacity=".13" stroke={item.warna} strokeWidth="2" className="rotasi-gaya-anchor" onPointerDown={(event) => mulaiTarikGaya("titik", item.id, event)} aria-label={`Geser titik kerja gaya ${indeks + 1} sepanjang batang`} />
                      <circle cx={ujungX} cy={ujungY} r="8" fill={item.warna} fillOpacity=".18" stroke={item.warna} strokeWidth="2" className="rotasi-gaya-handle" onPointerDown={(event) => mulaiTarikGaya("vektor", item.id, event)} aria-label={`Tarik vektor gaya ${indeks + 1} ke segala arah`} />
                      <text x={x + 6} y={ujungY - 8} fill={item.warna} fontSize="11" fontWeight="700">F{indeks + 1}</text>
                    </g>
                  );
                })}
              </g>

              {modePoros === "tetap" ? (
                <>
                  <path d={`M ${xPivot} 163 L ${xPivot - 19} 194 L ${xPivot + 19} 194 Z`} fill="#31445e" stroke="#8ea7ff" strokeWidth="1.5" />
                  <circle cx={xPivot} cy="150" r="8" fill="#111f31" stroke="#e9eef8" strokeWidth="3" />
                  <circle cx={xPivot} cy="150" r="17" fill="#55e0c1" fillOpacity=".08" stroke="#55e0c1" strokeOpacity=".8" strokeDasharray="3 3" className="pegangan-poros" onPointerDown={mulaiTarikPivot} aria-label="Geser poros tetap ke kiri atau kanan" />
                  <text x={xPivot} y="216" textAnchor="middle" fill="#dbe5f1" fontSize="11" fontWeight="700">Poros tetap</text>
                </>
              ) : (
                <>
                  <circle cx="270" cy="150" r="10" fill="#55e0c1" fillOpacity=".18" stroke="#55e0c1" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="270" y="216" textAnchor="middle" fill="#55e0c1" fontSize="11" fontWeight="700">Pusat massa · tanpa penahan</text>
                </>
              )}
              <text x="270" y="25" textAnchor="middle" fill="#91a1b8" fontSize="11">Tarik poros jika mode Dengan Penahan aktif</text>
              <text x="270" y="270" textAnchor="middle" fill="#91a1b8" fontSize="11">Στ = {torsiResultan.toFixed(2)} N·m · α = {percepatanSudut.toFixed(2)} rad/s²</text>
              <text x="270" y="287" textAnchor="middle" fill="#91a1b8" fontSize="10">Sudut rotasi: {sudutPutarDerajat.toFixed(1)}°</text>
            </svg>
            <div className="dinamika-legend">
              <span><i className="legend-mint" /> Titik gaya pertama</span>
              <span><i className="legend-amber" /> Titik gaya kedua</span>
              <span><i className="legend-blue" /> Benda tegar</span>
            </div>
            <p className="dinamika-status-line">
              {menyentuhStopAtas || menyentuhStopBawah ? "Batang menyentuh penahan tetap: rotasi terkunci secara mekanis sampai torsi mengarah kembali ke dalam batas." : Math.abs(torsiResultan) < 0.01 ? "Resultan torsi nol: percepatan sudut nol; benda tetap diam atau berotasi dengan kecepatan sudut konstan." : torsiResultan > 0 ? "Torsi resultan positif: percepatan sudut berlawanan arah jarum jam." : "Torsi resultan negatif: percepatan sudut searah jarum jam."}
              {modePoros === "tetap" ? ` Jarak poros dari pusat massa ${Math.abs(posisiPivot).toFixed(2)} m.` : " Benda bebas berotasi terhadap pusat massanya."}
            </p>
            <KontrolSimulasiDinamika waktu={playback.waktu} durasi={DURASI} berjalan={playback.berjalan} pengaliKecepatan={playback.pengaliKecepatan} tanpaBatas={playback.tanpaBatas} onUbahModeWaktu={playback.setTanpaBatas} onUbahWaktu={playback.aturWaktu} onMulaiJeda={playback.mulaiJeda} onAturUlang={playback.aturUlang} onUbahKecepatan={playback.setPengaliKecepatan} bisaGeser={false} />
          </section>
          <section className="metrics-grid dinamika-metrics-grid">
            <KartuBesaran label="Momen inersia aktual" value={`${momenInersia.toFixed(3)} kg·m²`} ikon="I" aksen="blue" />
            <KartuBesaran label="Torsi resultan" value={`${torsiResultan.toFixed(2)} N·m`} ikon="τ" aksen="amber" />
            <KartuBesaran label="Kecepatan sudut" value={`${kecepatanSudut.toFixed(3)} rad/s`} ikon="ω" aksen="mint" />
          </section>
          <GrafikWaktuNyata judul="Grafik sudut dan besaran rotasi" waktu={playback.waktu} seri={seriGrafik} waktuSampel={riwayatRotasi.map((item) => item.waktu)} keterangan="Grafik memakai torsi konstan selama gaya tidak diubah; perubahan torsi memperbarui percepatan sudut secara langsung." />
        </div>
      </div>

      <ModelMatematika
        deskripsi="Sistem benda tegar dengan banyak gaya titik. Resultan torsi dihitung dari jumlah hasil kali silang lengan posisi relatif terhadap poros dan gaya; mode rotasi bebas menggunakan pusat massa sebagai sumbu dinamika."
        persamaan={persamaan}
        variabel={variabel}
        catatan={(
          <>
            <p>Dengan Penahan (Fixed Pivot): poros tidak berpindah dan momen inersia menggunakan teorema sumbu sejajar. Tanpa Penahan (Free Rotation): pusat massa menjadi pusat rotasi; tidak ada reaksi tumpuan.</p>
            <p>Setiap gaya memiliki posisi, besar, dan sudut sendiri. Torsi dihitung dengan τ = rF sin φ, lalu dijumlahkan untuk memperoleh percepatan sudut α = Στ/I.</p>
            <p>Selama gaya tidak diubah, torsi konstan sehingga θ(t) = θ₀ + ω₀t + ½αt². Gesekan poros dan hambatan udara diabaikan. Modul ini menampilkan derajat kebebasan rotasi; perpindahan translasi pusat massa pada mode bebas tidak ditampilkan.</p>
          </>
        )}
      />
    </section>
  );
}