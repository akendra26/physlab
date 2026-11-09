import type { KeyboardEvent, PointerEvent } from "react";

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

/** Dial sudut SVG 0–360° yang dapat diputar dengan drag, klik, keyboard, atau input angka. */
export default function RotaryDial({
  label,
  value,
  min = 0,
  max = 360,
  step = 1,
  onChange,
}: Props) {
  const angle = ((value % 360) + 360) % 360;
  const radians = ((angle - 90) * Math.PI) / 180;
  const endX = 50 + 34 * Math.cos(radians);
  const endY = 50 + 34 * Math.sin(radians);

  function ambilSudut(clientX: number, clientY: number, element: SVGSVGElement) {
    const rect = element.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100 - 50;
    const y = ((clientY - rect.top) / rect.height) * 100 - 50;
    const derajat = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
    const snapped = Math.round(derajat / step) * step;
    onChange(Math.min(max, Math.max(min, snapped)));
  }

  function pointerDown(event: PointerEvent<SVGSVGElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    ambilSudut(event.clientX, event.clientY, event.currentTarget);
  }

  function pointerMove(event: PointerEvent<SVGSVGElement>) {
    if (event.buttons !== 1) return;
    ambilSudut(event.clientX, event.clientY, event.currentTarget);
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(max, value + step));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(min, value - step));
    }
    if (event.key === "Home") onChange(min);
    if (event.key === "End") onChange(max);
  }

  return (
    <div className="rotary-dial-control">
      <div className="rotary-dial-heading">
        <span>{label}</span>
        <label className="rotary-dial-number">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => {
              const angka = Number(event.target.value);
              if (Number.isFinite(angka)) onChange(Math.min(max, Math.max(min, angka)));
            }}
            aria-label={`${label}, input numerik`}
          />
          <small>°</small>
        </label>
      </div>
      <div
        className="rotary-dial-wrap"
        tabIndex={0}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={keyboard}
      >
        <svg
          viewBox="0 0 100 100"
          className="rotary-dial-svg"
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="42" className="rotary-dial-track" />
          <circle
            cx="50" cy="50" r="42"
            className="rotary-dial-progress"
            strokeDasharray={`${(angle / 360) * 263.9} 263.9`}
            transform="rotate(-90 50 50)"
          />
          {Array.from({ length: 12 }, (_, index) => {
            const rad = (index * Math.PI) / 6 - Math.PI / 2;
            return (
              <line
                key={index}
                x1={50 + 38 * Math.cos(rad)}
                y1={50 + 38 * Math.sin(rad)}
                x2={50 + 41 * Math.cos(rad)}
                y2={50 + 41 * Math.sin(rad)}
                className="rotary-dial-tick"
              />
            );
          })}
          <line x1="50" y1="50" x2={endX} y2={endY} className="rotary-dial-needle" />
          <circle cx={endX} cy={endY} r="4.5" className="rotary-dial-handle" />
          <circle cx="50" cy="50" r="5" className="rotary-dial-center" />
        </svg>
        <span className="rotary-dial-value">{value.toFixed(0)}°</span>
        <span className="rotary-dial-min">0°</span>
        <span className="rotary-dial-max">360°</span>
      </div>
      <input
        className="rotary-dial-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${label}, slider sudut`}
      />
    </div>
  );
}
