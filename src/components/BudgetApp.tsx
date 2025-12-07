import BudgetSummary from "./BudgetSummary";
import DataSelectContainer from "./data/DataSelectContainer";
import ChartContainer from "./charts/ChartContainer";
import TransactionContainer from "./transactions/TransactionContainer";
import "./BudgetApp.css";
import { BudgetProvider } from "../contexts/BudgetContext";

const BudgetApp = () => {
  return (
    <BudgetProvider>
      <div className="budget-app">
        <div className="budget-container">
          <header className="app-header">
            <h1 className="app-header__title">가계부</h1>
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
