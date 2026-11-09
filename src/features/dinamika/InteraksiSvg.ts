import type { PointerEvent as ReactPointerEvent } from "react";

/** Mengubah koordinat penunjuk layar menjadi koordinat viewBox SVG. */
export function dapatkanTitikSvg(event: ReactPointerEvent<SVGElement>) {
  const target = event.currentTarget;
  const svg = target instanceof SVGSVGElement ? target : target.ownerSVGElement;
  if (!svg) return null;
  const matriks = svg.getScreenCTM();
  if (!matriks) return null;

  const titik = svg.createSVGPoint();
  titik.x = event.clientX;
  titik.y = event.clientY;
  const hasil = titik.matrixTransform(matriks.inverse());
  return { x: hasil.x, y: hasil.y };
}

export function batasi(nilai: number, minimum: number, maksimum: number) {
  return Math.max(minimum, Math.min(maksimum, nilai));
}