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
  return (
    <div
      className={`card-item ${selected ? "card-item--selected" : ""}`}
      onClick={() => onSelect(card.finCardNo)}
    >
      <div className="card-item__checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(card.finCardNo)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="card-item__info">
        <div className="card-item__name">{card.name}</div>
        <div className="card-item__details">
          <span className="card-item__number">{card.no}</span>
          <span className="card-item__company">{card.company}</span>
        </div>
        {card.syncAt && (
          <div className="card-item__sync-date">최신 동기화 일자: {card.syncAt}</div>
        )}
      </div>
    </div>
  );
};

export default memo(OpenBankingCardItem);
