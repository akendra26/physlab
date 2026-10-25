type Props = {
  title: string;
  yLabel: string;
  values: number[];
  color?: string;
};

export default function MiniGraph({
  title,
  yLabel,
  values,
  color = "#55e0c1",
}: Props) {
  const width = 620;
  const height = 190;
  const left = 42;
  const right = 14;
  const top = 22;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const finiteValues = values.filter(Number.isFinite);
  const minValue = finiteValues.length ? Math.min(...finiteValues) : 0;
  const maxValue = finiteValues.length ? Math.max(...finiteValues) : 1;
  const span = maxValue - minValue || 1;
  const points = values.map((value, i) => {
    const x = left + (i / Math.max(values.length - 1, 1)) * plotWidth;
    const y = top + (1 - (value - minValue) / span) * plotHeight;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <article className="graph-card">
      <div className="graph-title-row">
        <h3>{title}</h3>
        <span>{yLabel}</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} graph`}>
        {[0, 1, 2, 3].map((i) => {
          const y = top + (plotHeight * i) / 3;
          return (
            <line
              key={i}
              x1={left}
              x2={width - right}
              y1={y}
              y2={y}
              stroke="rgba(148,163,184,.14)"
              strokeWidth="1"
            />
          );
        })}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <text x={left} y={height - 8} className="graph-axis-label">0 s</text>
        <text x={width - right} y={height - 8} textAnchor="end" className="graph-axis-label">Time (s)</text>
        <text x={left} y={top - 7} className="graph-value-label">{maxValue.toFixed(2)}</text>
        <text x={left} y={height - bottom + 2} className="graph-value-label">{minValue.toFixed(2)}</text>
      </svg>
    </article>
  );
}
