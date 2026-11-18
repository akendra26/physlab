import { useEffect, useRef, useState } from "react";

type CanvasSize = { width: number; height: number; pixelRatio: number };

/** Mengukur lebar host dengan ResizeObserver; ukuran backing canvas selalu mengikuti ukuran CSS aktual. */
export default function useCanvasDimensions(aspectRatio = 16 / 9, minHeight = 220) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 760, height: Math.max(minHeight, Math.round(760 / aspectRatio)), pixelRatio: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement ?? canvas;
    let frame = 0;
    const update = (inputWidth: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = Math.max(1, Math.round(inputWidth || host.getBoundingClientRect().width || 760));
        const height = Math.max(1, Math.round(width / aspectRatio));
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        setSize((previous) => previous.width === width && previous.height === height && previous.pixelRatio === pixelRatio
          ? previous
          : { width, height, pixelRatio });
      });
    };
    update(host.getBoundingClientRect().width);
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => update(entries[0]?.contentRect.width ?? host.clientWidth));
      observer.observe(host);
      return () => { cancelAnimationFrame(frame); observer.disconnect(); };
    }
    const onResize = () => update(host.getBoundingClientRect().width);
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); };
  }, [aspectRatio, minHeight]);

  return { canvasRef, ...size };
}
