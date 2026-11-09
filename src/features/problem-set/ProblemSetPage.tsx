import { useEffect, useState } from "react";
import ProblemSetHub from "./ProblemSetHub";
import ProblemSetWorkspace from "./ProblemSetWorkspace";
import {
  BANK_SOAL_PROBLEM_SET,
  bacaProgresProblemSet,
  periksaJawaban,
  simpanProgresProblemSet,
  type ProgresProblemSet,
} from "./dataProblemSet";
import "./ProblemSet.css";

/** Pengarah dashboard dan lembar latihan Problem Set. */
export default function ProblemSetPage() {
  const [progres, setProgres] = useState<ProgresProblemSet>(bacaProgresProblemSet);
  const [topikAktifId, setTopikAktifId] = useState<string | null>(null);
  const [indeksSoal, setIndeksSoal] = useState(0);

  useEffect(() => {
    simpanProgresProblemSet(progres);
  }, [progres]);

  const topikAktif = BANK_SOAL_PROBLEM_SET.find((topik) => topik.id === topikAktifId) ?? null;
  const topikSudahDikumpulkan = Boolean(topikAktif && progres.topikDikumpulkan?.[topikAktif.id]);

  function bukaTopik(topikId: string) {
    setTopikAktifId(topikId);
    setIndeksSoal(0);
  }

  function ubahDraf(soalId: string, jawaban: string) {
    setProgres((sebelumnya) => ({
      ...sebelumnya,
      drafJawaban: { ...sebelumnya.drafJawaban, [soalId]: jawaban },
    }));
  }

  function kumpulkanTopik() {
    if (!topikAktif) return;
    const jawabanTopik = topikAktif.soal.map((soal) => ({
      soal,
      jawaban: progres.drafJawaban?.[soal.id]?.trim() ?? "",
    }));
    if (jawabanTopik.some(({ jawaban }) => !jawaban)) return;

    const waktuDiperiksa = new Date().toISOString();
    const percobaanBaru = { ...progres.percobaan };
    for (const { soal, jawaban } of jawabanTopik) {
      percobaanBaru[soal.id] = {
        jawaban,
        benar: periksaJawaban(soal, jawaban),
        diperiksa: true,
        waktuDiperiksa,
      };
    }

    setProgres((sebelumnya) => ({
      ...sebelumnya,
      percobaan: percobaanBaru,
      topikDikumpulkan: { ...sebelumnya.topikDikumpulkan, [topikAktif.id]: true },
    }));
  }

  function ulangiTopik() {
    if (!topikAktif) return;
    const idSoalTopik = new Set(topikAktif.soal.map((soal) => soal.id));
    const percobaan = { ...progres.percobaan };
    const drafJawaban = { ...progres.drafJawaban };
    for (const id of idSoalTopik) {
      delete percobaan[id];
      delete drafJawaban[id];
    }
    setProgres((sebelumnya) => ({
      ...sebelumnya,
      percobaan,
      drafJawaban,
      topikDikumpulkan: { ...sebelumnya.topikDikumpulkan, [topikAktif.id]: false },
    }));
    setIndeksSoal(0);
  }

  if (!topikAktif) {
    return <ProblemSetHub progres={progres} onPilihTopik={bukaTopik} />;
  }

  return (
    <ProblemSetWorkspace
      key={topikAktif.id}
      topik={topikAktif}
      indeksSoal={indeksSoal}
      drafJawaban={progres.drafJawaban ?? {}}
      percobaan={progres.percobaan}
      sudahDikumpulkan={topikSudahDikumpulkan}
      onKembali={() => setTopikAktifId(null)}
      onPilihSoal={setIndeksSoal}
      onUbahDraf={ubahDraf}
      onKumpulkan={kumpulkanTopik}
      onUlangi={ulangiTopik}
    />
  );
}
