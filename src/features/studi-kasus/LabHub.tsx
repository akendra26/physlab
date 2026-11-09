import {
  DAFTAR_STUDI_KASUS,
  daftarLencana,
  hitungLevelPeneliti,
  type JalurPembelajaran,
  type ProgresLaboratorium,
} from "./dataStudiKasus";

type Props = {
  progres: ProgresLaboratorium;
  onPilihKasus: (kasusId: string) => void;
};

const JALUR: {
  id: JalurPembelajaran;
  judul: string;
  subjudul: string;
  deskripsi: string;
  simbol: string;
  aksen: "mint" | "blue";
}[] = [
  {
    id: "pbl",
    judul: "Proyek Rekayasa",
    subjudul: "PROJECT-BASED LEARNING",
    deskripsi: "Bangun solusi dari masalah nyata. Rancang, uji melalui simulasi, evaluasi hasil, lalu pertahankan keputusan desainmu.",
    simbol: "⚙",
    aksen: "mint",
  },
  {
    id: "rbl",
    judul: "Riset Penyelidikan",
    subjudul: "RESEARCH-BASED LEARNING",
    deskripsi: "Mulai dari pertanyaan ilmiah. Susun hipotesis, kumpulkan bukti dari simulasi, analisis pola, dan tarik kesimpulan.",
    simbol: "⌕",
    aksen: "blue",
  },
];

/** Dashboard Lab Hub: progres peneliti, lencana, dan daftar misi PBL/RBL. */
export default function LabHub({ progres, onPilihKasus }: Props) {
  const level = hitungLevelPeneliti(progres.researchPoints);
  const lencana = daftarLencana(progres);
  const totalKasus = DAFTAR_STUDI_KASUS.length;

  return (
    <div className="studi-kasus-page">
      <section className="labhub-hero">
        <div className="labhub-hero-orbit orbit-outer" aria-hidden="true" />
        <div className="labhub-hero-orbit orbit-inner" aria-hidden="true" />
        <div className="labhub-hero-copy">
          <p className="lab-eyebrow">PHYSICS LAB / LABORATORIUM VIRTUAL</p>
          <h1>Belajar dengan <em>menyelidiki.</em></h1>
          <p>
            Pilih tantangan rekayasa atau penyelidikan ilmiah. Gunakan simulasi sebagai laboratorium,
            catat bukti, dan kumpulkan Research Points dari setiap misi yang berhasil.
          </p>
          <div className="labhub-hero-tags">
            <span><i className="lab-tag-dot" /> PBL · PROYEK</span>
            <span><i className="lab-tag-dot lab-tag-blue" /> RBL · RISET</span>
            <span><i className="lab-tag-dot lab-tag-amber" /> GAMIFIKASI</span>
          </div>
        </div>
        <div className="labhub-hero-emblem" aria-hidden="true">
          <span className="emblem-ring ring-a" />
          <span className="emblem-ring ring-b" />
          <span className="emblem-core">φ</span>
          <span className="emblem-label">VIRTUAL<br />LAB</span>
        </div>
      </section>

      <section className="lab-profile" aria-label="Profil peneliti">
        <div className="lab-profile-level">
          <div className="lab-profile-icon" aria-hidden="true">{level.simbol}</div>
          <div className="lab-profile-copy">
            <span className="lab-stat-label">LEVEL PENELITI</span>
            <strong>{level.nama}</strong>
            <div className="lab-level-track" aria-label={`Progres level ${Math.round(level.progresLevel)} persen`}>
              <span style={{ width: `${level.progresLevel}%` }} />
            </div>
            <small>{level.berikutnya === null ? "Level maksimum tercapai" : `${progres.researchPoints} / ${level.berikutnya} RP menuju level berikutnya`}</small>
          </div>
        </div>
        <div className="lab-profile-stat">
          <span className="lab-stat-label">RESEARCH POINTS</span>
          <strong className="rp-value">{progres.researchPoints.toLocaleString("id-ID")} <small>RP</small></strong>
          <span className="lab-stat-foot">Poin penelitian</span>
        </div>
        <div className="lab-profile-stat">
          <span className="lab-stat-label">MISI SELESAI</span>
          <strong>{progres.kasusSelesai.length}<small> / {totalKasus}</small></strong>
          <span className="lab-stat-foot">Studi kasus dituntaskan</span>
        </div>
      </section>

      <section className="lab-section" aria-labelledby="lab-path-title">
        <div className="lab-section-heading">
          <div>
            <p className="lab-eyebrow">PILIH METODE BELAJAR</p>
            <h2 id="lab-path-title">Dua jalur eksplorasi</h2>
          </div>
          <span className="lab-section-counter">{totalKasus} MISI TERSEDIA</span>
        </div>

        <div className="lab-path-grid">
          {JALUR.map((jalur) => {
            const kasusJalur = DAFTAR_STUDI_KASUS.filter((kasus) => kasus.jalur === jalur.id);
            const selesaiJalur = kasusJalur.filter((kasus) => progres.kasusSelesai.includes(kasus.id)).length;
            return (
              <article className={`lab-path-card path-${jalur.aksen}`} key={jalur.id}>
                <div className="lab-path-header">
                  <span className="lab-path-symbol" aria-hidden="true">{jalur.simbol}</span>
                  <span className="lab-path-count">{selesaiJalur}/{kasusJalur.length} SELESAI</span>
                </div>
                <p className="lab-eyebrow">{jalur.subjudul}</p>
                <h3>{jalur.judul}</h3>
                <p className="lab-path-description">{jalur.deskripsi}</p>
                <div className="lab-case-list">
                  {kasusJalur.map((kasus, indeks) => {
                    const selesai = progres.kasusSelesai.includes(kasus.id);
                    const diklaim = progres.rewardDiklaim.includes(kasus.id);
                    return (
                      <div className="lab-case-row" key={kasus.id}>
                        <div className="lab-case-index">{String(indeks + 1).padStart(2, "0")}</div>
                        <div className="lab-case-copy">
                          <strong>{kasus.judul}</strong>
                          <span>{kasus.durasi} · {kasus.rewardRp} RP</span>
                        </div>
                        {selesai && <span className="lab-case-complete" title="Misi selesai" aria-label="Misi selesai">✓</span>}
                        <button className="lab-case-open" type="button" onClick={() => onPilihKasus(kasus.id)}>
                          {selesai ? "Ulangi" : diklaim ? "Buka" : "Mulai"} <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="lab-section lab-badges-section" aria-labelledby="lab-badge-title">
        <div className="lab-section-heading">
          <div>
            <p className="lab-eyebrow">KOLEKSI PENCAPAIAN</p>
            <h2 id="lab-badge-title">Lencana peneliti</h2>
          </div>
          <span className="lab-section-counter">{lencana.filter((item) => item.terbuka).length}/{lencana.length} TERBUKA</span>
        </div>
        <div className="lab-badge-grid">
          {lencana.map((item) => (
            <article className={`lab-badge-card ${item.terbuka ? "badge-unlocked" : "badge-locked"}`} key={item.id}>
              <span className="lab-badge-symbol" aria-hidden="true">{item.terbuka ? item.simbol : "◌"}</span>
              <div>
                <strong>{item.nama}</strong>
                <p>{item.deskripsi}</p>
              </div>
              <span className="lab-badge-state">{item.terbuka ? "TERBUKA" : "TERKUNCI"}</span>
            </article>
          ))}
        </div>
      </section>
      <p className="labhub-footnote">Progres dan catatan disimpan secara lokal pada browser/perangkat ini.</p>
    </div>
  );
}