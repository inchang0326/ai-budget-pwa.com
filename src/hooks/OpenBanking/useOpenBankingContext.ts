import { useContext } from "react";
import type { OpenBankingContextType } from "../../contexts/OpenBankingContext";
import OpenBankingContext from "../../contexts/OpenBankingContext";

export const useOpenBankingContext = (): OpenBankingContextType => {
  const ctx = useContext(OpenBankingContext);
  if (!ctx) {
    throw new Error(
      "useOpenBankingContext must be used within <OpenBankingProvider>"
    );
  }
  return ctx;
};
