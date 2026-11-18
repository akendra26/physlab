import { useCallback, useEffect, useRef, useState } from "react";

/** Jam simulasi bersama. Mode tanpa batas membiarkan waktu terus bertambah; model visual dapat membatasi objek pada boundary. */
export default function usePlayback(durasi: number) {
  const [waktu, setWaktu] = useState(0);
  const [berjalan, setBerjalan] = useState(false);
  const [pengaliKecepatan, setPengaliKecepatan] = useState(1);
  const [tanpaBatas, setTanpaBatas] = useState(false);
  const referensiWaktu = useRef(0);

  const aturWaktu = useCallback((nilai: number) => {
    const aman = Math.max(0, Number.isFinite(nilai) ? nilai : 0);
    referensiWaktu.current = aman;
    setWaktu(aman);
  }, []);

  const aturUlang = useCallback(() => {
    setBerjalan(false);
    aturWaktu(0);
  }, [aturWaktu]);

  const mulaiJeda = useCallback(() => {
    if (berjalan) {
      setBerjalan(false);
      return;
    }
    if (!tanpaBatas && durasi <= 0) return;
    if (!tanpaBatas && waktu >= durasi - 1e-5) aturWaktu(0);
    setBerjalan(true);
  }, [aturWaktu, berjalan, durasi, tanpaBatas, waktu]);

  useEffect(() => {
    if (!berjalan) return;

    let nomorBingkai = 0;
    let capWaktuSebelumnya: number | null = null;
    let akumulatorUi = 0;
    const intervalUi = 1 / 30;

    const animasikan = (capWaktu: number) => {
      if (capWaktuSebelumnya === null) capWaktuSebelumnya = capWaktu;
      const selang = Math.min((capWaktu - capWaktuSebelumnya) / 1000, 0.05);
      capWaktuSebelumnya = capWaktu;
      const berikutnya = referensiWaktu.current + selang * pengaliKecepatan;
      akumulatorUi += selang;

      if (!tanpaBatas && berikutnya >= durasi) {
        // Jika parameter durasi diperkecil melewati t yang sudah tercapai,
        // hentikan jam tanpa memundurkan atau me-reset waktu simulasi.
        const waktuAkhir = referensiWaktu.current >= durasi ? referensiWaktu.current : durasi;
        aturWaktu(waktuAkhir);
        setBerjalan(false);
        return;
      }

      // Physics time remains frame-based, but React only re-renders the page at 30 FPS.
      referensiWaktu.current = berikutnya;
      if (akumulatorUi >= intervalUi) {
        akumulatorUi %= intervalUi;
        setWaktu(berikutnya);
      }
      nomorBingkai = requestAnimationFrame(animasikan);
    };

    nomorBingkai = requestAnimationFrame(animasikan);
    return () => cancelAnimationFrame(nomorBingkai);
  }, [aturWaktu, berjalan, durasi, pengaliKecepatan, tanpaBatas]);

  return {
    waktu,
    berjalan,
    pengaliKecepatan,
    tanpaBatas,
    aturWaktu,
    aturUlang,
    mulaiJeda,
    setBerjalan,
    setPengaliKecepatan,
    setTanpaBatas,
  };
}
