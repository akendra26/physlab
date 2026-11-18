import { useEffect, useState } from "react";
import ProblemSetHub from "./ProblemSetHub";
import ProblemSetWorkspace from "./ProblemSetWorkspace";
import {
  BANK_SOAL_PROBLEM_SET,
  bacaProgresProblemSet,
  periksaJawaban,
  simpanProgresProblemSet,
  type ProgresProblemSet,
  type SoalProblemSet,
} from "./dataProblemSet";
import "./ProblemSet.css";
import { useAudioSfx } from "./useAudioSfx";

/** Pengarah dashboard dan lembar latihan Problem Set. */
export default function ProblemSetPage() {
  const [progres, setProgres] = useState<ProgresProblemSet>(bacaProgresProblemSet);
  const [topikAktifId, setTopikAktifId] = useState<string | null>(null);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const { play } = useAudioSfx();

  useEffect(() => {
    simpanProgresProblemSet(progres);
  }, [progres]);

  const topikAktif = BANK_SOAL_PROBLEM_SET.find((topik) => topik.id === topikAktifId) ?? null;

  function bukaTopik(topikId: string) {
    setTopikAktifId(topikId);
    setIndeksSoal(0);
  }

  function periksaDanSimpan(soal: SoalProblemSet, jawaban: string) {
    const benar = periksaJawaban(soal, jawaban);
    play(benar ? "chime" : "click");
    setProgres((sebelumnya) => ({
      ...sebelumnya,
      percobaan: {
        ...sebelumnya.percobaan,
        [soal.id]: {
          jawaban,
          benar,
          diperiksa: true,
          waktuDiperiksa: new Date().toISOString(),
        },
      },
    }));
  }

  if (!topikAktif) {
    return <ProblemSetHub progres={progres} onPilihTopik={bukaTopik} />;
  }

  return (
    <ProblemSetWorkspace
      key={`${topikAktif.id}:${indeksSoal}`}
      topik={topikAktif}
      indeksSoal={indeksSoal}
      percobaan={progres.percobaan}
      onKembali={() => setTopikAktifId(null)}
      onPilihSoal={setIndeksSoal}
      onPeriksa={periksaDanSimpan}
    />
  );
}
