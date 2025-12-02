import { memo } from "react";
import "./OpenBankingCardItem.css";
import type { OpenBankingCardType } from "../../../types";

interface OpenBankingCardItemProps {
  card: OpenBankingCardType;
  selected: boolean;
  onSelect: (cardNo: string) => void;
}

const OpenBankingCardItem = ({
  card,
  selected,
  onSelect,
}: OpenBankingCardItemProps) => {
  console.log("OpenBankingCardItem Rendering");
  return (
    <div
      className={`card-item ${selected ? "card-item-selected" : ""}`}
      onClick={() => onSelect(card.finCardNo)}
    >
      <div className="card-checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(card.finCardNo)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="card-info">
        <div className="card-name">{card.name}</div>
        <div className="card-details">
          <span className="card-number">{card.no}</span>
          <span className="card-company">{card.company}</span>
        </div>
        {card.syncAt && (
          <div className="card-sync-date">최신 동기화 일자: {card.syncAt}</div>
        )}
      </div>
    </div>
  );
};

export default memo(OpenBankingCardItem);
