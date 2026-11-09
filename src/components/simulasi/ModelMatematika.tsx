import { useMemo, type ReactNode } from "react";
import katex from "katex";

export type PersamaanMatematika = {
  judul: string;
  latex: string;
  penjelasan?: string;
};

export type VariabelMatematika = {
  simbol: string;
  nama: string;
  satuan: string;
  deskripsi?: string;
};

type Props = {
  judul?: string;
  deskripsi: string;
  persamaan: readonly PersamaanMatematika[];
  variabel: readonly VariabelMatematika[];
  catatan?: ReactNode;
};

type LaTeXProps = {
  ekspresi: string;
  displayMode?: boolean;
  className?: string;
};

/** Merender ekspresi LaTeX dengan KaTeX (HTML dan MathML untuk aksesibilitas). */
function LaTeX({
  ekspresi,
  displayMode = false,
  className,
}: LaTeXProps) {
  const html = useMemo(
    () =>
      katex.renderToString(ekspresi, {
        displayMode,
        output: "htmlAndMathml",
        throwOnError: false,
        strict: "warn",
        trust: false,
      }),
    [displayMode, ekspresi],
  );

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Panel model matematika bersama untuk seluruh simulasi Kinematika. */
export default function ModelMatematika({
  judul = "Model Matematika",
  deskripsi,
  persamaan,
  variabel,
  catatan,
}: Props) {
  return (
    <section className="model-matematika" aria-label={judul}>
      <header className="model-matematika-header">
        <h2>{judul}</h2>
        <p>{deskripsi}</p>
      </header>

      <div className="model-matematika-grid">
        {persamaan.map((item) => (
          <article className="model-matematika-persamaan" key={item.judul}>
            <h3>{item.judul}</h3>
            <div className="model-matematika-ekspresi">
              <LaTeX ekspresi={item.latex} displayMode />
            </div>
            {item.penjelasan && (
              <p className="model-matematika-penjelasan">
                {item.penjelasan}
              </p>
            )}
          </article>
        ))}
      </div>

      <section className="model-matematika-variabel" aria-label="Keterangan simbol">
        <h3>Keterangan simbol dan satuan SI</h3>
        <dl className="model-matematika-daftar-variabel">
          {variabel.map((item) => (
            <div className="model-matematika-variabel-item" key={item.simbol}>
              <dt>
                <LaTeX ekspresi={item.simbol} />
              </dt>
              <dd>
                <span className="model-matematika-nama-variabel">
                  {item.nama}
                </span>
                <span className="model-matematika-satuan">
                  {item.satuan}
                </span>
                {item.deskripsi && (
                  <span className="model-matematika-deskripsi-variabel">
                    {item.deskripsi}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {catatan && (
        <div className="model-matematika-catatan">
          <strong>Catatan model</strong>
          <div>{catatan}</div>
        </div>
      )}
    </section>
  );
}
