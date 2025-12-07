import type { Transaction } from "../../../types";
import { TRANSACTION_TYPES } from "../../../types";
import { formatCurrency } from "../../../utils";
import "./BarChart.css";

interface BarChartProps {
  transactions: Transaction[];
}

const BarChart = ({ transactions }: BarChartProps) => {
  const totalIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const maxAmount = Math.max(totalIncome, totalExpense);

  if (maxAmount === 0) {
    return (
      <div className="bar-chart">
        <div className="bar-chart__no-data">데이터가 없습니다</div>
      </div>
    );
  }

  return (
    <div className="bar-chart-section">
      <div className="bar-chart">
        <div className="bar-chart__group">
          <div className="bar-chart__bars">
            <div
              className="bar-chart__bar bar-chart__bar--income"
              style={{ height: `${(totalIncome / maxAmount) * 100}%` }}
              title={`총 수입: ${formatCurrency(totalIncome)}`}
            />
          </div>
          <div className="bar-chart__amount">{formatCurrency(totalIncome)}</div>
        </div>

        <div className="bar-chart__group">
          <div className="bar-chart__bars">
            <div
              className="bar-chart__bar bar-chart__bar--expense"
              style={{ height: `${(totalExpense / maxAmount) * 100}%` }}
              title={`총 지출: ${formatCurrency(totalExpense)}`}
            />
          </div>
          <div className="bar-chart__amount">{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      <div className="bar-chart__legend">
        <div className="bar-chart__legend-item">
          <div className="bar-chart__legend-color bar-chart__legend-color--income" />
          <span>총 수입</span>
        </div>
        <div className="bar-chart__legend-item">
          <div className="bar-chart__legend-color bar-chart__legend-color--expense" />
          <span>총 지출</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
