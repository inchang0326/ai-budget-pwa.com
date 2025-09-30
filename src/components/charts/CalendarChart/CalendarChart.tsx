import React, { useState } from "react";
import type { Transaction, DateRangeType } from "../../../types";
import { TRANSACTION_TYPES } from "../../../types";
import { formatCurrencyCompact } from "../../../utils";
import "./CalendarChart.css";
import dayjs from "dayjs";

interface CalendarChartProps {
  transactions: Transaction[];
  selectedDate: DateRangeType;
}

type TooltipType = {
  day: number;
  transactions: Transaction[];
  x: number;
  y: number;
};

const CalendarChart = ({ transactions, selectedDate }: CalendarChartProps) => {
  console.log("CalendarChart Rendering");
  const [tooltip, setTooltip] = useState<TooltipType | null>(null);

  const getDaysInMonth = () => {
    const currentMonth = dayjs()
      .year(selectedDate.year)
      .month(selectedDate.month - 1);

    const firstDayOfWeek = currentMonth.startOf("month").day(); // first day of week in current month
    const daysInMonth = currentMonth.daysInMonth(); // days of current month

    const empty = Array.from({ length: firstDayOfWeek }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return [...empty, ...days];
  };

  // retrieve for transactions based on the day
  const getTransactionForDay = (day: number | null) => {
    if (!day) return [];
    return transactions.filter((t) => dayjs(t.date).date() === day);
  };

  // calendar hover event
  const handleMouseEnter = (day: number, event: React.MouseEvent) => {
    const dayTransactions = getTransactionForDay(day);
    if (dayTransactions.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect(); // absolute location on the screen
      setTooltip({
        day, // the selected day
        transactions: dayTransactions, // show transactions
        x: rect.left + rect.width / 2, // middle of element
        y: rect.top - 10, // upper 10px of element
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      <div className="calendar-chart-section">
        <div className="calendar-grid">
          {/* day of week in calendar */}
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="calendar-header">
              {day}
            </div>
          ))}
          {/* days in calendar */}
          {getDaysInMonth().map((day, index) => {
            if (!day) {
              return <div key={index} className="calendar-empty" />;
            }
            const dayTransactions = getTransactionForDay(day);
            const totalIncome = dayTransactions
              .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
              .reduce((sum, t) => sum + t.amount, 0);
            const totalExpense = dayTransactions
              .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
              .reduce((sum, t) => sum + t.amount, 0);

            return (
              <div
                key={index}
                className="calendar-day"
                onMouseEnter={(e) => handleMouseEnter(day, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="day-number">{day}</div>
                {totalIncome > 0 && (
                  <div className="day-income">
                    +{formatCurrencyCompact(totalIncome)}
                  </div>
                )}
                {totalExpense > 0 && (
                  <div className="day-expense">
                    -{formatCurrencyCompact(totalExpense)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {tooltip && (
        <div
          className="calendar-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="tooltip-header">{tooltip.day}일 거래 내역</div>
          {tooltip.transactions.map((transaction) => (
            <div key={transaction.id} className="tooltip-item">
              <span className="tooltip-category">{transaction.category}</span>
              <span className={`tooltip-amount ${transaction.type}`}>
                {transaction.type === TRANSACTION_TYPES.INCOME ? "+" : "-"}
                {formatCurrencyCompact(transaction.amount)}
              </span>
            </div>
          ))}
          <div className="tooltip-bottom">
            총 {tooltip.transactions.length}건의 거래
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarChart;
