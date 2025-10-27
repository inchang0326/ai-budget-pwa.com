import { useBudgetContext } from "../hooks/Budget/useBudgetContext";
import type { Transaction } from "../types";
import { TRANSACTION_TYPES } from "../types";
import { formatCurrency } from "../utils";

const BudgetSummary = () => {
  console.log("Summary Rendering");

  const { states } = useBudgetContext();
  const transactions: Array<Transaction> = states.transactions ?? [];

  const totalIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="summary-section">
      <div className="summary-card total-balance">
        <div className="summary-label">총 잔액</div>
        <div
          className={`summary-amount ${
            totalBalance >= 0 ? "positive" : "negative"
          }`}
        >
          {formatCurrency(totalBalance)}
        </div>
      </div>

      <div className="summary-card income">
        <div className="summary-label">수입</div>
        <div className="summary-amount positive">
          {formatCurrency(totalIncome)}
        </div>
      </div>

      <div className="summary-card expense">
        <div className="summary-label">지출</div>
        <div className="summary-amount negative">
          {formatCurrency(totalExpense)}
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
