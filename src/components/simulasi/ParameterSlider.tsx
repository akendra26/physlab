import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
};

/**
 * Kontrol parameter ganda: slider untuk eksplorasi cepat dan kotak angka
 * untuk input presisi. Keduanya memakai rentang dan langkah yang sama.
 */
export default function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: Props) {
  const presisi = Math.max(0, (String(step).split(".")[1] ?? "").length);
  const [draf, setDraf] = useState(String(value));
  const sedangFokus = useRef(false);

  useEffect(() => {
    if (!sedangFokus.current) setDraf(Number(value).toFixed(presisi));
  }, [value, presisi]);

  const batasiNilai = (angka: number) =>
    Math.min(max, Math.max(min, angka));

  const commit = () => {
    const angka = Number(draf.replace(",", "."));
    if (!Number.isFinite(angka)) {
      setDraf(value.toFixed(presisi));
      return;
    }
    const berikutnya = batasiNilai(angka);
    onChange(berikutnya);
    setDraf(berikutnya.toFixed(presisi));
  };

  return (
    <label className="parameter-control">
      <span className="parameter-heading">
        <span className="parameter-label">{label}</span>
        <span className="parameter-number-wrap">
          <input
            className="parameter-number-input"
            type="text"
            inputMode="decimal"
            aria-label={`${label}, nilai numerik`}
            value={draf}
            onFocus={() => { sedangFokus.current = true; }}
            onChange={(event) => {
              const teks = event.target.value;
              setDraf(teks);
              const normal = teks.trim().replace(",", ".");
              if (normal !== "" && normal !== "-" && !normal.endsWith(".")) {
                const angka = Number(normal);
                if (Number.isFinite(angka)) onChange(batasiNilai(angka));
              }
            }}
            onBlur={() => {
              sedangFokus.current = false;
              commit();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
              }
              if (event.key === "Escape") {
                setDraf(value.toFixed(presisi));
                event.currentTarget.blur();
              }
            }}
          />
          <small>{unit}</small>
        </span>
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${label}, slider`}
      />
      <span className="range-labels">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </span>
    </label>
  );
}
