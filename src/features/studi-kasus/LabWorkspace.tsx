import { useMemo, useState } from "react";
import KinematikaPage from "../kinematika/KinematikaPage";
import DinamikaPage from "../dinamika/DinamikaPage";
import type { CatatanLab, StudiKasus } from "./dataStudiKasus";
import DioramaStudiKasus from "./DioramaStudiKasus";

type VirtualLabNotebookProps = {
  catatan: CatatanLab;
  onUbah: (perubahan: Partial<CatatanLab>) => void;
};

function VirtualLabNotebook({ catatan, onUbah }: VirtualLabNotebookProps) {
  return (
    <aside className="lab-notebook-panel">
      <div className="lab-panel-heading">
        <div>
          <p className="lab-eyebrow">03 / CATATAN PENELITIAN</p>
          <h2>Buku catatan</h2>
        </div>
        <span className="lab-panel-icon" aria-hidden="true">✎</span>
      </div>
      <label className="lab-notebook-field">
        <span>Hipotesis</span>
        <textarea value={catatan.hipotesis} onChange={(event) => onUbah({ hipotesis: event.target.value })} placeholder="Tuliskan hipotesis dan alasanmu..." />
      </label>
      <label className="lab-notebook-field">
        <span>Data pengamatan</span>
        <textarea value={catatan.dataPengamatan} onChange={(event) => onUbah({ dataPengamatan: event.target.value })} placeholder="Catat hasil eksperimen beserta satuannya..." />
      </label>
      <label className="lab-notebook-field">
        <span>Kesimpulan</span>
        <textarea value={catatan.kesimpulan} onChange={(event) => onUbah({ kesimpulan: event.target.value })} placeholder="Tuliskan kesimpulan berdasarkan data..." />
      </label>
    </aside>
  );
}

type Props = {
  kasus: StudiKasus;
  catatan: CatatanLab;
  rewardSudahDiklaim: boolean;
  onKembali: () => void;
  onUbahCatatan: (perubahan: Partial<CatatanLab>) => void;
  onTandaiDibaca: () => void;
  onAnalisisBenar: () => void;
  onKlaimReward: () => void;
};

type StatusAnalisis = "belum-diperiksa" | "belum-tepat" | "terverifikasi";

/** Workspace PBL/RBL: instruksi, simulasi proyek yang sebenarnya, dan buku catatan. */
export default function LabWorkspace({
  kasus,
  catatan,
  rewardSudahDiklaim,
  onKembali,
  onUbahCatatan,
  onTandaiDibaca,
  onAnalisisBenar,
  onKlaimReward,
}: Props) {
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [statusAnalisis, setStatusAnalisis] = useState<StatusAnalisis>(
    catatan.analisisBenar ? "terverifikasi" : "belum-diperiksa",
  );
  const [pencapaianTerlihat, setPencapaianTerlihat] = useState(false);

  const langkahMisi = useMemo(() => [
    { label: "Membaca skenario", selesai: catatan.skenarioDibaca },
    { label: "Menulis hipotesis", selesai: catatan.hipotesis.trim().length >= 15 },
    { label: "Mencatat data", selesai: catatan.dataPengamatan.trim().length >= 15 },
    { label: "Memverifikasi analisis", selesai: catatan.analisisBenar },
    { label: "Menulis kesimpulan", selesai: catatan.kesimpulan.trim().length >= 15 },
  ], [catatan]);

  const jumlahLangkahSelesai = langkahMisi.filter((langkah) => langkah.selesai).length;
  const progresMisi = Math.round((jumlahLangkahSelesai / langkahMisi.length) * 100);
  const bolehKlaim = langkahMisi.every((langkah) => langkah.selesai) && !rewardSudahDiklaim;

  function periksaAnalisis() {
    if (!pilihan || catatan.analisisBenar) return;
    const benar = pilihan === kasus.jawabanBenar;
    if (benar) {
      setStatusAnalisis("terverifikasi");
      setPencapaianTerlihat(true);
      onAnalisisBenar();
    } else {
      setStatusAnalisis("belum-tepat");
    }
  }

  return (
    <div className="lab-workspace-page">
      <div className="lab-workspace-toolbar">
        <button className="lab-back-button" type="button" onClick={onKembali}>
          <span aria-hidden="true">←</span> Kembali ke Lab Hub
        </button>
        <div className="lab-workspace-meta">
          <span className={`lab-lane-pill lane-${kasus.jalur}`}>{kasus.jalur.toUpperCase()}</span>
          <span>{kasus.tingkat}</span>
          <span>{kasus.durasi}</span>
        </div>
      </div>

      <header className="lab-mission-header">
        <div>
          <p className="lab-eyebrow">{kasus.jalur === "pbl" ? "PROJECT-BASED LEARNING" : "RESEARCH-BASED LEARNING"} / MISI LAPANGAN</p>
          <h1>{kasus.judul}</h1>
          <p>{kasus.ringkasan}</p>
        </div>
        <div className="lab-mission-reward">
          <span>HADIAH MISI</span>
          <strong>+{kasus.rewardRp} RP</strong>
        </div>
      </header>

      <section className="lab-mission-progress" aria-label={`Progres misi ${progresMisi} persen`}>
        <div className="lab-mission-progress-top">
          <strong>Progres misi</strong>
          <span>{jumlahLangkahSelesai} dari {langkahMisi.length} langkah · {progresMisi}%</span>
        </div>
        <div className="lab-mission-progress-track"><span style={{ width: `${progresMisi}%` }} /></div>
        <div className="lab-mission-steps">
          {langkahMisi.map((langkah, indeks) => (
            <span className={langkah.selesai ? "mission-step-done" : ""} key={langkah.label}>
              <i>{langkah.selesai ? "✓" : indeks + 1}</i>{langkah.label}
            </span>
          ))}
        </div>
      </section>

      <div className="lab-workspace-grid">
        <aside className="lab-brief-panel">
          <div className="lab-panel-heading">
            <div>
              <p className="lab-eyebrow">01 / BRIEFING</p>
              <h2>Instruksi misi</h2>
            </div>
            <span className="lab-panel-icon" aria-hidden="true">⌑</span>
          </div>

          <div className="lab-brief-block">
            <span className="lab-block-label">KONTEKS</span>
            <p>{kasus.konteks}</p>
          </div>
          <div className="lab-brief-block lab-problem-block">
            <span className="lab-block-label">TANTANGAN UTAMA</span>
            <p>{kasus.masalah}</p>
          </div>
          <div className="lab-brief-block">
            <span className="lab-block-label">TARGET PEMBELAJARAN</span>
            <ul>
              {kasus.tujuan.map((tujuan) => <li key={tujuan}>{tujuan}</li>)}
            </ul>
          </div>
          <div className="lab-protocol-block">
            <span className="lab-block-label">PROTOKOL KERJA</span>
            <ol>
              {kasus.instruksi.map((instruksi) => <li key={instruksi}>{instruksi}</li>)}
            </ol>
          </div>
          <button
            className={`lab-read-button ${catatan.skenarioDibaca ? "is-done" : ""}`}
            type="button"
            onClick={onTandaiDibaca}
            disabled={catatan.skenarioDibaca}
          >
            {catatan.skenarioDibaca ? "✓ Skenario telah dibaca" : "Tandai skenario dipahami"}
          </button>

          <section className="lab-analysis-card" aria-labelledby="lab-analysis-title">
            <p className="lab-eyebrow">04 / CEK PEMAHAMAN</p>
            <h3 id="lab-analysis-title">{kasus.pertanyaanAnalisis}</h3>
            <div className="lab-analysis-options" role="group" aria-label="Pilihan analisis">
              {kasus.pilihanAnalisis.map((opsi) => {
                const benar = opsi.id === kasus.jawabanBenar;
                const dipilih = pilihan === opsi.id;
                const kelas = [
                  "lab-analysis-option",
                  dipilih ? "option-selected" : "",
                  statusAnalisis === "terverifikasi" && benar ? "option-correct" : "",
                  statusAnalisis === "belum-tepat" && dipilih ? "option-incorrect" : "",
                ].filter(Boolean).join(" ");
                return (
                  <button
                    className={kelas}
                    key={opsi.id}
                    type="button"
                    onClick={() => {
                      if (catatan.analisisBenar) return;
                      setPilihan(opsi.id);
                      setStatusAnalisis("belum-diperiksa");
                    }}
                    disabled={catatan.analisisBenar}
                    aria-pressed={dipilih}
                  >
                    <span>{opsi.id.toUpperCase()}</span>{opsi.label}
                  </button>
                );
              })}
            </div>
            {statusAnalisis === "belum-tepat" && (
              <p className="lab-analysis-feedback feedback-retry" aria-live="polite">
                Belum tepat. Periksa kembali besaran, satuan, dan hubungan fisika yang digunakan, lalu coba lagi.
              </p>
            )}
            {statusAnalisis === "terverifikasi" && (
              <div className="lab-analysis-feedback feedback-success" aria-live="polite">
                <strong>Analisis terverifikasi.</strong>
                <p>{kasus.pembahasan}</p>
              </div>
            )}
            {!catatan.analisisBenar && (
              <button className="lab-check-button" type="button" onClick={periksaAnalisis} disabled={!pilihan}>
                Periksa analisis <span aria-hidden="true">→</span>
              </button>
            )}
          </section>
        </aside>

        <section className="lab-simulation-panel" aria-label="Laboratorium simulasi terhubung">
          <div className="lab-panel-heading lab-simulation-heading">
            <div>
              <p className="lab-eyebrow">02 / VIRTUAL EXPERIMENT</p>
              <h2>Meja simulasi</h2>
              <p className="lab-simulation-subtitle">Terhubung ke modul {kasus.simulasi.label}.</p>
            </div>
            <span className="lab-live-indicator"><i /> SIMULASI AKTIF</span>
          </div>
          <DioramaStudiKasus kasus={kasus} />
          <div className="lab-simulation-embed">
            {kasus.simulasi.kategori === "kinematika" ? (
              <KinematikaPage modulAktif={kasus.simulasi.modul} />
            ) : (
              <DinamikaPage modulAktif={kasus.simulasi.modul} />
            )}
          </div>
          <p className="lab-simulation-note">
            Ubah parameter pada simulasi, jalankan eksperimen, lalu pindahkan hasil pengamatanmu ke buku catatan di sisi kanan.
          </p>
        </section>

        <VirtualLabNotebook catatan={catatan} onUbah={onUbahCatatan} />
      </div>

      <section className="lab-reward-bar">
        <div className="lab-reward-copy">
          <span className="lab-reward-icon" aria-hidden="true">✧</span>
          <div>
            <strong>{rewardSudahDiklaim ? "Reward misi sudah diklaim" : "Selesaikan misi dan klaim Research Points"}</strong>
            <span>
              {rewardSudahDiklaim
                ? `Kamu sudah memperoleh ${kasus.rewardRp} RP dari misi ini.`
                : bolehKlaim
                  ? "Semua langkah selesai. Poin siap ditambahkan ke profil peneliti."
                  : "Isi hipotesis, data pengamatan, kesimpulan, dan verifikasi analisis untuk membuka reward."}
            </span>
          </div>
        </div>
        <button
          className="lab-claim-button"
          type="button"
          onClick={onKlaimReward}
          disabled={!bolehKlaim}
        >
          {rewardSudahDiklaim ? "✓ Sudah diklaim" : `Klaim +${kasus.rewardRp} RP`}
        </button>
      </section>

      {pencapaianTerlihat && (
        <div className="lab-achievement-toast" role="status" aria-live="polite">
          <span className="lab-achievement-symbol" aria-hidden="true">✦</span>
          <div>
            <strong>Analisis berhasil diverifikasi!</strong>
            <span>Bagus, penalaranmu sesuai dengan model fisika. Lengkapi catatan untuk membuka reward.</span>
          </div>
          <button type="button" onClick={() => setPencapaianTerlihat(false)} aria-label="Tutup notifikasi">×</button>
        </div>
      )}
    </div>
  );
}
