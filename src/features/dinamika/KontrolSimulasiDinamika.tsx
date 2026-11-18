import { useBahasa } from "../../i18n/BahasaContext";
import type { ChangeEvent } from "react";

type Props = {
  waktu: number;
  durasi: number;
  berjalan: boolean;
  pengaliKecepatan: number;
  tanpaBatas?: boolean;
  onUbahWaktu: (nilai: number) => void;
  onMulaiJeda: () => void;
  onAturUlang: () => void;
  onUbahKecepatan: (nilai: number) => void;
  onUbahModeWaktu?: (aktif: boolean) => void;
  onStop?: () => void;
  bisaGeser?: boolean;
  onUbahDurasi?: (durasi: number) => void;
};

export default function KontrolSimulasiDinamika({
  waktu,
  durasi,
  berjalan,
  pengaliKecepatan,
  tanpaBatas = false,
  onUbahWaktu,
  onMulaiJeda,
  onAturUlang,
  onUbahKecepatan,
  onUbahModeWaktu,
  onStop,
  bisaGeser = true,
  onUbahDurasi,
}: Props) {
  const bahasa = useBahasa();
  const isId = bahasa === "id";
  const ubahWaktu = (event: ChangeEvent<HTMLInputElement>) => onUbahWaktu(Number(event.target.value));
  const ubahKecepatan = (event: ChangeEvent<HTMLSelectElement>) => onUbahKecepatan(Number(event.target.value));

  return (
    <div className="kontrol-waktu-dinamika" aria-label={isId ? "Kontrol waktu simulasi" : "Simulation time controls"}>
      <div className="kontrol-waktu-dinamika-tombol">
        <button type="button" className="tombol-jalan-dinamika" onClick={onMulaiJeda}>
          {berjalan ? (isId ? "Ⅱ Jeda" : "Ⅱ Pause") : (isId ? "▶ Mulai" : "▶ Start")}
        </button>
        <button type="button" className="tombol-stop-dinamika" onClick={onStop ?? onAturUlang}>{isId ? "■ Henti" : "■ Stop"}</button>
        <button type="button" className="tombol-reset-dinamika" onClick={onAturUlang}>{isId ? "↺ Atur ulang" : "↺ Reset"}</button>
        <label className="label-kecepatan-dinamika">
          {isId ? "Kecepatan" : "Speed"}
          <select value={pengaliKecepatan} onChange={ubahKecepatan}>
            <option value={0.25}>{isId ? "0,25×" : "0.25×"}</option>
            <option value={0.5}>{isId ? "0,5×" : "0.5×"}</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
          </select>
        </label>
        <output>{waktu.toFixed(2)} {tanpaBatas ? "s · ∞" : `/ ${durasi.toFixed(0)} s`}</output>
        {onUbahModeWaktu && (
          <label className="toggle-control infinite-time-toggle">
            <input type="checkbox" checked={tanpaBatas} onChange={(event) => onUbahModeWaktu(event.target.checked)} />
            <span className="toggle-track" />
            <span>{isId ? "Tanpa batas" : "Unlimited"}</span>
          </label>
        )}
      </div>
      {onUbahDurasi && (
        <div className="dinamika-duration-control">
          <label htmlFor="dinamika-duration-range">{isId ? "Durasi pengamatan" : "Observation duration"}</label>
          <input id="dinamika-duration-range" type="range" min={1} max={60} step={1} value={durasi} onChange={(event) => onUbahDurasi(Number(event.target.value))} aria-label={isId ? "Atur durasi pengamatan" : "Set observation duration"} />
          <input type="number" min={1} max={60} step={1} value={durasi} onChange={(event) => { const value = Number(event.target.value); if (event.target.value !== "" && Number.isFinite(value)) onUbahDurasi(Math.max(1, Math.min(60, Math.round(value)))); }} aria-label={isId ? "Durasi pengamatan dalam detik" : "Observation duration in seconds"} />
          <span>s</span>
        </div>
      )}
      {!tanpaBatas && (
        <input
          className="penggeser-waktu-dinamika"
          type="range"
          min={0}
          max={durasi}
          step={0.01}
          disabled={!bisaGeser}
          value={Math.min(waktu, durasi)}
          onChange={ubahWaktu}
          aria-label={isId ? "Geser waktu simulasi" : "Scrub simulation time"}
        />
      )}
    </div>
  );
}
