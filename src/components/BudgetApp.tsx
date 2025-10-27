import BudgetSummary from "./BudgetSummary";
import DataSelectContainr from "./data/DataSelectContainer";
import ChartContainer from "./charts/ChartContainer";
import TransactionContainer from "./transactions/TransactionContainer";
import "./BudgetApp.css";
import { BudgetProvider } from "../contexts/BudgetContext";

const BudgetApp = () => {
  console.log("BudgetApp Rendering");

  return (
    <BudgetProvider>
      <div className="budget-app">
        <div className="budget-container">
          <header className="app-header">
            <h1>가계부</h1>
            <DataSelectContainr></DataSelectContainr>
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
