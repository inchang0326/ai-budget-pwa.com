import { useEffect, useRef, useState } from "react";
import type { Transaction, TransactionType } from "../../../types";
import { TRANSACTION_TYPES } from "../../../types";
import "./WordCloudChart.css";

interface WordCloudChartProps {
  transactions: Transaction[];
}

interface WordItem {
  text: string;
  size: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
}

const WordCloudChart = ({ transactions }: WordCloudChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<WordItem[]>([]);

  useEffect(() => {
    const categoryMap = new Map<
      string,
      { amount: number; type: TransactionType }
    >();

    transactions.forEach((transaction) => {
      const existing = categoryMap.get(transaction.category);
      if (existing) {
        existing.amount += transaction.amount;
      } else {
        categoryMap.set(transaction.category, {
          amount: transaction.amount,
          type: transaction.type,
        });
      }
    });

    const data = Array.from(categoryMap.entries());
    if (data.length === 0) {
      setWords([]);
      return;
    }

    const maxAmount = Math.max(...data.map(([, d]) => d.amount));
    const containerWidth = 600;
    const containerHeight = 400;

    // 단어들을 원형으로 배치
    const radius = Math.min(containerWidth, containerHeight) / 3;
    const angleStep = (2 * Math.PI) / data.length;

    const newWords: WordItem[] = data.map(([category, categoryData], index) => {
      const size = 16 + (categoryData.amount / maxAmount) * 40;
      const angle = index * angleStep + Math.random() * 0.5; // 약간의 랜덤성 추가
      const r = radius * (0.3 + Math.random() * 0.7); // 반지름에도 변화 추가

      // 원형 배치에서 약간의 변형
      const x = containerWidth / 2 + Math.cos(angle) * r;
      const y = containerHeight / 2 + Math.sin(angle) * r;

      // 회전 각도
      const rotations = [0, 15, -15, 30, -30, 45, -45, 60, -60, 90, -90];
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];

      return {
        text: category,
        size,
        color:
          categoryData.type === TRANSACTION_TYPES.INCOME
            ? "#059669"
            : "#3b82f6",
        x,
        y,
        rotation,
      };
    });

    setWords(newWords);
  }, [transactions]);

  if (words.length === 0) {
    return (
      <div className="wordcloud-chart-section">
        <div className="no-data">데이터가 없습니다</div>
      </div>
    );
  }

  return (
    <div className="wordcloud-chart-section" ref={containerRef}>
      <div className="wordcloud-svg">
        <svg width="600" height="400" viewBox="0 0 600 400">
          {words.map((word, index) => (
            <text
              key={`${word.text}-${index}`}
              x={word.x}
              y={word.y}
              fontSize={word.size}
              fill={word.color}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${word.rotation} ${word.x} ${word.y})`}
            >
              <title>{word.text}</title>
              {word.text}
            </text>
          ))}
        </svg>
      </div>
      <div className="wordcloud-legend">
        <div className="legend-item">
          <div className="legend-color income-color" />
          <span>수입</span>
        </div>
        <div className="legend-item">
          <div className="legend-color expense-color" />
          <span>지출</span>
        </div>
      </div>
    </div>
  );
};

export default WordCloudChart;
