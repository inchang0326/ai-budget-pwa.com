import { useContext } from "react";
import type { BudgetContextType } from "../contexts/BudgetContext";
import BudgetContext from "../contexts/BudgetContext";

export const useBudgetContext = (): BudgetContextType => {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error("useBudgetContext must be used within <BudgetProvider>");
  }
  return ctx;
};
