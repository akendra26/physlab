import { createContext, useContext } from "react";

export type Bahasa = "id" | "en";

/** Bahasa global untuk komponen kontrol yang membutuhkan lokalisasi konsisten. */
export const BahasaContext = createContext<Bahasa>("id");

export function useBahasa(): Bahasa {
  return useContext(BahasaContext);
}
