import { useState } from "react";
import type { DateRangeType } from "../../types";
import "./DataSelectContainer.css";
import { useBudgetContext } from "../../hooks/Budget/useBudgetContext";
import syncIcon from "/sync-icon.jpg";
import OpenBankingCardListModal from "./OpenBankingCardListModal/OpenBankingCardListModal";
import { OpenBankingProvider } from "../../contexts/OpenBankingContext";

const DataSelectContainer = () => {
  const { states, actions } = useBudgetContext();
  const selectedDate: DateRangeType = states.selectedDate;
  const years = Array.from({ length: 5 }, (_, i) => selectedDate.year - 4 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <div className="data-selector">
        <div className="data-selector__sync-wrapper">
          <button
            className="data-selector__sync-btn"
            onClick={() => setShowModal(true)}
            title="금융사 API 동기화"
          >
            <img src={syncIcon} className="data-selector__sync-icon" alt="동기화" />
          </button>
        </div>

        <select
          value={selectedDate.year}
          onChange={(e) =>
            actions.changeDate({
              ...selectedDate,
              year: parseInt(e.target.value),
            })
          }
          className="data-selector__select"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
        <select
          value={selectedDate.month}
          onChange={(e) =>
            actions.changeDate({
              ...selectedDate,
              month: parseInt(e.target.value),
            })
          }
          className="data-selector__select"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </select>
      </div>

      {showModal && (
        <OpenBankingProvider>
          <OpenBankingCardListModal
            setShowModal={setShowModal}
          ></OpenBankingCardListModal>
        </OpenBankingProvider>
      )}
    </>
  );
};

export default DataSelectContainer;
