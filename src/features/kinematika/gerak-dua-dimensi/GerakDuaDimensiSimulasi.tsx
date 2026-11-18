import { useMemo, useState } from "react";
import { DockableControlPanel, useKinematicsScaleMode } from "../../../components/simulasi/SimulationExperience";
import GrafikMini from "../../../components/simulasi/GrafikMini";
import KartuBesaran from "../../../components/simulasi/KartuBesaran";
import KontrolWaktuSimulasi from "../../../components/simulasi/KontrolWaktuSimulasi";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import RotaryDial from "../../../components/simulasi/RotaryDial";
import ModelMatematika from "../../../components/simulasi/ModelMatematika";
import usePlayback from "../usePlayback";
import VisualisasiGerakDuaDimensi from "./VisualisasiGerakDuaDimensi";
import {
  hitungGerakParabola,
  hitungMetrikParabola,
  PARAMETER_AWAL_DUA_DIMENSI,
  type ParameterGerakDuaDimensi,
} from "./mesinGerakDuaDimensi";

type Grafik = { judul: string; labelSumbu: string; nilai: number[]; warna: string };

/** Eksperimen gerak parabola; GJB terintegrasi di modul Gerak Vertikal. */
export default function GerakDuaDimensiSimulasi() {
  const [parameter, setParameter] = useState<ParameterGerakDuaDimensi>(PARAMETER_AWAL_DUA_DIMENSI);
  const scaleMode = useKinematicsScaleMode();
  const [vektorAktif, setVektorAktif] = useState(true);
  const metrik = useMemo(() => hitungMetrikParabola(parameter), [parameter]);
  const playback = usePlayback(Math.max(metrik.duration, 0.01));
  const waktuLintasan = playback.tanpaBatas
    ? playback.waktu % Math.max(metrik.duration, 0.01)
    : playback.waktu;
  const keadaanSaatIni = useMemo(() => hitungGerakParabola(parameter, waktuLintasan), [parameter, waktuLintasan]);

  const sampel = useMemo(() => Array.from({ length: 121 }, (_, index) => {
    const waktu = (metrik.duration * index) / 120;
    return hitungGerakParabola(parameter, waktu);
  }), [metrik.duration, parameter]);

  const grafik: Grafik[] = [
    { judul: "Posisi horizontal", labelSumbu: "x (m)", nilai: sampel.map((item) => item.x), warna: "#55e0c1" },
    { judul: "Posisi vertikal", labelSumbu: "y (m)", nilai: sampel.map((item) => item.y), warna: "#8ea7ff" },
    { judul: "Kecepatan horizontal", labelSumbu: "vₓ (m/s)", nilai: sampel.map((item) => item.vx), warna: "#f6bd60" },
    { judul: "Kecepatan vertikal", labelSumbu: "vᵧ (m/s)", nilai: sampel.map((item) => item.vy), warna: "#f28e8e" },
  ];

  const ubahParameter = <K extends keyof ParameterGerakDuaDimensi>(kunci: K, nilai: ParameterGerakDuaDimensi[K]) => {
    setParameter((sebelumnya) => ({ ...sebelumnya, [kunci]: nilai }));
    // Waktu tidak diubah: posisi dan vektor dihitung ulang pada t yang sama.
  };

  const kembalikanAwal = () => {
    setParameter(PARAMETER_AWAL_DUA_DIMENSI);
    setVektorAktif(true);
    playback.setPengaliKecepatan(1);
    playback.aturUlang();
  };

  const eksporData = () => {
    const rows = [
      ["Waktu (s)", "Posisi X (m)", "Posisi Y (m)", "Kecepatan X (m/s)", "Kecepatan Y (m/s)", "Percepatan X (m/s²)", "Percepatan Y (m/s²)"],
      ...sampel.map((item) => [item.t, item.x, item.y, item.vx, item.vy, item.ax, item.ay].map((value) => value.toFixed(6))),
    ];
    const blob = new Blob(["\uFEFF", rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "data-gerak-parabola-physlab.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const persamaanModel = [
    { judul: "Komponen kecepatan awal horizontal", latex: String.raw`v_{0x}=v_0\cos\theta` },
    { judul: "Komponen kecepatan awal vertikal", latex: String.raw`v_{0y}=v_0\sin\theta` },
    { judul: "Posisi horizontal", latex: String.raw`x(t)=v_0\cos\theta\,t` },
    { judul: "Posisi vertikal", latex: String.raw`y(t)=h_0+v_0\sin\theta\,t-\frac{1}{2}gt^2` },
    { judul: "Kecepatan horizontal", latex: String.raw`v_x(t)=v_0\cos\theta` },
    { judul: "Kecepatan vertikal", latex: String.raw`v_y(t)=v_0\sin\theta-gt` },
    { judul: "Vektor percepatan", latex: String.raw`\vec{a}(t)=-g\hat{\jmath}` },
    { judul: "Waktu mencapai puncak", latex: String.raw`t_{\max}=\frac{v_0\sin\theta}{g}` },
    { judul: "Tinggi maksimum", latex: String.raw`H_{\max}=h_0+\frac{v_0^2\sin^2\theta}{2g}` },
    { judul: "Waktu hingga menyentuh tanah", latex: String.raw`t_f=\frac{v_0\sin\theta+\sqrt{v_0^2\sin^2\theta+2gh_0}}{g}` },
  ];
  const variabelModel = [
    { simbol: String.raw`x,y`, nama: "Koordinat posisi horizontal dan vertikal", satuan: "m" },
    { simbol: String.raw`h_0`, nama: "Ketinggian awal", satuan: "m" },
    { simbol: String.raw`v_0`, nama: "Besar kecepatan awal", satuan: "m/s" },
    { simbol: String.raw`\theta`, nama: "Sudut arah peluncuran", satuan: "derajat" },
    { simbol: String.raw`v_x,v_y`, nama: "Komponen kecepatan", satuan: "m/s" },
    { simbol: String.raw`g`, nama: "Percepatan gravitasi", satuan: "m/s²" },
    { simbol: String.raw`t`, nama: "Waktu sejak peluncuran", satuan: "s" },
  ];

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">SIMULASI FISIKA / KINEMATIKA / GERAK DUA DIMENSI</p>
        <div className="page-title-row">
          <div>
            <h1>Gerak Parabola</h1>
            <p className="page-description">Atur kecepatan, ketinggian, dan arah peluncuran pada seluruh rentang 0°–360°.</p>
          </div>
          <span className="module-status"><span /> MODUL AKTIF</span>
        </div>
      </section>

      <section className="workspace">
        <DockableControlPanel>
          <aside className="control-panel panel">
            <div className="panel-heading"><div><p className="eyebrow">PENGATURAN EKSPERIMEN</p><h2>Parameter lintasan</h2></div><span className="settings-icon" aria-hidden="true">☷</span></div>
            <ParameterSlider label="Kecepatan awal" value={parameter.speed} min={0} max={50} step={0.5} unit="m/s" onChange={(value) => ubahParameter("speed", value)} />
            <RotaryDial label="Sudut peluncuran" value={parameter.angleDeg} min={0} max={360} step={1} onChange={(value) => ubahParameter("angleDeg", value)} />
            <ParameterSlider label="Ketinggian awal" value={parameter.initialHeight} min={0} max={50} step={0.5} unit="m" onChange={(value) => ubahParameter("initialHeight", value)} />
            <ParameterSlider label="Percepatan gravitasi" value={parameter.gravity} min={1} max={20} step={0.01} unit="m/s²" onChange={(value) => ubahParameter("gravity", value)} />
            <div className="control-divider" />
            <div className="control-note"><span className="note-icon" aria-hidden="true">ⓘ</span><p>Rotary dial menerima sentuhan dan drag. Perubahan parameter memperbarui lintasan pada waktu simulasi yang sedang aktif; hambatan udara diabaikan.</p></div>
            <button className="secondary-button full-width" type="button" onClick={kembalikanAwal}>↺ Kembalikan parameter awal</button>
          </aside>
        </DockableControlPanel>

        <div className="main-column">
          <section className="simulation-panel panel">
            <div className="simulation-header"><div><p className="eyebrow">VISUALISASI LANGSUNG</p><h2>Lintasan dua dimensi</h2><p className="section-description">Sudut bertanda menentukan arah horizontal dan vertikal; skala kanvas mengikuti mode yang dipilih.</p></div><span className="model-badge"><span /> MODEL IDEAL</span></div>
            <VisualisasiGerakDuaDimensi params={parameter} time={waktuLintasan} showVectors={vektorAktif} scaleMode={scaleMode} />
            <label className="toggle-control axis-toggle"><input type="checkbox" checked={vektorAktif} onChange={(event) => setVektorAktif(event.target.checked)} /><span className="toggle-track" /><span>Tampilkan vektor kecepatan dan gravitasi</span></label>
            <KontrolWaktuSimulasi
              waktu={playback.waktu} durasi={metrik.duration} berjalan={playback.berjalan}
              pengaliKecepatan={playback.pengaliKecepatan} tanpaBatas={playback.tanpaBatas}
              onUbahModeWaktu={playback.setTanpaBatas} tampilkanPengalihVektor={false}
              onUbahWaktu={(value) => { playback.setBerjalan(false); playback.aturWaktu(value); }}
              onMulaiJeda={playback.mulaiJeda} onAturUlang={playback.aturUlang}
              onUbahKecepatan={playback.setPengaliKecepatan}
            />
          </section>
          <section className="metrics-grid">
            <KartuBesaran label="Waktu sampai tanah" value={`${metrik.duration.toFixed(2)} s`} ikon="◷" aksen="mint" />
            <KartuBesaran label="Perpindahan horizontal" value={`${metrik.range.toFixed(2)} m`} ikon="↔" aksen="blue" />
            <KartuBesaran label="Ketinggian maksimum" value={`${metrik.maxHeight.toFixed(2)} m`} ikon="⌃" aksen="amber" />
            <KartuBesaran label="Kelajuan saat ini" value={`${Math.hypot(keadaanSaatIni.vx, keadaanSaatIni.vy).toFixed(2)} m/s`} ikon="➤" aksen="rose" />
          </section>
        </div>
      </section>

      <ModelMatematika deskripsi="Gerak parabola ideal adalah gabungan GLB pada sumbu horizontal dan GLBB pada sumbu vertikal. Sudut 0°–360° diperlakukan sebagai sudut berarah, sehingga peluncuran ke kiri maupun ke bawah tetap dihitung." persamaan={persamaanModel} variabel={variabelModel} catatan="Waktu simulasi tidak direset saat slider diubah. Mesin mengevaluasi ulang posisi dan kecepatan pada nilai t yang sama dengan parameter baru. Pada mode waktu tanpa batas, visualisasi mengulang fase lintasan tanpa mengubah jam simulasi." />

      <section className="analysis-section">
        <div className="analysis-heading"><div><p className="eyebrow">ANALISIS GERAK</p><h2>Grafik besaran fisika</h2><p className="section-description">Bandingkan komponen posisi dan kecepatan selama lintasan.</p></div><button className="secondary-button" type="button" onClick={eksporData}>↓ Ekspor data CSV</button></div>
        <div className="graphs-grid">{grafik.map((item) => <GrafikMini key={item.judul} title={item.judul} yLabel={item.labelSumbu} values={item.nilai} color={item.warna} />)}</div>
      </section>
    </>
  );
}
