import {
  BANK_SOAL_PROBLEM_SET,
  type ProgresProblemSet,
} from "./dataProblemSet";

type ProblemSetHubProps = {
  progres: ProgresProblemSet;
  onPilihTopik: (topikId: string) => void;
};

export default function ProblemSetHub({ progres, onPilihTopik }: ProblemSetHubProps) {
  const jumlahSemuaSoal = BANK_SOAL_PROBLEM_SET.reduce((jumlah, topik) => jumlah + topik.soal.length, 0);
  const jumlahBenar = BANK_SOAL_PROBLEM_SET.reduce(
    (jumlah, topik) => jumlah + topik.soal.filter((soal) => progres.percobaan[soal.id]?.benar).length,
    0,
  );
  const persentaseTotal = jumlahSemuaSoal > 0 ? Math.round((jumlahBenar / jumlahSemuaSoal) * 100) : 0;

  return (
    <section className="ps-page" aria-labelledby="problem-set-title">
      <header className="ps-page-heading">
        <div>
          <p className="ps-eyebrow">PUSAT LATIHAN · BANK SOAL FISIKA</p>
          <div className="ps-title-row">
            <div>
              <h1 id="problem-set-title">Problem Set</h1>
              <p className="ps-description">
                Latih pemahaman konsep dan kemampuan berhitung melalui kumpulan soal terstruktur,
                pemeriksaan otomatis, serta pembahasan berbasis persamaan fisika.
              </p>
            </div>
            <span className="ps-status"><span /> 7 TOPIK TERSEDIA</span>
          </div>
        </div>
      </header>

      <section className="ps-overview" aria-label="Ringkasan progres pengerjaan">
        <div className="ps-overview-copy">
          <span className="ps-overview-label">PROGRES KESELURUHAN</span>
          <strong>{jumlahBenar}<small> / {jumlahSemuaSoal} soal benar</small></strong>
          <div className="ps-overview-track"><span style={{ width: `${persentaseTotal}%` }} /></div>
        </div>
        <div className="ps-overview-percent">{persentaseTotal}<small>%</small></div>
        <div className="ps-overview-note">Progres tersimpan otomatis di browser ini.</div>
      </section>

      <div className="ps-section-heading">
        <div>
          <p className="ps-eyebrow">PILIH MATERI</p>
          <h2>Topik Problem Set</h2>
        </div>
        <span className="ps-count">{BANK_SOAL_PROBLEM_SET.length} MATERI · {jumlahSemuaSoal} SOAL MOCK</span>
      </div>

      <div className="ps-topic-grid">
        {BANK_SOAL_PROBLEM_SET.map((topik) => {
          const benar = topik.soal.filter((soal) => progres.percobaan[soal.id]?.benar).length;
          const total = topik.soal.length;
          const persen = total ? Math.round((benar / total) * 100) : 0;
          const selesai = benar === total;

          return (
            <button
              className={`ps-topic-card ps-tone-${topik.warna}`}
              key={topik.id}
              type="button"
              onClick={() => onPilihTopik(topik.id)}
              aria-label={`Buka ${topik.judul}, ${benar} dari ${total} soal benar`}
            >
              <div className="ps-card-topline">
                <span className="ps-topic-number">TOPIK {String(topik.nomor).padStart(2, "0")}</span>
                <span className="ps-topic-icon" aria-hidden="true">{topik.simbol}</span>
              </div>
              <span className="ps-topic-domain">{topik.bidang.toUpperCase()} · {topik.singkatan}</span>
              <h3>{topik.judul}</h3>
              <p>{topik.deskripsi}</p>
              <div className="ps-card-meta">
                <span>{total} soal</span>
                <span>{topik.estimasiMenit} menit</span>
                <span>{selesai ? "Tuntas" : `${benar}/${total} benar`}</span>
              </div>
              <div className="ps-topic-progress" aria-label={`Progres ${persen}%`}>
                <span style={{ width: `${persen}%` }} />
              </div>
              <div className="ps-card-action">
                <span>{selesai ? "Ulangi latihan" : benar > 0 ? "Lanjutkan latihan" : "Mulai latihan"}</span>
                <span aria-hidden="true">↗</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="ps-mock-note">
        <strong>Catatan:</strong> materi dan angka soal saat ini adalah data contoh (mock).
        Struktur bank soal sudah disiapkan untuk menerima naskah LaTeX asli.
      </p>
    </section>
  );
}