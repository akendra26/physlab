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
}: Props) {
  const ubahWaktu = (event: ChangeEvent<HTMLInputElement>) => onUbahWaktu(Number(event.target.value));
  const ubahKecepatan = (event: ChangeEvent<HTMLSelectElement>) => onUbahKecepatan(Number(event.target.value));

  return (
    <div className="kontrol-waktu-dinamika" aria-label="Kontrol waktu simulasi">
      <div className="kontrol-waktu-dinamika-tombol">
        <button type="button" className="tombol-jalan-dinamika" onClick={onMulaiJeda}>
          {berjalan ? "Ⅱ Jeda" : "▶ Mulai"}
        </button>
        <button type="button" className="tombol-stop-dinamika" onClick={onStop ?? onAturUlang}>■ Stop</button>
        <button type="button" className="tombol-reset-dinamika" onClick={onAturUlang}>↺ Reset</button>
        <label className="label-kecepatan-dinamika">
          Kecepatan
          <select value={pengaliKecepatan} onChange={ubahKecepatan}>
            <option value={0.25}>0,25×</option>
            <option value={0.5}>0,5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
          </select>
        </label>
        <output>{waktu.toFixed(2)} {tanpaBatas ? "s · ∞" : `/ ${durasi.toFixed(0)} s`}</output>
        {onUbahModeWaktu && (
          <label className="toggle-control infinite-time-toggle">
            <input type="checkbox" checked={tanpaBatas} onChange={(event) => onUbahModeWaktu(event.target.checked)} />
            <span className="toggle-track" />
            <span>Tanpa batas</span>
          </label>
        )}
      </div>
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
          aria-label="Geser waktu simulasi"
        />
      )}
    </div>
  );
}
