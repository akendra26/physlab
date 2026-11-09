import { useMemo, useState } from "react";
import GrafikMini from "../../../components/simulasi/GrafikMini";
import KartuBesaran from "../../../components/simulasi/KartuBesaran";
import KontrolWaktuSimulasi from "../../../components/simulasi/KontrolWaktuSimulasi";
import ParameterSlider from "../../../components/simulasi/ParameterSlider";
import RotaryDial from "../../../components/simulasi/RotaryDial";
import ModelMatematika from "../../../components/simulasi/ModelMatematika";
import usePlayback from "../usePlayback";
import VisualisasiGerakDuaDimensi from "./VisualisasiGerakDuaDimensi";
import VisualisasiPenerjunPayung from "./VisualisasiPenerjunPayung";
import { hitungKeadaanPenerjun, hitungMetrikPenerjun } from "./mesinPenerjunPayung";
import {
  hitungKeadaanGerak,
  hitungMetrikGerak,
  PARAMETER_AWAL_DUA_DIMENSI,
  type ModeGerakDuaDimensi,
  type ParameterGerakDuaDimensi,
  type MetrikGerak,
} from "./mesinGerakDuaDimensi";

type Props = { mode: ModeGerakDuaDimensi };

type Grafik = {
  judul: string;
  labelSumbu: string;
  nilai: number[];
  warna: string;
};

const INFORMASI: Record<ModeGerakDuaDimensi, { judul: string; deskripsi: string }> = {
  freefall: {
    judul: "Gerak Jatuh & Penerjun Payung",
    deskripsi: "Amati gerak vertikal dengan gravitasi, hambatan udara, dan perubahan kecepatan terminal saat parasut terbuka.",
  },
  projectile: {
    judul: "Gerak Parabola",
    deskripsi: "Amati lintasan dua dimensi benda yang dilontarkan dengan kecepatan dan sudut tertentu.",
  },
};

export default function GerakDuaDimensiSimulasi({ mode }: Props) {
  const parameterAwal = mode === "freefall"
    ? { ...PARAMETER_AWAL_DUA_DIMENSI, initialHeight: 10 }
    : PARAMETER_AWAL_DUA_DIMENSI;
  const [parameter, setParameter] = useState<ParameterGerakDuaDimensi>(parameterAwal);
  const [vektorAktif, setVektorAktif] = useState(mode === "projectile");
  const metrikPenerjun = useMemo(
    () => hitungMetrikPenerjun(parameter.initialHeight, parameter.gravity),
    [parameter.gravity, parameter.initialHeight],
  );
  const metrik: MetrikGerak = useMemo(() => {
    if (mode === "freefall") {
      return {
        duration: metrikPenerjun.waktuJatuh,
        range: 0,
        maxHeight: parameter.initialHeight,
        finalSpeed: metrikPenerjun.kecepatanTerminalParasut,
        acceleration: parameter.gravity,
      };
    }
    return hitungMetrikGerak(mode, parameter);
  }, [mode, metrikPenerjun, parameter]);
  const playback = usePlayback(Math.max(metrik.duration, 0.01));
  const informasi = INFORMASI[mode];

  // Sampel lintasan ideal hanya dipakai oleh gerak parabola.
  const sampel = useMemo(() => {
    if (mode === "freefall") return [];
    const jumlahSampel = 121;
    return Array.from({ length: jumlahSampel }, (_, indeks) => {
      const waktu = (metrik.duration * indeks) / (jumlahSampel - 1);
      return hitungKeadaanGerak("projectile", parameter, waktu);
    });
  }, [metrik.duration, mode, parameter]);

  // Data penerjun dihitung dari model drag yang sama dengan visualisasi.
  const sampelPenerjun = useMemo(() => {
    if (mode !== "freefall") return [];
    const jumlahSampel = 121;
    return Array.from({ length: jumlahSampel }, (_, indeks) => {
      const waktu = (metrik.duration * indeks) / (jumlahSampel - 1);
      return {
        ...hitungKeadaanPenerjun(
          parameter.initialHeight,
          parameter.gravity,
          waktu,
        ),
        // Pertahankan cap waktu sampel walau penerjun sudah menyentuh tanah.
        waktu,
      };
    });
  }, [metrik.duration, mode, parameter.gravity, parameter.initialHeight]);

  const grafik: Grafik[] = mode === "freefall"
    ? []
    : [
        { judul: "Posisi horizontal", labelSumbu: "x (m)", nilai: sampel.map((keadaan) => keadaan.x), warna: "#55e0c1" },
        { judul: "Posisi vertikal", labelSumbu: "y (m)", nilai: sampel.map((keadaan) => keadaan.y), warna: "#8ea7ff" },
        { judul: "Kecepatan horizontal", labelSumbu: "vₓ (m/s)", nilai: sampel.map((keadaan) => keadaan.vx), warna: "#f6bd60" },
        { judul: "Kecepatan vertikal", labelSumbu: "vᵧ (m/s)", nilai: sampel.map((keadaan) => keadaan.vy), warna: "#f28e8e" },
      ];

  const ubahParameter = <K extends keyof ParameterGerakDuaDimensi>(
    kunci: K,
    nilai: ParameterGerakDuaDimensi[K],
  ) => {
    setParameter((saatIni) => ({ ...saatIni, [kunci]: nilai }));
    playback.aturUlang();
  };

  const kembalikanAwal = () => {
    setParameter(parameterAwal);
    setVektorAktif(mode === "projectile");
    playback.setPengaliKecepatan(1);
    playback.aturUlang();
  };

  const eksporData = () => {
    const baris = mode === "freefall"
      ? [
          ["Waktu (s)", "Jarak jatuh (m)", "Kecepatan jatuh (m/s)", "Percepatan aktual (m/s²)", "Parasut terbuka"],
          ...sampelPenerjun.map((keadaan) => [
            keadaan.waktu.toFixed(5),
            keadaan.jarak.toFixed(6),
            keadaan.kecepatan.toFixed(6),
            keadaan.percepatan.toFixed(6),
            keadaan.parasutTerbuka ? "ya" : "tidak",
          ]),
        ]
      : [
          ["Waktu (s)", "Posisi X (m)", "Posisi Y (m)", "Kecepatan X (m/s)", "Kecepatan Y (m/s)", "Percepatan X (m/s²)", "Percepatan Y (m/s²)"],
          ...sampel.map((keadaan) => [
            keadaan.t.toFixed(5), keadaan.x.toFixed(6), keadaan.y.toFixed(6),
            keadaan.vx.toFixed(6), keadaan.vy.toFixed(6), keadaan.ax.toFixed(6), keadaan.ay.toFixed(6),
          ]),
        ];
    const isiCsv = baris.map((kolom) => kolom.join(",")).join("\n");
    const berkas = new Blob(["\uFEFF", isiCsv], { type: "text/csv;charset=utf-8;" });
    const alamat = URL.createObjectURL(berkas);
    const tautan = document.createElement("a");
    tautan.href = alamat;
    tautan.download = `data-${mode === "freefall" ? "gjb" : "parabola"}-physlab.csv`;
    tautan.click();
    URL.revokeObjectURL(alamat);
  };

  const persamaanModel = mode === "freefall"
    ? [
        { judul: "Gaya hambat udara kuadratik", latex: String.raw`F_d=\frac{1}{2}\rho C_d A v^2` },
        { judul: "Persamaan gerak vertikal (arah bawah positif)", latex: String.raw`m\frac{dv}{dt}=mg-\frac{1}{2}\rho C_d A v^2` },
        { judul: "Kecepatan terminal tubuh", latex: String.raw`v_{t,\text{tubuh}}=\sqrt{\frac{2mg}{\rho C_{d,t}A_t}}` },
        { judul: "Kecepatan terminal setelah parasut terbuka", latex: String.raw`v_{t,\text{parasut}}=\sqrt{\frac{2mg}{\rho C_{d,p}A_p}}` },
        { judul: "Gaya resultan selama jatuh", latex: String.raw`\sum F=mg-F_d=ma` },
        { judul: "Syarat kecepatan terminal", latex: String.raw`mg=F_d\quad\Rightarrow\quad a=0` },
      ]
    : [
        { judul: "Komponen kecepatan awal horizontal", latex: String.raw`v_{0x}=v_0\cos\theta` },
        { judul: "Komponen kecepatan awal vertikal", latex: String.raw`v_{0y}=v_0\sin\theta` },
        { judul: "Posisi horizontal", latex: String.raw`x(t)=v_0\cos\theta\,t` },
        { judul: "Posisi vertikal", latex: String.raw`y(t)=h_0+v_0\sin\theta\,t-\frac{1}{2}gt^2` },
        { judul: "Kecepatan horizontal", latex: String.raw`v_x(t)=v_0\cos\theta` },
        { judul: "Kecepatan vertikal", latex: String.raw`v_y(t)=v_0\sin\theta-gt` },
        { judul: "Vektor kecepatan dan turunan posisi", latex: String.raw`\vec{v}(t)=\frac{d\vec{r}}{dt}=v_x(t)\hat{\imath}+v_y(t)\hat{\jmath}` },
        { judul: "Vektor percepatan dan turunan kecepatan", latex: String.raw`\vec{a}(t)=\frac{d\vec{v}}{dt}=-g\hat{\jmath}` },
        { judul: "Waktu mencapai titik tertinggi", latex: String.raw`t_{\text{maks}}=\frac{v_0\sin\theta}{g}` },
        { judul: "Kenaikan maksimum dari titik luncur", latex: String.raw`\Delta H_{\text{maks}}=\frac{v_0^2\sin^2\theta}{2g}` },
        { judul: "Ketinggian maksimum dari tanah", latex: String.raw`H_{\text{maks}}=h_0+\frac{v_0^2\sin^2\theta}{2g}` },
        { judul: "Perpindahan horizontal hingga permukaan tanah", latex: parameter.initialHeight === 0
          ? String.raw`\Delta x=\frac{v_0^2\sin(2\theta)}{g}`
          : String.raw`\Delta x=\frac{v_0\cos\theta}{g}\left(v_0\sin\theta+\sqrt{v_0^2\sin^2\theta+2gh_0}\right)` },
        ...(parameter.speed > 0 && Math.abs(Math.cos((parameter.angleDeg * Math.PI) / 180)) > 1e-6
          ? [{ judul: "Persamaan lintasan", latex: String.raw`y-h_0=x\tan\theta-\frac{gx^2}{2v_0^2\cos^2\theta}` }]
          : []),
      ];

  const variabelModel = mode === "freefall"
    ? [
        { simbol: String.raw`m`, nama: "Massa penerjun pada model ilustratif", satuan: "kg" },
        { simbol: String.raw`\rho`, nama: "Massa jenis udara", satuan: "kg/m³" },
        { simbol: String.raw`C_d`, nama: "Koefisien hambat", satuan: "tanpa dimensi" },
        { simbol: String.raw`A`, nama: "Luas penampang efektif", satuan: "m²" },
        { simbol: String.raw`v`, nama: "Kelajuan jatuh ke bawah", satuan: "m/s" },
        { simbol: String.raw`F_d`, nama: "Besar gaya hambat udara", satuan: "N" },
        { simbol: String.raw`g`, nama: "Besar percepatan gravitasi", satuan: "m/s²" },
        { simbol: String.raw`v_t`, nama: "Kecepatan terminal untuk konfigurasi tubuh/parasut", satuan: "m/s" },
        { simbol: String.raw`t`, nama: "Waktu sejak penerjun dilepaskan", satuan: "s" },
      ]
    : [
        { simbol: String.raw`x`, nama: "Posisi horizontal (x₀ = 0 pada mesin)", satuan: "m" },
        { simbol: String.raw`y`, nama: "Ketinggian di atas tanah", satuan: "m" },
        { simbol: String.raw`h_0`, nama: "Ketinggian awal", satuan: "m" },
        { simbol: String.raw`v_0`, nama: "Besar kecepatan awal", satuan: "m/s" },
        { simbol: String.raw`v_{0x}`, nama: "Komponen kecepatan awal horizontal", satuan: "m/s" },
        { simbol: String.raw`v_{0y}`, nama: "Komponen kecepatan awal vertikal", satuan: "m/s" },
        { simbol: String.raw`v_x,\,v_y`, nama: "Komponen kecepatan pada waktu t", satuan: "m/s" },
        { simbol: String.raw`\vec{r}`, nama: "Vektor posisi", satuan: "m" },
        { simbol: String.raw`\vec{v}`, nama: "Vektor kecepatan", satuan: "m/s" },
        { simbol: String.raw`\vec{a}`, nama: "Vektor percepatan", satuan: "m/s²" },
        { simbol: String.raw`\theta`, nama: "Sudut elevasi (input derajat, dihitung dalam radian)", satuan: "rad" },
        { simbol: String.raw`g`, nama: "Besar percepatan gravitasi", satuan: "m/s²" },
        { simbol: String.raw`t`, nama: "Waktu sejak peluncuran", satuan: "s" },
        { simbol: String.raw`\Delta x`, nama: "Perpindahan horizontal sampai tanah (bertanda)", satuan: "m" },
        { simbol: String.raw`t_{\text{maks}}`, nama: "Waktu mencapai titik tertinggi", satuan: "s" },
        { simbol: String.raw`\Delta H_{\text{maks}}`, nama: "Kenaikan maksimum dari titik luncur", satuan: "m" },
        { simbol: String.raw`H_{\text{maks}}`, nama: "Ketinggian maksimum dari tanah", satuan: "m" },
      ];

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">SIMULASI FISIKA / KINEMATIKA / GERAK DUA DIMENSI</p>
        <div className="page-title-row">
          <div>
            <h1>{informasi.judul}</h1>
            <p className="page-description">{informasi.deskripsi}</p>
          </div>
          <span className="module-status"><span /> MODUL AKTIF</span>
        </div>
      </section>

      <section className="workspace">
        <aside className="control-panel panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PENGATURAN EKSPERIMEN</p>
              <h2>Parameter</h2>
            </div>
            <span className="settings-icon" aria-hidden="true">☷</span>
          </div>

          {mode === "freefall" ? (
            <>
              <ParameterSlider
                label="Ketinggian awal"
                value={parameter.initialHeight}
                min={1} max={100} step={1} unit="m"
                onChange={(nilai) => ubahParameter("initialHeight", nilai)}
              />
              <ParameterSlider
                label="Percepatan gravitasi"
                value={parameter.gravity}
                min={1} max={20} step={0.01} unit="m/s²"
                onChange={(nilai) => ubahParameter("gravity", nilai)}
              />
            </>
          ) : (
            <>
              <ParameterSlider
                label="Kecepatan awal"
                value={parameter.speed}
                min={0} max={50} step={0.5} unit="m/s"
                onChange={(nilai) => ubahParameter("speed", nilai)}
              />
              <RotaryDial
                label="Sudut elevasi / arah peluncuran"
                value={parameter.angleDeg}
                min={0}
                max={360}
                step={1}
                onChange={(nilai) => ubahParameter("angleDeg", nilai)}
              />
              <ParameterSlider
                label="Ketinggian awal"
                value={parameter.initialHeight}
                min={0} max={50} step={0.5} unit="m"
                onChange={(nilai) => ubahParameter("initialHeight", nilai)}
              />
              <ParameterSlider
                label="Percepatan gravitasi"
                value={parameter.gravity}
                min={1} max={20} step={0.01} unit="m/s²"
                onChange={(nilai) => ubahParameter("gravity", nilai)}
              />
            </>
          )}

          <div className="control-divider" />
          <div className="control-note">
            <span className="note-icon" aria-hidden="true">ⓘ</span>
            <p>
              {mode === "freefall"
                ? "Penerjun mengalami gravitasi dan hambatan udara kuadratik. Parasut terbuka pada 72% lintasan untuk menurunkan kelajuan terminal."
                : "Model gerak parabola ideal. Hambatan udara diabaikan dan gravitasi dianggap konstan."}
            </p>
          </div>
          <button className="secondary-button full-width" type="button" onClick={kembalikanAwal}>
            <span aria-hidden="true">↺</span> Kembalikan parameter awal
          </button>
        </aside>

        <div className="main-column">
          <section className="simulation-panel panel">
            <div className="simulation-header">
              <div>
                <p className="eyebrow">VISUALISASI LANGSUNG</p>
                <h2>{informasi.judul}</h2>
                <p className="section-description">
                  {mode === "freefall"
                    ? "Animasi penerjun memperlihatkan gravitasi, gaya hambat, pembukaan parasut, dan kelajuan terminal."
                    : "Lintasan benda ditampilkan pada bidang dua dimensi."}
                </p>
              </div>
              <span className="model-badge"><span /> {mode === "freefall" ? "MODEL HAMBATAN UDARA" : "MODEL IDEAL"}</span>
            </div>

            {mode === "freefall" ? (
              <VisualisasiPenerjunPayung
                ketinggianAwal={parameter.initialHeight}
                gravitasi={parameter.gravity}
                waktu={playback.waktu}
              />
            ) : (
              <VisualisasiGerakDuaDimensi
                mode={mode}
                params={parameter}
                time={playback.tanpaBatas ? playback.waktu % Math.max(metrik.duration, 0.01) : Math.min(playback.waktu, metrik.duration)}
                showVectors={vektorAktif}
              />
            )}

            <KontrolWaktuSimulasi
              waktu={playback.waktu}
              durasi={metrik.duration}
              berjalan={playback.berjalan}
              pengaliKecepatan={playback.pengaliKecepatan}
              tanpaBatas={playback.tanpaBatas}
              onUbahModeWaktu={playback.setTanpaBatas}
              tampilkanPengalihVektor={mode === "projectile"}
              vektorAktif={vektorAktif}
              onUbahWaktu={(waktu) => {
                playback.setBerjalan(false);
                playback.aturWaktu(waktu);
              }}
              onMulaiJeda={playback.mulaiJeda}
              onAturUlang={playback.aturUlang}
              onUbahKecepatan={playback.setPengaliKecepatan}
              onUbahVektor={setVektorAktif}
            />
          </section>

          <section className="metrics-grid">
            {mode === "freefall" ? (
              <>
                <KartuBesaran label="Waktu jatuh" value={`${metrik.duration.toFixed(2)} s`} ikon="◷" aksen="mint" />
                <KartuBesaran label="Terminal · tubuh bebas" value={`${metrikPenerjun.kecepatanTerminalTubuh.toFixed(2)} m/s`} ikon="↘" aksen="blue" />
                <KartuBesaran label="Terminal · parasut terbuka" value={`${metrikPenerjun.kecepatanTerminalParasut.toFixed(2)} m/s`} ikon="⇩" aksen="amber" />
              </>
            ) : (
              <>
                <KartuBesaran label="Waktu tempuh" value={`${metrik.duration.toFixed(2)} s`} ikon="◷" aksen="mint" />
                <KartuBesaran label="Perpindahan horizontal" value={`${metrik.range.toFixed(2)} m`} ikon="↔" aksen="blue" />
                <KartuBesaran label="Ketinggian maksimum" value={`${metrik.maxHeight.toFixed(2)} m`} ikon="⌃" aksen="amber" />
              </>
            )}
          </section>
        </div>
      </section>

      <ModelMatematika
        deskripsi={mode === "freefall"
          ? "Penerjun dimodelkan dengan hambatan udara kuadratik. Saat parasut terbuka, luas efektif hambatan meningkat sehingga kelajuan terminal menjadi lebih rendah."
          : "Gerak dua dimensi ideal tanpa hambatan udara. Sumbu x positif ke kanan dan sumbu y positif ke atas; mesin memakai x₀ = 0 dan y₀ = h₀."}
        persamaan={persamaanModel}
        variabel={variabelModel}
        catatan={mode === "freefall"
          ? "Model penerjun memakai integrasi numerik hambatan udara kuadratik, bukan persamaan jatuh bebas vakum. Massa ilustratif 78 kg; koefisien dan luas efektif berubah saat parasut terbuka setelah 72% lintasan. Kecepatan terminal adalah keadaan ketika gaya berat dan hambatan udara seimbang sehingga percepatan mendekati nol."
          : <>{parameter.initialHeight === 0
              ? "Rumus R = v₀² sin(2θ)/g berlaku karena benda mendarat pada ketinggian yang sama dengan titik luncur."
              : "Karena ketinggian awal lebih besar dari permukaan tanah, jangkauan dihitung dengan akar kuadrat pada rumus umum; rumus jangkauan untuk ketinggian sama tidak digunakan."} {parameter.speed === 0 || Math.abs(Math.cos((parameter.angleDeg * Math.PI) / 180)) < 1e-6
              ? "Persamaan lintasan y(x) tidak ditampilkan karena gerak tidak memiliki komponen kecepatan horizontal yang dapat digunakan untuk menyatakan y sebagai fungsi x."
              : "Sudut θ pada fungsi trigonometri dikonversi ke radian oleh mesin simulasi."}</>}
      />

      {mode === "projectile" && (
      <section className="analysis-section">
        <div className="analysis-heading">
          <div>
            <p className="eyebrow">ANALISIS GERAK</p>
            <h2>Grafik besaran fisika</h2>
            <p className="section-description">Bandingkan perubahan besaran gerak sepanjang waktu pengamatan.</p>
          </div>
          <button className="secondary-button" type="button" onClick={eksporData}>↓ Ekspor data CSV</button>
        </div>
        <div className="graphs-grid">
          {grafik.map((item) => (
            <GrafikMini key={item.judul} title={item.judul} yLabel={item.labelSumbu} values={item.nilai} color={item.warna} />
          ))}
        </div>
      </section>
      )}
    </>
  );
}
