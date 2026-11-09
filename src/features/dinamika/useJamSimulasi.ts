import { useEffect, useRef, useState } from "react";

/** Jam simulasi berbasis requestAnimationFrame; tidak memakai interval yang meloncat. */
export default function useJamSimulasi(durasi: number) {
  const [waktu, setWaktu] = useState(0);
  const [berjalan, setBerjalan] = useState(false);
  const [pengaliKecepatan, setPengaliKecepatan] = useState(1);
  const waktuRef = useRef(0);

  useEffect(() => {
    waktuRef.current = waktu;
  }, [waktu]);

  useEffect(() => {
    if (!berjalan) return undefined;

    let bingkai = 0;
    let sebelumnya = 0;
    const animasikan = (capWaktu: number) => {
      if (sebelumnya === 0) sebelumnya = capWaktu;
      const delta = Math.min((capWaktu - sebelumnya) / 1000, 0.05) * pengaliKecepatan;
      sebelumnya = capWaktu;
      const berikutnya = Math.min(durasi, waktuRef.current + Math.max(0, delta));
      waktuRef.current = berikutnya;
      setWaktu(berikutnya);
      if (berikutnya >= durasi) {
        setBerjalan(false);
        return;
      }
      bingkai = window.requestAnimationFrame(animasikan);
    };

    bingkai = window.requestAnimationFrame(animasikan);
    return () => window.cancelAnimationFrame(bingkai);
  }, [berjalan, durasi, pengaliKecepatan]);

  const aturWaktu = (nilai: number) => {
    const aman = Math.max(0, Math.min(durasi, nilai));
    waktuRef.current = aman;
    setWaktu(aman);
  };

  const aturUlang = () => {
    setBerjalan(false);
    aturWaktu(0);
  };

  return {
    waktu,
    berjalan,
    pengaliKecepatan,
    aturWaktu,
    aturUlang,
    mulaiJeda: () => setBerjalan((aktif) => !aktif && waktuRef.current < durasi),
    setPengaliKecepatan,
  };
}