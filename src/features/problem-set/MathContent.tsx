import * as katex from "katex";
import "katex/dist/katex.min.css";

type MathContentProps = {
  children: string;
  className?: string;
};

const POLA_MATEMATIKA = /(\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;

/** Merender teks biasa dan rumus LaTeX campuran menggunakan KaTeX lokal. */
export default function MathContent({ children, className = "" }: MathContentProps) {
  const bagian = children.split(POLA_MATEMATIKA).filter((item) => item.length > 0);

  return (
    <div className={`ps-math-content ${className}`.trim()}>
      {bagian.map((item, indeks) => {
        const display = item.startsWith("\\[") || item.startsWith("$$");
        const matematika = item.startsWith("\\[") || item.startsWith("\\(") || item.startsWith("$$") || item.startsWith("$");

        if (!matematika) {
          return <span className="ps-prose" key={`teks-${indeks}`}>{item}</span>;
        }

        const latex = display
          ? item.slice(2, -2).trim()
          : item.startsWith("\\(")
            ? item.slice(2, -2).trim()
            : item.slice(1, -1).trim();

        const html = katex.renderToString(latex, {
          displayMode: display,
          throwOnError: false,
          strict: "ignore",
          trust: false,
          output: "htmlAndMathml",
        });

        return display ? (
          <div
            className="ps-math-display"
            key={`rumus-${indeks}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <span
            className="ps-math-inline"
            key={`rumus-${indeks}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </div>
  );
}