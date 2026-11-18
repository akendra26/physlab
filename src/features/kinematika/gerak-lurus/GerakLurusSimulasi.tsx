
import { DockableControlPanel, useKinematicsScaleMode } from "../../../components/simulasi/SimulationExperience";
import { useMemo, useState } from "react";

import GrafikMini from "../../../components/simulasi/GrafikMini";
import KartuBesaran from "../../../components/simulasi/KartuBesaran";
import KontrolWaktuSimulasi from "../../../components/simulasi/KontrolWaktuSimulasi";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import ModelMatematika from "../../../components/simulasi/ModelMatematika";

import usePlayback from "../usePlayback";
import VisualisasiGerakLurus from "./VisualisasiGerakLurus";

import {
  calculateLinearMotionState,
  DEFAULT_LINEAR_PARAMS,
  getLinearMotionMetrics,
  type LinearMotionMode,
  type LinearMotionParams,
} from "./mesinGerakLurus";

type Grafik = {
  judul: string;
  labelSumbu: string;
  nilai: number[];
  warna: string;
};

const INFORMASI: Record<
  LinearMotionMode,
  { judul: string; deskripsi: string }
> = {
  glb: {
    judul: "Gerak Lurus Beraturan (GLB)",
    deskripsi:
      "Amati gerak benda pada lintasan lurus dengan kecepatan konstan dan percepatan nol.",
  },
  glbb: {
    judul: "Gerak Lurus Berubah Beraturan (GLBB)",
    deskripsi:
      "Ubah kecepatan awal dan percepatan konstan untuk mempelajari perubahan gerak benda.",
  },
};

export default function GerakLurusSimulasi() {
  const [mode, setMode] = useState<LinearMotionMode>("glb");
  const scaleMode = useKinematicsScaleMode();

  const [parameter, setParameter] =
    useState<LinearMotionParams>(DEFAULT_LINEAR_PARAMS);

  const [vektorAktif, setVektorAktif] = useState(true);
  const [sumbuAktif, setSumbuAktif] = useState(true);

  const playback = usePlayback(parameter.duration);

  const informasi = INFORMASI[mode];

  const metrik = useMemo(
    () => getLinearMotionMetrics(mode, parameter),
    [mode, parameter]
  );

  // Menghasilkan sampel data untuk grafik.
  const sampel = useMemo(() => {
    const jumlahSampel = 101;

    return Array.from({ length: jumlahSampel }, (_, indeks) => {
      const waktu =
        (parameter.duration * indeks) / (jumlahSampel - 1);

      return calculateLinearMotionState(mode, parameter, waktu);
    });
  }, [mode, parameter]);

  // Data grafik posisi, kecepatan, dan percepatan.
  const grafik: Grafik[] = [
    {
      judul: "Posisi terhadap waktu",
      labelSumbu: "x (m)",
      nilai: sampel.map((keadaan) => keadaan.x),
      warna: "#55e0c1",
    },
    {
      judul: "Kecepatan terhadap waktu",
      labelSumbu: "v (m/s)",
      nilai: sampel.map((keadaan) => keadaan.vx),
      warna: "#8ea7ff",
    },
    {
      judul: "Percepatan terhadap waktu",
      labelSumbu: "a (m/s²)",
      nilai: sampel.map((keadaan) => keadaan.ax),
      warna: "#f6bd60",
    },
  ];

  // Mengatur perubahan parameter simulasi.
  const ubahParameter = <
    K extends keyof LinearMotionParams
  >(
    kunci: K,
    nilai: LinearMotionParams[K]
  ) => {
    setParameter((saatIni) => ({
      ...saatIni,
      [kunci]: nilai,
    }));

    // Keep the running clock: the analytic state is re-evaluated at the current t.
  };

  // Mengganti mode GLB atau GLBB.
  const pilihMode = (modeBaru: LinearMotionMode) => {
    if (modeBaru === mode) return;

    setMode(modeBaru);
    playback.setBerjalan(false);
    playback.aturUlang();
  };

  // Mengembalikan seluruh parameter ke kondisi awal.
  const kembalikanAwal = () => {
    setParameter(DEFAULT_LINEAR_PARAMS);
    setVektorAktif(true);
    setSumbuAktif(true);

    playback.setBerjalan(false);
    playback.setPengaliKecepatan(1);
    playback.aturUlang();
  };

  // Mengekspor data simulasi ke CSV.
  const eksporData = () => {
    const baris = [
      [
        "Waktu (s)",
        "Posisi (m)",
        "Kecepatan (m/s)",
        "Percepatan (m/s²)",
      ],
      ...sampel.map((keadaan) => [
        keadaan.t.toFixed(5),
        keadaan.x.toFixed(6),
        keadaan.vx.toFixed(6),
        keadaan.ax.toFixed(6),
      ]),
    ];

    const isiCsv = baris
      .map((kolom) => kolom.join(","))
      .join("\n");

    const berkas = new Blob(
      ["\uFEFF", isiCsv],
      { type: "text/csv;charset=utf-8;" }
    );

    const alamat = URL.createObjectURL(berkas);
    const tautan = document.createElement("a");

    tautan.href = alamat;
    tautan.download = `data-${mode}-physlab.csv`;
    tautan.click();

    URL.revokeObjectURL(alamat);
  };

  const persamaanModel = mode === "glb"
    ? [
        { judul: "Posisi terhadap waktu", latex: String.raw`x(t)=x_0+vt` },
        { judul: "Perpindahan", latex: String.raw`\Delta x=v\,\Delta t` },
        { judul: "Kecepatan konstan", latex: String.raw`v=\frac{\Delta x}{\Delta t}` },
        { judul: "Percepatan", latex: String.raw`a=0` },
      ]
    : [
        { judul: "Posisi terhadap waktu", latex: String.raw`x(t)=x_0+v_0t+\frac{1}{2}at^2` },
        { judul: "Kecepatan terhadap waktu", latex: String.raw`v(t)=v_0+at` },
        { judul: "Hubungan kecepatan dan perpindahan", latex: String.raw`v^2=v_0^2+2a(x-x_0)` },
        { judul: "Percepatan rata-rata", latex: String.raw`a=\frac{v-v_0}{t}` },
      ];

  const variabelModel = [
    { simbol: String.raw`x(t)`, nama: "Posisi pada waktu t", satuan: "m" },
    { simbol: String.raw`x_0`, nama: "Posisi awal", satuan: "m" },
    ...(mode === "glb"
      ? [{ simbol: String.raw`v`, nama: "Kecepatan konstan", satuan: "m/s" }]
      : [{ simbol: String.raw`v_0`, nama: "Kecepatan awal", satuan: "m/s" }]),
    ...(mode === "glbb"
      ? [{ simbol: String.raw`v(t)`, nama: "Kecepatan pada waktu t", satuan: "m/s" }]
      : []),
    { simbol: String.raw`a`, nama: mode === "glb" ? "Percepatan (nol pada GLB)" : "Percepatan konstan", satuan: "m/s²" },
    { simbol: String.raw`\Delta x`, nama: "Perpindahan", satuan: "m" },
    { simbol: String.raw`\Delta t`, nama: "Selang waktu", satuan: "s" },
    { simbol: String.raw`t`, nama: "Waktu sejak awal pengamatan", satuan: "s" },
  ];

  return (
    <>
      {/* =====================================
          JUDUL HALAMAN
      ====================================== */}

      <section className="page-heading">
        <p className="eyebrow">
          SIMULASI FISIKA / KINEMATIKA / GERAK LURUS
        </p>

        <div className="page-title-row">
          <div>
            <h1>{informasi.judul}</h1>

            <p className="page-description">
              {informasi.deskripsi}
            </p>
          </div>

          <span className="module-status">
            <span /> MODUL AKTIF
          </span>
        </div>
      </section>

      {/* =====================================
          PEMILIHAN MODE GLB DAN GLBB
      ====================================== */}

      <section className="mode-selector panel">
        <div className="mode-selector-heading">
          <div>
            <p className="eyebrow">PILIH JENIS GERAK</p>
            <h2>Mode Simulasi</h2>
          </div>

          <span className="mode-indicator">
            {mode.toUpperCase()} AKTIF
          </span>
        </div>

        <div
          className="mode-tabs"
          role="tablist"
          aria-label="Jenis gerak lurus"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "glb"}
            className={`mode-tab ${
              mode === "glb" ? "active" : ""
            }`}
            onClick={() => pilihMode("glb")}
          >
            <span className="mode-tab-code">01</span>

            <span className="mode-tab-content">
              <strong>GLB</strong>
              <small>Gerak Lurus Beraturan</small>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "glbb"}
            className={`mode-tab ${
              mode === "glbb" ? "active" : ""
            }`}
            onClick={() => pilihMode("glbb")}
          >
            <span className="mode-tab-code">02</span>

            <span className="mode-tab-content">
              <strong>GLBB</strong>
              <small>Gerak Lurus Berubah Beraturan</small>
            </span>
          </button>
        </div>
      </section>

      {/* =====================================
          AREA SIMULASI
      ====================================== */}

      <section className="workspace">
        {/* PANEL PARAMETER */}

        <DockableControlPanel><aside className="control-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                PENGATURAN EKSPERIMEN
              </p>

              <h2>Parameter</h2>
            </div>

            <span className="settings-icon" aria-hidden="true">
              ☷
            </span>
          </div>

          <ParameterSlider
            label="Posisi awal (x₀)"
            value={parameter.initialPosition}
            min={-50}
            max={50}
            step={1}
            unit="m"
            onChange={(nilai) =>
              ubahParameter("initialPosition", nilai)
            }
          />

          <ParameterSlider
            label="Kecepatan awal (v₀)"
            value={parameter.initialVelocity}
            min={-20}
            max={20}
            step={0.5}
            unit="m/s"
            onChange={(nilai) =>
              ubahParameter("initialVelocity", nilai)
            }
          />

          {mode === "glbb" && (
            <ParameterSlider
              label="Percepatan (a)"
              value={parameter.acceleration}
              min={-10}
              max={10}
              step={0.5}
              unit="m/s²"
              onChange={(nilai) =>
                ubahParameter("acceleration", nilai)
              }
            />
          )}

          <ParameterSlider
            label="Durasi pengamatan"
            value={parameter.duration}
            min={1}
            max={20}
            step={1}
            unit="s"
            onChange={(nilai) =>
              ubahParameter("duration", nilai)
            }
          />

          <div className="control-divider" />

          <div className="control-note">
            <span className="note-icon" aria-hidden="true">
              ⓘ
            </span>

            <p>
              {mode === "glb"
                ? "Model satu dimensi ideal. Kecepatan tetap, percepatan nol, dan arah positif ditetapkan ke kanan."
                : "Model satu dimensi ideal dengan percepatan konstan. Tanda negatif menunjukkan arah ke kiri atau perlambatan, bergantung pada arah kecepatan."}
            </p>
          </div>

          <button
            className="secondary-button full-width"
            type="button"
            onClick={kembalikanAwal}
          >
            <span aria-hidden="true">↺</span>
            Kembalikan parameter awal
          </button>
        </aside></DockableControlPanel>

        {/* VISUALISASI DAN KONTROL */}

        <div className="main-column">
          <section className="simulation-panel panel">
            <div className="simulation-header">
              <div>
                <p className="eyebrow">
                  VISUALISASI LANGSUNG
                </p>

                <h2>{informasi.judul}</h2>

                <p className="section-description">
                  Lintasan satu dimensi, posisi, dan arah
                  kecepatan benda ditampilkan secara langsung.
                </p>
              </div>

              <span className="model-badge">
                <span /> MODEL IDEAL
              </span>
            </div>

            <VisualisasiGerakLurus
              mode={mode}
              params={parameter}
              time={playback.tanpaBatas ? playback.waktu % Math.max(parameter.duration, 0.01) : playback.waktu}
              showVectors={vektorAktif}
              showAxes={sumbuAktif}
              scaleMode={scaleMode}
            />
            <label className="toggle-control axis-toggle">
              <input type="checkbox" checked={sumbuAktif} onChange={(event) => setSumbuAktif(event.target.checked)} />
              <span className="toggle-track" />
              <span>Sumbu koordinat Cartesian</span>
            </label>

            <KontrolWaktuSimulasi
              waktu={playback.waktu}
              durasi={parameter.duration}
              berjalan={playback.berjalan}
              pengaliKecepatan={playback.pengaliKecepatan}
              tanpaBatas={playback.tanpaBatas}
              onUbahModeWaktu={playback.setTanpaBatas}
              tampilkanPengalihVektor
              vektorAktif={vektorAktif}
              onUbahWaktu={(waktu) => {
                playback.setBerjalan(false);
                playback.aturWaktu(waktu);
              }}
              onMulaiJeda={playback.mulaiJeda}
              onAturUlang={playback.aturUlang}
              onStop={() => playback.setBerjalan(false)}
              onUbahKecepatan={playback.setPengaliKecepatan}
              onUbahVektor={setVektorAktif}
            />
          </section>

          {/* BESARAN FISIKA */}

          <section className="metrics-grid">
            <KartuBesaran
              label="Perpindahan"
              value={`${metrik.displacement.toFixed(2)} m`}
              ikon="↔"
              aksen="mint"
            />

            <KartuBesaran
              label="Posisi akhir"
              value={`${metrik.finalPosition.toFixed(2)} m`}
              ikon="⌖"
              aksen="blue"
            />

            <KartuBesaran
              label="Kecepatan akhir"
              value={`${metrik.finalVelocity.toFixed(2)} m/s`}
              ikon="↗"
              aksen="amber"
            />
          </section>
        </div>
      </section>

      <ModelMatematika
        deskripsi={mode === "glb"
          ? "Gerak satu dimensi dengan kecepatan tetap. Mesin simulasi menetapkan percepatan sama dengan nol pada mode GLB."
          : "Gerak satu dimensi dengan percepatan konstan. Tanda positif atau negatif mengikuti arah sumbu yang dipilih pada simulasi."}
        persamaan={persamaanModel}
        variabel={variabelModel}
        catatan={mode === "glb"
          ? "Arah positif ditetapkan ke kanan. Kecepatan bertanda negatif menunjukkan benda bergerak ke kiri."
          : "Persamaan percepatan a = (v − v₀)/t berlaku untuk pengukuran dari t = 0 dengan percepatan konstan."}
      />

      {/* =====================================
          ANALISIS DAN GRAFIK
      ====================================== */}

      <section className="analysis-section">
        <div className="analysis-heading">
          <div>
            <p className="eyebrow">ANALISIS GERAK</p>

            <h2>Grafik besaran fisika</h2>

            <p className="section-description">
              Bandingkan perubahan posisi, kecepatan, dan
              percepatan sepanjang waktu pengamatan.
            </p>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={eksporData}
          >
            ↓ Ekspor data CSV
          </button>
        </div>

        <div className="graphs-grid">
          {grafik.map((item) => (
            <GrafikMini
              key={item.judul}
              title={item.judul}
              yLabel={item.labelSumbu}
              values={item.nilai}
              color={item.warna}
            />
          ))}
        </div>
      </section>
    </>
  );
}
