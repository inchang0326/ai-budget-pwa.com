import { useBudgetContext } from "../hooks/Budget/useBudgetContext";
import type { Transaction } from "../types";
import { TRANSACTION_TYPES } from "../types";
import { formatCurrency } from "../utils";

import "./BudgetSummary.css";

const BudgetSummary = () => {
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
      <div className="summary-card summary-card--total">
        <div className="summary-card__label">총 잔액</div>
        <div
          className={`summary-card__amount ${
            totalBalance >= 0 ? "summary-card__amount--positive" : "summary-card__amount--negative"
          }`}
        >
          {formatCurrency(totalBalance)}
        </div>
      </div>

      <div className="summary-card summary-card--income">
        <div className="summary-card__label">수입</div>
        <div className="summary-card__amount summary-card__amount--positive">
          {formatCurrency(totalIncome)}
        </div>
      </div>

      <div className="summary-card summary-card--expense">
        <div className="summary-card__label">지출</div>
        <div className="summary-card__amount summary-card__amount--negative">
          {formatCurrency(totalExpense)}
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;
