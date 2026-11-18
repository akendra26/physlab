import { useMemo, useState } from "react";
import { DockableControlPanel, useKinematicsScaleMode } from "../../../components/simulasi/SimulationExperience";
import GrafikMini from "../../../components/simulasi/GrafikMini";
import KartuBesaran from "../../../components/simulasi/KartuBesaran";
import KontrolWaktuSimulasi from "../../../components/simulasi/KontrolWaktuSimulasi";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import ModelMatematika from "../../../components/simulasi/ModelMatematika";
import usePlayback from "../usePlayback";
import VisualisasiGerakVertikal from "./VisualisasiGerakVertikal";
import {
  hitungKeadaanGerakVertikal,
  hitungMetrikGerakVertikal,
  PARAMETER_AWAL_GERAK_VERTIKAL,
  type ArahGerakVertikal,
  type ParameterGerakVertikal,
} from "./mesinGerakVertikal";

export default function GerakVertikalSimulasi() {
  const [parameter, setParameter] = useState<ParameterGerakVertikal>(PARAMETER_AWAL_GERAK_VERTIKAL);
  const scaleMode = useKinematicsScaleMode();
  const [tampilkanVektor, setTampilkanVektor] = useState(true);
  const metrik = useMemo(() => hitungMetrikGerakVertikal(parameter), [parameter]);
  const playback = usePlayback(metrik.waktuTempuh);

  const sampel = useMemo(() => {
    const jumlah = 101;
    return Array.from({ length: jumlah }, (_, indeks) => {
      const waktu = (metrik.waktuTempuh * indeks) / (jumlah - 1);
      return hitungKeadaanGerakVertikal(parameter, waktu);
    });
  }, [metrik.waktuTempuh, parameter]);

  const grafik = [
    {
      judul: "Ketinggian terhadap waktu",
      label: "y (m)",
      nilai: sampel.map((keadaan) => keadaan.posisi),
      warna: "#55e0c1",
    },
    {
      judul: "Kecepatan vertikal terhadap waktu",
      label: "vᵧ (m/s)",
      nilai: sampel.map((keadaan) => keadaan.kecepatan),
      warna: "#8ea7ff",
    },
    {
      judul: "Percepatan vertikal terhadap waktu",
      label: "aᵧ (m/s²)",
      nilai: sampel.map((keadaan) => keadaan.percepatan),
      warna: "#f6bd60",
    },
  ];

  const ubahParameter = <K extends keyof ParameterGerakVertikal>(
    kunci: K,
    nilai: ParameterGerakVertikal[K],
  ) => {
    setParameter((sebelumnya) => ({ ...sebelumnya, [kunci]: nilai }));
    // Keep t unchanged so the live physical state follows the edited parameter.
  };

  const ubahArah = (arah: ArahGerakVertikal) => {
    ubahParameter("arah", arah);
  };

  const kembalikanAwal = () => {
    setParameter(PARAMETER_AWAL_GERAK_VERTIKAL);
    setTampilkanVektor(true);
    playback.setPengaliKecepatan(1);
    playback.aturUlang();
  };

  const eksporData = () => {
    const baris = [
      ["Waktu (s)", "Ketinggian (m)", "Kecepatan vertikal (m/s)", "Percepatan vertikal (m/s²)"],
      ...sampel.map((keadaan) => [
        keadaan.waktu.toFixed(5),
        keadaan.posisi.toFixed(6),
        keadaan.kecepatan.toFixed(6),
        keadaan.percepatan.toFixed(6),
      ]),
    ];
    const csv = baris.map((kolom) => kolom.join(",")).join("\n");
    const berkas = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const alamat = URL.createObjectURL(berkas);
    const tautan = document.createElement("a");
    tautan.href = alamat;
    tautan.download = `data-gerak-vertikal-${parameter.arah}-physlab.csv`;
    tautan.click();
    URL.revokeObjectURL(alamat);
  };

  const waktuSaatIni = playback.waktu;
  const keadaanSaatIni = hitungKeadaanGerakVertikal(parameter, waktuSaatIni);

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">SIMULASI FISIKA / KINEMATIKA / GERAK VERTIKAL</p>
        <div className="page-title-row">
          <div>
            <h1>Gerak Vertikal</h1>
            <p className="page-description">
              Pelajari gerak benda pada sumbu vertikal dengan percepatan gravitasi konstan hingga menyentuh tanah.
            </p>
          </div>
          <span className="module-status"><span /> MODUL AKTIF</span>
        </div>
      </section>

      <section className="workspace">
        <DockableControlPanel><aside className="control-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PENGATURAN EKSPERIMEN</p>
              <h2>Parameter gerak</h2>
            </div>
            <span className="settings-icon" aria-hidden="true">☷</span>
          </div>

          <div className="parameter-control">
            <span className="parameter-label">Mode gerak vertikal</span>
            <div className="pilihan-mode vertical-mode-options" role="group" aria-label="Pilih mode gerak vertikal">
              <button
                type="button"
                className={parameter.arah === "jatuh-bebas" ? "pilihan-mode-aktif" : ""}
                aria-pressed={parameter.arah === "jatuh-bebas"}
                onClick={() => ubahArah("jatuh-bebas")}
              >
                ↓ Jatuh bebas (v₀ = 0)
              </button>
              <button
                type="button"
                className={parameter.arah === "atas" ? "pilihan-mode-aktif" : ""}
                aria-pressed={parameter.arah === "atas"}
                onClick={() => ubahArah("atas")}
              >
                ↑ Ke atas
              </button>
              <button
                type="button"
                className={parameter.arah === "bawah" ? "pilihan-mode-aktif" : ""}
                aria-pressed={parameter.arah === "bawah"}
                onClick={() => ubahArah("bawah")}
              >
                ↓ Ke bawah
              </button>
            </div>
          </div>

          <ParameterSlider
            label="Ketinggian awal (h₀)"
            value={parameter.tinggiAwal}
            min={1} max={100} step={1} unit="m"
            onChange={(nilai) => ubahParameter("tinggiAwal", nilai)}
          />
          <ParameterSlider
            label={parameter.arah === "jatuh-bebas" ? "Kecepatan awal (dikunci 0)" : "Besar kecepatan awal (v₀)"}
            value={parameter.arah === "jatuh-bebas" ? 0 : parameter.kecepatanAwal}
            min={0} max={40} step={0.5} unit="m/s"
            disabled={parameter.arah === "jatuh-bebas"}
            onChange={(nilai) => ubahParameter("kecepatanAwal", nilai)}
          />
          <ParameterSlider
            label="Percepatan gravitasi (g)"
            value={parameter.gravitasi}
            min={1} max={20} step={0.01} unit="m/s²"
            onChange={(nilai) => ubahParameter("gravitasi", nilai)}
          />

          <div className="control-divider" />
          <div className="control-note">
            <span className="note-icon" aria-hidden="true">ⓘ</span>
            <p>
              Sumbu positif mengarah ke atas. Gravitasi selalu mengarah ke bawah. Hambatan udara diabaikan.
              {parameter.arah === "atas"
                ? " Benda mula-mula bergerak naik, berhenti sesaat di puncak, lalu turun."
                : parameter.arah === "jatuh-bebas"
                  ? " Benda dilepas tanpa kecepatan awal (v₀ = 0), lalu jatuh karena gravitasi."
                  : " Benda langsung bergerak turun dengan kecepatan awal ke bawah."}
            </p>
          </div>
          <button className="secondary-button full-width" type="button" onClick={kembalikanAwal}>
            <span aria-hidden="true">↺</span> Kembalikan parameter awal
          </button>
        </aside></DockableControlPanel>

        <div className="main-column">
          <section className="simulation-panel panel">
            <div className="simulation-header">
              <div>
                <p className="eyebrow">VISUALISASI LANGSUNG</p>
                <h2>{parameter.arah === "jatuh-bebas" ? "Gerak jatuh bebas · v₀ = 0" : parameter.arah === "atas" ? "Lemparan vertikal ke atas" : "Gerak vertikal ke bawah"}</h2>
                <p className="section-description">
                  {parameter.arah === "atas"
                    ? `Benda mencapai titik tertinggi setelah ${metrik.waktuPuncak.toFixed(2)} s.`
                    : parameter.arah === "jatuh-bebas"
                      ? "Benda dilepas dari keadaan diam dan kecepatannya bertambah akibat gravitasi."
                      : "Benda bergerak ke bawah tanpa melalui fase naik."}
                </p>
              </div>
              <span className="model-badge"><span /> MODEL IDEAL</span>
            </div>

            <VisualisasiGerakVertikal
              parameter={parameter}
              waktu={waktuSaatIni}
              tampilkanVektor={tampilkanVektor}
              scaleMode={scaleMode}
            />

            <KontrolWaktuSimulasi
              waktu={playback.waktu}
              durasi={metrik.waktuTempuh}
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

          <section className="metrics-grid">
            <KartuBesaran
              label="Tinggi maksimum"
              value={`${metrik.tinggiMaksimum.toFixed(2)} m`}
              ikon="↥"
              aksen="mint"
            />
            <KartuBesaran
              label="Waktu mencapai puncak"
              value={parameter.arah === "atas" ? `${metrik.waktuPuncak.toFixed(2)} s` : "Tidak ada"}
              ikon="⌃"
              aksen="blue"
            />
            <KartuBesaran
              label="Waktu hingga menyentuh tanah"
              value={`${metrik.waktuTempuh.toFixed(2)} s`}
              ikon="◷"
              aksen="amber"
            />
          </section>
          <p className="info-besaran">
            Kecepatan saat menyentuh tanah: <strong>{metrik.kecepatanSaatMenyentuhTanah.toFixed(2)} m/s</strong>
            <span> · Kecepatan benda saat ini: <strong>{keadaanSaatIni.kecepatan.toFixed(2)} m/s</strong></span>
          </p>
        </div>
      </section>

      <ModelMatematika
        deskripsi={parameter.arah === "atas"
          ? "Sumbu vertikal positif ke atas. Benda mula-mula bergerak naik dengan kecepatan awal positif, lalu turun akibat gravitasi."
          : parameter.arah === "jatuh-bebas"
            ? "Gerak jatuh bebas dimulai dari keadaan diam (v₀ = 0). Sumbu vertikal positif ke atas dan gravitasi bertanda negatif."
            : "Sumbu vertikal tetap positif ke atas. Benda bergerak turun sejak awal sehingga kecepatan awal bertanda negatif."}
        persamaan={[
          { judul: "Posisi terhadap waktu", latex: String.raw`y(t)=h_0+v_0^*t-\frac{1}{2}gt^2` },
          { judul: "Kecepatan terhadap waktu", latex: String.raw`v_y(t)=v_0^*-gt` },
          { judul: "Percepatan gravitasi", latex: String.raw`a_y=-g` },
          { judul: "Waktu hingga menyentuh tanah", latex: String.raw`t_{\text{tanah}}=\frac{v_0^*+\sqrt{(v_0^*)^2+2gh_0}}{g}` },
          ...(parameter.arah === "atas"
            ? [
                { judul: "Syarat titik tertinggi", latex: String.raw`v_y(t_{\text{maks}})=0` },
                { judul: "Waktu mencapai titik tertinggi", latex: String.raw`t_{\text{maks}}=\frac{v_0}{g}` },
                { judul: "Kenaikan maksimum dari posisi awal", latex: String.raw`\Delta h_{\text{maks}}=\frac{v_0^2}{2g}` },
                { judul: "Ketinggian maksimum dari tanah", latex: String.raw`h_{\text{maks}}=h_0+\frac{v_0^2}{2g}` },
              ]
            : []),
        ]}
        variabel={[
          { simbol: String.raw`y(t)`, nama: "Ketinggian pada waktu t", satuan: "m" },
          { simbol: String.raw`v_y(t)`, nama: "Kecepatan vertikal pada waktu t", satuan: "m/s" },
          { simbol: String.raw`a_y`, nama: "Percepatan vertikal", satuan: "m/s²" },
          { simbol: String.raw`h_0`, nama: "Ketinggian awal", satuan: "m" },
          { simbol: String.raw`v_0`, nama: "Besar kecepatan awal", satuan: "m/s" },
          { simbol: String.raw`v_0^*`, nama: "Kecepatan awal bertanda", satuan: "m/s", deskripsi: parameter.arah === "atas" ? "+v₀ untuk gerak ke atas" : parameter.arah === "jatuh-bebas" ? "0 m/s untuk jatuh bebas" : "−v₀ untuk gerak ke bawah" },
          { simbol: String.raw`g`, nama: "Besar percepatan gravitasi", satuan: "m/s²" },
          { simbol: String.raw`t`, nama: "Waktu sejak benda dilepas", satuan: "s" },
          { simbol: String.raw`t_{\text{tanah}}`, nama: "Waktu hingga menyentuh tanah", satuan: "s" },
          ...(parameter.arah === "atas"
            ? [
                { simbol: String.raw`t_{\text{maks}}`, nama: "Waktu mencapai titik tertinggi", satuan: "s" },
                { simbol: String.raw`\Delta h_{\text{maks}}`, nama: "Kenaikan maksimum dari posisi awal", satuan: "m" },
                { simbol: String.raw`h_{\text{maks}}`, nama: "Ketinggian maksimum dari tanah", satuan: "m" },
              ]
            : []),
        ]}
        catatan={<>Hambatan udara diabaikan dan gravitasi dianggap konstan. Mesin simulasi menggunakan <code>v₀* = 0</code> untuk jatuh bebas, <code>v₀* = +v₀</code> untuk lemparan ke atas, dan <code>v₀* = −v₀</code> untuk gerak ke bawah. Setelah benda menyentuh tanah, model menetapkan posisi, kecepatan, dan percepatan menjadi nol.</>}
      />

      <section className="analysis-section">
        <div className="analysis-heading">
          <div>
            <p className="eyebrow">ANALISIS GERAK</p>
            <h2>Grafik besaran fisika</h2>
            <p className="section-description">Grafik menunjukkan perubahan ketinggian, kecepatan, dan percepatan terhadap waktu.</p>
          </div>
          <button className="secondary-button" type="button" onClick={eksporData}>↓ Ekspor data CSV</button>
        </div>
        <div className="graphs-grid">
          {grafik.map((item) => (
            <GrafikMini key={item.judul} title={item.judul} yLabel={item.label} values={item.nilai} color={item.warna} />
          ))}
        </div>
      </section>
    </>
  );
}
