type Props = {
  label: string;
  value: string;
  ikon: string;
  aksen: "mint" | "blue" | "amber";
};

export default function KartuBesaran({ label, value, ikon, aksen }: Props) {
  return (
    <article className={`metric-card accent-${aksen}`}>
      <div className="metric-topline">
        <span>{label}</span>
        <span className="metric-icon" aria-hidden="true">{ikon}</span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}
