import { useState } from "react";
import type { Transaction, ChartType, DateRangeType } from "../../types";
import { CHART_OPTIONS, CHART_TYPES } from "../../types";
import CalendarChart from "./CalendarChart/CalendarChart";
import WordCloudChart from "./WordCloudChart/WordCloudChart";
import PieChart from "./PieChart/PieChart";
import BarChart from "./BarChart/BarChart";
import "./ChartContainer.css";
import { useBudgetContext } from "../../hooks/Budget/useBudgetContext";

const ChartContainer = () => {
  const { states } = useBudgetContext();
  const transactions: Array<Transaction> = states.transactions;
  const selectedDate: DateRangeType = states.selectedDate;

  const [selectedChart, setSelectedChart] = useState<ChartType>(
    CHART_TYPES.CALENDAR
  );

  const renderChart = () => {
    switch (selectedChart) {
      case CHART_TYPES.CALENDAR:
        return (
          <CalendarChart
            transactions={transactions}
            selectedDate={selectedDate}
          />
        );
      case CHART_TYPES.WORDCLOUD:
        return <WordCloudChart transactions={transactions} />;
      case CHART_TYPES.PIE:
        return <PieChart transactions={transactions} />;
      case CHART_TYPES.BAR:
        return <BarChart transactions={transactions} />;
      default:
        return (
          <CalendarChart
            transactions={transactions}
            selectedDate={selectedDate}
          />
        );
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-container__tabs">
        {CHART_OPTIONS.map((option) => (
          <button
            key={option.type}
            className={`chart-container__tab ${
              selectedChart === option.type ? "active" : ""
            }`}
            onClick={() => setSelectedChart(option.type)}
          >
            <span className="chart-container__tab-icon">{option.icon}</span>
            <span className="chart-container__tab-label">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="chart-container__content">{renderChart()}</div>
    </div>
  );
};

export default ChartContainer;
