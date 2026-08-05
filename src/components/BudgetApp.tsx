import BudgetSummary from "./BudgetSummary";
import DataSelectContainer from "./data/DataSelectContainer";
import ChartContainer from "./charts/ChartContainer";
import TransactionContainer from "./transactions/TransactionContainer";
import "./BudgetApp.css";
import { BudgetProvider } from "../contexts/BudgetContext";

import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

const BudgetApp = () => {
  const { signOut } = useAuth();

  return (
    <BudgetProvider>
      <div className="budget-app">
        <div className="budget-container">
          <header className="app-header">
            <div className="app-header__top">
              <h1 className="app-header__title">가계부</h1>
              <button className="logout-button" onClick={signOut} title="로그아웃">
                <LogOut size={20} />
              </button>
            </div>
            <DataSelectContainer></DataSelectContainer>
          </header>
          <BudgetSummary></BudgetSummary>
          <ChartContainer></ChartContainer>
          <TransactionContainer></TransactionContainer>
        </div>
      </div>
    </BudgetProvider>
  );
};

export default BudgetApp;
