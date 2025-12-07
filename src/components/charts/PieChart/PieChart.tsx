import { useState, useMemo } from "react";
import type { Transaction, TransactionType } from "../../../types";
import { TRANSACTION_TYPES } from "../../../types";
import { formatCurrencyCompact } from "../../../utils";
import "./PieChart.css";

interface PieChartProps {
  transactions: Transaction[];
}

const PieChart = ({ transactions }: PieChartProps) => {
  const [chartType, setChartType] = useState<TransactionType>(
    TRANSACTION_TYPES.EXPENSE
  );

  const getData = (type: TransactionType) => {
    const categoryData = transactions
      .filter((t) => t.type === type)
      .reduce((acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.fromEntries(
      // descending order by amount
      Object.entries(categoryData).sort(([, a], [, b]) => b - a)
    );
  };

  const currentData = useMemo(
    () => getData(chartType),
    [transactions, chartType]
  );
  const total = useMemo(
    () => Object.values(currentData).reduce((sum, amount) => sum + amount, 0),
    [currentData]
  );

  const generateGradientColors = (
    type: TransactionType,
    count: number
  ): string[] => {
    if (count === 0) return [];

    const colors: string[] = [];

    if (type === TRANSACTION_TYPES.INCOME) {
      const baseColors = [
        "#10b981",
        "#34d399",
        "#6ee7b7",
        "#a7f3d0",
        "#d1fae5",
      ];
      for (let i = 0; i < count; i++) {
        if (i < baseColors.length) {
          colors.push(baseColors[i]);
        } else {
          const hue = 142;
          const saturation = Math.max(85 - (i - 5) * 10, 40);
          const lightness = Math.min(50 + (i - 5) * 8, 85);
          colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
      }
    } else {
      const baseColors = [
        "#3b82f6",
        "#60a5fa",
        "#93c5fd",
        "#bfdbfe",
        "#dbeafe",
      ];
      for (let i = 0; i < count; i++) {
        if (i < baseColors.length) {
          colors.push(baseColors[i]);
        } else {
          const hue = 220;
          const saturation = Math.max(85 - (i - 5) * 10, 40);
          const lightness = Math.min(55 + (i - 5) * 8, 85);
          colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
      }
    }

    return colors;
  };

  const colors = useMemo(
    () => generateGradientColors(chartType, Object.keys(currentData).length),
    [chartType, currentData]
  );

  const TypeSelector = () => (
    <div className="pie-chart__type-selector">
      <button
        className={`pie-chart__type-btn ${
          chartType === TRANSACTION_TYPES.INCOME ? "pie-chart__type-btn--active" : ""
        }`}
        onClick={() => setChartType(TRANSACTION_TYPES.INCOME)}
      >
        수입
      </button>
      <button
        className={`pie-chart__type-btn ${
          chartType === TRANSACTION_TYPES.EXPENSE ? "pie-chart__type-btn--active" : ""
        }`}
        onClick={() => setChartType(TRANSACTION_TYPES.EXPENSE)}
      >
        지출
      </button>
    </div>
  );

  if (total === 0) {
    return (
      <div className="pie-chart__section">
        <TypeSelector />
        <div className="pie-chart__no-data">
          {chartType === TRANSACTION_TYPES.INCOME ? "수입" : "지출"} 데이터가
          없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="pie-chart__section">
      <TypeSelector />

      <div className="pie-chart__content">
        <svg className="pie-chart__svg" viewBox="0 0 100 100">
          {Object.entries(currentData).length === 1 ? (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill={colors[0]}
              stroke="white"
              strokeWidth="0.5"
            />
          ) : (
            (() => {
              let cumulativePercentage = 0;
              return Object.entries(currentData).map(
                ([category, amount], index) => {
                  const percentage = (amount / total) * 100;
                  const startAngle = cumulativePercentage * 3.6;
                  const endAngle = (cumulativePercentage + percentage) * 3.6;

                  const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);

                  const largeArcFlag = percentage > 50 ? 1 : 0;

                  const pathData = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  cumulativePercentage += percentage;

                  return (
                    <path
                      key={`${chartType}-${category}`}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  );
                }
              );
            })()
          )}
        </svg>

        <div className="pie-chart__legend">
          {Object.entries(currentData).map(([category, amount], index) => {
            const percentage = ((amount / total) * 100).toFixed(1);
            return (
              <div key={`legend-${category}`} className="pie-chart__legend-item">
                <div
                  className="pie-chart__legend-color"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="pie-chart__legend-label">{category}</span>
                <div className="pie-chart__legend-info">
                  <span className="pie-chart__legend-amount">
                    {formatCurrencyCompact(amount)}
                  </span>
                  <span className="pie-chart__legend-percentage">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
