
import { useMemo, useState } from "react";
import { DockableControlPanel, useKinematicsScaleMode } from "../../../components/simulasi/SimulationExperience";

import GrafikMini from "../../../components/simulasi/GrafikMini";
import KartuBesaran from "../../../components/simulasi/KartuBesaran";
import KontrolWaktuSimulasi from "../../../components/simulasi/KontrolWaktuSimulasi";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import ModelMatematika from "../../../components/simulasi/ModelMatematika";

import usePlayback from "../usePlayback";
import VisualisasiGerakMelingkar from "./VisualisasiGerakMelingkar";
import RodaRodaSimulasi from "./RodaRodaSimulasi";

import {
  hitungKeadaanGerakMelingkar,
  PARAMETER_AWAL_GERAK_MELINGKAR,
  type ModeGerakMelingkar,
  type ParameterGerakMelingkar,
} from "./mesinGerakMelingkar";

// Informasi judul dan deskripsi setiap mode.
const INFORMASI: Record<
  ModeGerakMelingkar,
  { judul: string; deskripsi: string }
> = {
  gmb: {
    judul: "Gerak Melingkar Beraturan (GMB)",
    deskripsi:
      "Amati gerak benda pada lintasan melingkar dengan kecepatan sudut konstan dan percepatan sudut nol.",
  },
  gmbb: {
    judul: "Gerak Melingkar Berubah Beraturan (GMBB)",
    deskripsi:
      "Amati gerak melingkar dengan percepatan sudut konstan sehingga kecepatan sudut berubah terhadap waktu.",
  },
};

function formatPeriode(nilai: number | null): string {
  return nilai === null
    ? "Tidak terdefinisi"
    : `${nilai.toFixed(2)} s`;
}

type SubMenuMelingkar = "gmb" | "gmbb" | "gear";

export default function GerakMelingkarSimulasi() {
  const [subMenu, setSubMenu] = useState<SubMenuMelingkar>("gmb");
  return (
    <>
      <section className="mode-selector panel circular-submenu-selector">
        <div className="mode-selector-heading">
          <div><p className="eyebrow">GERAK ROTASI / PILIH EKSPERIMEN</p><h2>Gerak Melingkar</h2></div>
          <span className="mode-indicator">{subMenu === "gear" ? "GEAR SYSTEM" : subMenu.toUpperCase()} AKTIF</span>
        </div>
        <div className="mode-tabs circular-mode-cards" role="group" aria-label="Pilihan utama gerak melingkar">
          <button id="circular-tab-gmb" type="button" aria-pressed={subMenu === "gmb"} className={`mode-tab circular-mode-card ${subMenu === "gmb" ? "active" : ""}`} onClick={() => setSubMenu("gmb")}>
            <span className="mode-tab-code">01</span>
            <span className="mode-tab-content"><strong>GMB</strong><small>Kecepatan sudut konstan</small></span>
            <span className="circular-card-mark" aria-hidden="true">↗</span>
          </button>
          <button id="circular-tab-gmbb" type="button" aria-pressed={subMenu === "gmbb"} className={`mode-tab circular-mode-card ${subMenu === "gmbb" ? "active" : ""}`} onClick={() => setSubMenu("gmbb")}>
            <span className="mode-tab-code">02</span>
            <span className="mode-tab-content"><strong>GMBB</strong><small>Percepatan sudut konstan</small></span>
            <span className="circular-card-mark" aria-hidden="true">↗</span>
          </button>
          <button id="circular-tab-gear" type="button" aria-pressed={subMenu === "gear"} className={`mode-tab circular-mode-card ${subMenu === "gear" ? "active" : ""}`} onClick={() => setSubMenu("gear")}>
            <span className="mode-tab-code">03</span>
            <span className="mode-tab-content"><strong>Gear System</strong><small>Hubungan tiga roda & transmisi</small></span>
            <span className="circular-card-mark" aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
      {subMenu === "gear" ? <RodaRodaSimulasi /> : <GerakMelingkarKonten key={subMenu} modeAwal={subMenu} />}
    </>
  );
}

function GerakMelingkarKonten({ modeAwal }: { modeAwal: Exclude<SubMenuMelingkar, "gear"> }) {
  const [parameter, setParameter] =
    useState<ParameterGerakMelingkar>(
      { ...PARAMETER_AWAL_GERAK_MELINGKAR, mode: modeAwal }
    );

  const [tampilkanVektor, setTampilkanVektor] =
    useState(true);

  const playback = usePlayback(parameter.durasi);
  const scaleMode = useKinematicsScaleMode();

  const mode = parameter.mode;
  const informasi = INFORMASI[mode];

  // Menghasilkan sampel data untuk grafik.
  const sampel = useMemo(() => {
    const jumlah = 121;

    return Array.from({ length: jumlah }, (_, indeks) => {
      const waktu =
        (parameter.durasi * indeks) / (jumlah - 1);

      return hitungKeadaanGerakMelingkar(parameter, waktu);
    });
  }, [parameter]);

  // Keadaan benda pada waktu simulasi saat ini.
  const keadaanSaatIni = useMemo(
    () =>
      hitungKeadaanGerakMelingkar(
        parameter,
        (playback.tanpaBatas ? playback.waktu % Math.max(parameter.durasi, 0.01) : playback.waktu)
      ),
    [parameter, playback.tanpaBatas, playback.waktu]
  );

  // Data grafik gerak melingkar.
  const grafik = [
    {
      judul: "Posisi sudut terhadap waktu",
      label: "θ (derajat)",
      nilai: sampel.map((keadaan) => keadaan.sudutDerajat),
      warna: "#55e0c1",
    },
    {
      judul: "Kecepatan sudut terhadap waktu",
      label: "ω (rad/s)",
      nilai: sampel.map(
        (keadaan) => keadaan.kecepatanSudut
      ),
      warna: "#8ea7ff",
    },
    {
      judul: "Percepatan sentripetal terhadap waktu",
      label: "a꜀ (m/s²)",
      nilai: sampel.map(
        (keadaan) => keadaan.percepatanSentripetal
      ),
      warna: "#f6bd60",
    },
    ...(mode === "gmbb"
      ? [
          {
            judul: "Percepatan sudut terhadap waktu",
            label: "α (rad/s²)",
            nilai: sampel.map(
              (keadaan) => keadaan.percepatanSudut
            ),
            warna: "#f28e8e",
          },
        ]
      : []),
  ];

  // Mengatur perubahan parameter.
  const ubahParameter = <
    K extends keyof ParameterGerakMelingkar
  >(
    kunci: K,
    nilai: ParameterGerakMelingkar[K]
  ) => {
    setParameter((sebelumnya) => ({
      ...sebelumnya,
      [kunci]: nilai,
    }));

    // The current clock is retained; motion is recalculated with the new values.
  };

  // Mengembalikan parameter ke keadaan awal.
  const kembalikanAwal = () => {
    setParameter(PARAMETER_AWAL_GERAK_MELINGKAR);
    setTampilkanVektor(true);

    playback.setBerjalan(false);
    playback.setPengaliKecepatan(1);
    playback.aturUlang();
  };

  // Mengekspor data simulasi ke CSV.
  const eksporData = () => {
    const baris = [
      [
        "Waktu (s)",
        "Sudut (rad)",
        "Sudut (derajat)",
        "Kecepatan sudut (rad/s)",
        "Percepatan sudut (rad/s²)",
        "Kecepatan tangensial (m/s)",
        "Percepatan sentripetal (m/s²)",
        "Percepatan tangensial (m/s²)",
      ],
      ...sampel.map((keadaan) => [
        keadaan.waktu.toFixed(5),
        keadaan.sudut.toFixed(6),
        keadaan.sudutDerajat.toFixed(5),
        keadaan.kecepatanSudut.toFixed(6),
        keadaan.percepatanSudut.toFixed(6),
        keadaan.kecepatanTangensial.toFixed(6),
        keadaan.percepatanSentripetal.toFixed(6),
        keadaan.percepatanTangensial.toFixed(6),
      ]),
    ];

    const csv = baris
      .map((kolom) => kolom.join(","))
      .join("\n");

    const berkas = new Blob(
      ["\uFEFF", csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const alamat = URL.createObjectURL(berkas);
    const tautan = document.createElement("a");

    tautan.href = alamat;
    tautan.download = `data-${mode}-physlab.csv`;
    tautan.click();

    URL.revokeObjectURL(alamat);
  };

  return (
    <>
      {/* =====================================
          JUDUL HALAMAN
      ====================================== */}

      <section className="page-heading">
        <p className="eyebrow">
          SIMULASI FISIKA / KINEMATIKA / GERAK MELINGKAR
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
            label="Jari-jari lintasan (R)"
            value={parameter.jariJari}
            min={0.5}
            max={10}
            step={0.5}
            unit="m"
            onChange={(nilai) =>
              ubahParameter("jariJari", nilai)
            }
          />

          <ParameterSlider
            label="Sudut awal (θ₀)"
            value={parameter.sudutAwalDerajat}
            min={0}
            max={360}
            step={5}
            unit="°"
            onChange={(nilai) =>
              ubahParameter("sudutAwalDerajat", nilai)
            }
          />

          <ParameterSlider
            label="Kecepatan sudut awal (ω₀)"
            value={parameter.kecepatanSudutAwal}
            min={-10}
            max={10}
            step={0.1}
            unit="rad/s"
            onChange={(nilai) =>
              ubahParameter("kecepatanSudutAwal", nilai)
            }
          />

          {mode === "gmbb" && (
            <ParameterSlider
              label="Percepatan sudut (α)"
              value={parameter.percepatanSudut}
              min={-3}
              max={3}
              step={0.1}
              unit="rad/s²"
              onChange={(nilai) =>
                ubahParameter("percepatanSudut", nilai)
              }
            />
          )}

          <ParameterSlider
            label="Durasi pengamatan"
            value={parameter.durasi}
            min={2}
            max={30}
            step={1}
            unit="s"
            onChange={(nilai) =>
              ubahParameter("durasi", nilai)
            }
          />

          <div className="control-divider" />

          <div className="control-note">
            <span className="note-icon" aria-hidden="true">
              ⓘ
            </span>

            <p>
              {mode === "gmb"
                ? "GMB memiliki kecepatan sudut tetap dan percepatan sudut nol. Percepatan sentripetal selalu menuju pusat lingkaran."
                : "GMBB memiliki percepatan sudut konstan. Kecepatan sudut berubah terhadap waktu sehingga periode tidak tetap. Nilai yang ditampilkan adalah periode sesaat."}
              {" "}
              Tanda positif ω menunjukkan putaran berlawanan arah jarum jam.
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
                  Benda bergerak pada lintasan berjari-jari{" "}
                  {parameter.jariJari.toFixed(1)} m.
                  Arah percepatan sentripetal selalu menuju
                  pusat lingkaran.
                </p>
              </div>

              <span className="model-badge">
                <span /> MODEL IDEAL
              </span>
            </div>

            <VisualisasiGerakMelingkar
              parameter={parameter}
              waktu={playback.tanpaBatas
                ? playback.waktu % Math.max(parameter.durasi, 0.01)
                : playback.waktu}
              tampilkanVektor={tampilkanVektor}
              scaleMode={scaleMode}
            />

            <KontrolWaktuSimulasi
              waktu={playback.waktu}
              durasi={parameter.durasi}
              berjalan={playback.berjalan}
              pengaliKecepatan={playback.pengaliKecepatan}
              tanpaBatas={playback.tanpaBatas}
              onUbahModeWaktu={playback.setTanpaBatas}
              tampilkanPengalihVektor
              vektorAktif={tampilkanVektor}
              onUbahWaktu={(waktu) => {
                playback.setBerjalan(false);
                playback.aturWaktu(waktu);
              }}
              onMulaiJeda={playback.mulaiJeda}
              onAturUlang={playback.aturUlang}
              onUbahKecepatan={playback.setPengaliKecepatan}
              onUbahVektor={setTampilkanVektor}
            />
          </section>

          {/* BESARAN FISIKA */}

          <section className="metrics-grid">
            <KartuBesaran
              label="Kecepatan sudut (ω)"
              value={`${keadaanSaatIni.kecepatanSudut.toFixed(2)} rad/s`}
              ikon="⟳"
              aksen="mint"
            />

            <KartuBesaran
              label="Jari-jari lintasan (R)"
              value={`${parameter.jariJari.toFixed(2)} m`}
              ikon="◯"
              aksen="blue"
            />

            <KartuBesaran
              label={
                mode === "gmb"
                  ? "Periode (T)"
                  : "Periode sesaat (T*)"
              }
              value={formatPeriode(
                keadaanSaatIni.periodeSesaat
              )}
              ikon="◷"
              aksen="amber"
            />

            <KartuBesaran
              label="Percepatan sentripetal (a꜀)"
              value={`${keadaanSaatIni.percepatanSentripetal.toFixed(2)} m/s²`}
              ikon="⊙"
              aksen="mint"
            />

            <KartuBesaran
              label="Kecepatan tangensial (v)"
              value={`${keadaanSaatIni.kecepatanTangensial.toFixed(2)} m/s`}
              ikon="↗"
              aksen="blue"
            />

            <KartuBesaran
              label="Percepatan tangensial (aₜ)"
              value={`${keadaanSaatIni.percepatanTangensial.toFixed(2)} m/s²`}
              ikon="⌁"
              aksen="amber"
            />
          </section>

          {mode === "gmbb" && (
            <p className="info-besaran">
              Catatan: GMBB tidak memiliki periode konstan.
              Nilai T* = 2π/|ω(t)| adalah periode sesaat
              berdasarkan kecepatan sudut pada waktu
              pengamatan.
            </p>
          )}
        </div>
      </section>

      {/* =====================================
          PERSAMAAN GERAK MELINGKAR
      ====================================== */}

      <ModelMatematika
        deskripsi={mode === "gmb"
          ? "Gerak pada lintasan melingkar dengan kecepatan sudut konstan dan percepatan sudut nol."
          : "Gerak melingkar dengan percepatan sudut konstan; kecepatan sudut berubah secara linear terhadap waktu."}
        persamaan={mode === "gmb"
          ? [
              { judul: "Posisi sudut", latex: String.raw`\theta(t)=\theta_0+\omega t` },
              { judul: "Kecepatan sudut", latex: String.raw`\omega=\frac{\Delta\theta}{\Delta t}` },
              { judul: "Kecepatan tangensial", latex: String.raw`v=|\omega|r` },
              { judul: "Periode", latex: String.raw`T=\frac{2\pi}{|\omega|}` },
              { judul: "Frekuensi", latex: String.raw`f=\frac{1}{T}=\frac{|\omega|}{2\pi}` },
              { judul: "Percepatan sentripetal", latex: String.raw`a_s=\frac{v^2}{r}=\omega^2r` },
            ]
          : [
              { judul: "Posisi sudut", latex: String.raw`\theta(t)=\theta_0+\omega_0t+\frac{1}{2}\alpha t^2` },
              { judul: "Kecepatan sudut", latex: String.raw`\omega(t)=\omega_0+\alpha t` },
              { judul: "Percepatan sudut", latex: String.raw`\alpha=\frac{\Delta\omega}{\Delta t}` },
              { judul: "Hubungan tanpa waktu", latex: String.raw`\omega^2=\omega_0^2+2\alpha(\theta-\theta_0)` },
              { judul: "Kecepatan tangensial", latex: String.raw`v(t)=|\omega(t)|r` },
              { judul: "Percepatan tangensial", latex: String.raw`a_t=|\alpha|r` },
              { judul: "Percepatan sentripetal", latex: String.raw`a_s(t)=\omega(t)^2r` },
              { judul: "Periode sesaat", latex: String.raw`T_{\text{sesaat}}=\frac{2\pi}{|\omega(t)|}` },
            ]}
        variabel={[
          { simbol: String.raw`\theta(t)`, nama: "Posisi sudut pada waktu t", satuan: "rad" },
          { simbol: String.raw`\theta_0`, nama: "Posisi sudut awal (dikonversi dari input derajat)", satuan: "rad" },
          ...(mode === "gmb"
            ? [{ simbol: String.raw`\omega`, nama: "Kecepatan sudut konstan", satuan: "rad/s" }]
            : [
                { simbol: String.raw`\omega_0`, nama: "Kecepatan sudut awal", satuan: "rad/s" },
                { simbol: String.raw`\alpha`, nama: "Percepatan sudut konstan", satuan: "rad/s²" },
                { simbol: String.raw`\omega(t)`, nama: "Kecepatan sudut pada waktu t", satuan: "rad/s" },
              ]),
          { simbol: String.raw`r`, nama: "Jari-jari lintasan", satuan: "m" },
          ...(mode === "gmb"
            ? [{ simbol: String.raw`\Delta\theta`, nama: "Perpindahan sudut", satuan: "rad" }]
            : [{ simbol: String.raw`\Delta\omega`, nama: "Perubahan kecepatan sudut", satuan: "rad/s" }]),
          { simbol: String.raw`\Delta t`, nama: "Selang waktu", satuan: "s" },
          { simbol: String.raw`v`, nama: "Kelajuan tangensial", satuan: "m/s" },
          { simbol: String.raw`a_s`, nama: "Percepatan sentripetal menuju pusat", satuan: "m/s²" },
          ...(mode === "gmbb"
            ? [{ simbol: String.raw`a_t`, nama: "Percepatan tangensial sepanjang lintasan", satuan: "m/s²" }]
            : []),
          { simbol: String.raw`t`, nama: "Waktu", satuan: "s" },
          ...(mode === "gmb"
            ? [
                { simbol: String.raw`T`, nama: "Periode satu putaran", satuan: "s" },
                { simbol: String.raw`f`, nama: "Frekuensi putaran", satuan: "Hz" },
              ]
            : []),
        ]}
        catatan={mode === "gmb"
          ? "Pada GMB, percepatan sudut α = 0 dan nilai ω tetap. Tanda ω menunjukkan arah putaran, sedangkan kelajuan tangensial memakai |ω|. Jika ω = 0, periode dan frekuensi tidak terdefinisi."
          : "Percepatan tangensial mengubah besar kelajuan sepanjang lintasan. Percepatan sentripetal mengubah arah kecepatan dan selalu menuju pusat lingkaran. Periode sesaat tidak konstan; ketika ω(t) = 0, periode sesaat tidak terdefinisi."}
      />

      {/* =====================================
          ANALISIS DAN GRAFIK
      ====================================== */}

      <section className="analysis-section">
        <div className="analysis-heading">
          <div>
            <p className="eyebrow">
              ANALISIS GERAK ROTASI
            </p>

            <h2>Grafik besaran sudut</h2>

            <p className="section-description">
              Perhatikan hubungan sudut, kecepatan sudut,
              dan percepatan terhadap waktu.
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
              yLabel={item.label}
              values={item.nilai}
              color={item.warna}
            />
          ))}
        </div>
      </section>
    </>
  );
}
