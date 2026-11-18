import { useBahasa } from "../../i18n/BahasaContext";

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
  onStop?: () => void;
  onUbahKecepatan: (kecepatan: number) => void;
  onUbahModeWaktu?: (tanpaBatas: boolean) => void;
  onUbahDurasi?: (durasi: number) => void;
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
  onStop,
  onUbahKecepatan,
  onUbahModeWaktu,
  onUbahDurasi,
  onUbahVektor,
}: Props) {
  const bahasa = useBahasa();
  const isId = bahasa === "id";
  const sudahSelesai = !tanpaBatas && durasi > 0 && waktu >= durasi - 1e-5;
  const labelJalan = berjalan ? (isId ? "Jeda" : "Pause") : sudahSelesai ? (isId ? "Ulangi" : "Replay") : (isId ? "Mulai" : "Start");

  return (
    <div className="sim-time-control" aria-label={isId ? "Kontrol waktu simulasi" : "Simulation time controls"}>
      <div className="timeline-row">
        <span className="time-readout">{waktu.toFixed(2)} <small>s</small></span>
        {tanpaBatas ? (
          <div className="infinite-time-readout">
            <span className="infinite-time-pulse" /> {isId ? "WAKTU TANPA BATAS AKTIF" : "UNLIMITED TIME ACTIVE"}
          </div>
        ) : (
          <label className="time-number-entry">
            <span>{isId ? "WAKTU t" : "TIME t"}</span>
            <input
              aria-label={isId ? "Masukkan waktu simulasi dalam sekon" : "Enter simulation time in seconds"}
              type="number"
              min={0}
              max={Math.max(durasi, 0.01)}
              step={0.01}
              value={Number.isFinite(waktu) ? waktu : 0}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value) && event.target.value !== "") onUbahWaktu(Math.min(Math.max(0, value), Math.max(durasi, 0.01)));
              }}
            />
            <small>s</small>
          </label>
        )}
        <span className="time-total">{tanpaBatas ? "∞" : `${durasi.toFixed(0)} s`}</span>
        {onUbahDurasi && (
          <div className="observation-duration-control">
            <label htmlFor="observation-duration-range">{isId ? "Durasi pengamatan" : "Observation duration"}</label>
            <input
              id="observation-duration-range"
              type="range"
              min={1}
              max={60}
              step={1}
              value={durasi}
              onChange={(event) => onUbahDurasi(Number(event.target.value))}
              aria-label={isId ? "Atur durasi pengamatan dalam detik" : "Set observation duration in seconds"}
            />
            <input
              type="number"
              min={1}
              max={60}
              step={1}
              value={durasi}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (event.target.value !== "" && Number.isFinite(value)) onUbahDurasi(Math.max(1, Math.min(60, Math.round(value))));
              }}
              aria-label={isId ? "Durasi pengamatan dalam detik" : "Observation duration in seconds"}
            />
            <small>s</small>
          </div>
        )}
      </div>

      <div className="playback-row">
        <div className="playback-buttons">
          <button className="play-button" type="button" onClick={onMulaiJeda}>
            <span>{berjalan ? "Ⅱ" : "▶"}</span> {labelJalan}
          </button>
          <button className="icon-button" type="button" onClick={onStop ?? onAturUlang} aria-label={isId ? "Hentikan simulasi" : "Stop simulation"} title={isId ? "Henti" : "Stop"}>■</button>
          <button className="icon-button" type="button" onClick={onAturUlang} aria-label={isId ? "Atur ulang simulasi" : "Reset simulation"} title="Reset">↺</button>
        </div>

        <div className="playback-options">
          <label className="speed-select">
            <span>{isId ? "Kecepatan" : "Speed"}</span>
            <select value={pengaliKecepatan} onChange={(event) => onUbahKecepatan(Number(event.target.value))}>
              <option value={0.25}>{isId ? "0,25×" : "0.25×"}</option>
              <option value={0.5}>{isId ? "0,5×" : "0.5×"}</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>

          {onUbahModeWaktu && (
            <label className="toggle-control infinite-time-toggle">
              <input type="checkbox" checked={tanpaBatas} onChange={(event) => onUbahModeWaktu(event.target.checked)} />
              <span className="toggle-track" />
              <span>{isId ? "Tanpa batas" : "Unlimited"}</span>
            </label>
          )}

          {tampilkanPengalihVektor && onUbahVektor && (
            <label className="toggle-control">
              <input type="checkbox" checked={vektorAktif} onChange={(event) => onUbahVektor(event.target.checked)} />
              <span className="toggle-track" />
              <span>{isId ? "Tampilkan vektor kecepatan" : "Show velocity vectors"}</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
