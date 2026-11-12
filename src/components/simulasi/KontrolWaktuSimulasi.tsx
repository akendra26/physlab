type Props = {
  waktu: number;
  durasi: number;
  berjalan: boolean;
  pengaliKecepatan: number;
  tanpaBatas?: boolean;
  tampilkanPengalihVektor?: boolean;
  vektorAktif?: boolean;
  onUbahWaktu: (waktu: number) => void;
  onMulaiJeda: () => void;
  onAturUlang: () => void;
  onUbahKecepatan: (kecepatan: number) => void;
  onUbahModeWaktu?: (tanpaBatas: boolean) => void;
  onUbahVektor?: (aktif: boolean) => void;
};

export default function KontrolWaktuSimulasi({
  waktu,
  durasi,
  berjalan,
  pengaliKecepatan,
  tanpaBatas = false,
  tampilkanPengalihVektor = false,
  vektorAktif = false,
  onUbahWaktu,
  onMulaiJeda,
  onAturUlang,
  onUbahKecepatan,
  onUbahModeWaktu,
  onUbahVektor,
}: Props) {
  const sudahSelesai = !tanpaBatas && durasi > 0 && waktu >= durasi - 1e-5;
  const labelJalan = berjalan ? "Jeda" : sudahSelesai ? "Ulangi" : "Mulai";

  return (
    <div className="sim-time-control" aria-label="Kontrol waktu simulasi">
      <div className="timeline-row">
        <span className="time-readout">{waktu.toFixed(2)} <small>s</small></span>
        {tanpaBatas ? (
          <div className="infinite-time-readout">
            <span className="infinite-time-pulse" /> WAKTU TANPA BATAS AKTIF
          </div>
        ) : (
          <input
            className="timeline"
            aria-label="Waktu simulasi"
            type="range"
            min={0}
            max={Math.max(durasi, 0.01)}
            step={Math.max(durasi / 500, 0.001)}
            value={Math.min(waktu, Math.max(durasi, 0.01))}
            onChange={(event) => onUbahWaktu(Number(event.target.value))}
          />
        )}
        <span className="time-total">{tanpaBatas ? "∞" : `${durasi.toFixed(2)} s`}</span>
      </div>

      <div className="playback-row">
        <div className="playback-buttons">
          <button className="play-button" type="button" onClick={onMulaiJeda}>
            <span>{berjalan ? "Ⅱ" : "▶"}</span> {labelJalan}
          </button>
          <button className="icon-button" type="button" onClick={onAturUlang} aria-label="Atur ulang simulasi" title="Reset">↺</button>
        </div>

        <div className="playback-options">
          <label className="speed-select">
            <span>Kecepatan</span>
            <select value={pengaliKecepatan} onChange={(event) => onUbahKecepatan(Number(event.target.value))}>
              <option value={0.25}>0,25×</option>
              <option value={0.5}>0,5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>

          {onUbahModeWaktu && (
            <label className="toggle-control infinite-time-toggle">
              <input type="checkbox" checked={tanpaBatas} onChange={(event) => onUbahModeWaktu(event.target.checked)} />
              <span className="toggle-track" />
              <span>Tanpa batas</span>
            </label>
          )}

          {tampilkanPengalihVektor && onUbahVektor && (
            <label className="toggle-control">
              <input type="checkbox" checked={vektorAktif} onChange={(event) => onUbahVektor(event.target.checked)} />
              <span className="toggle-track" />
              <span>Tampilkan vektor kecepatan</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
