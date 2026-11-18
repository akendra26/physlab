import DinamikaKurikulumSimulasi from "./DinamikaKurikulumSimulasi";
import type { ModulDinamikaId } from "../../config/konfigurasiNavigasi";
import SimulationExperience from "../../components/simulasi/SimulationExperience";
import DinamikaRotasiSimulasi from "./DinamikaRotasiSimulasi";
import "./Dinamika.css";

type Props = { modulAktif: ModulDinamikaId };

/** Shared scale and dock controls wrap every Dynamics module without adding redundant tabs. */
export default function DinamikaPage({ modulAktif }: Props) {
  return (
    <SimulationExperience category="dinamika" moduleKey={modulAktif} showTabs={false}>
      {modulAktif === "rotasi"
        ? <DinamikaRotasiSimulasi />
        : <DinamikaKurikulumSimulasi modulAktif={modulAktif} />}
    </SimulationExperience>
  );
}
