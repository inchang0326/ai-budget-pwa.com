import { useState, useCallback } from "react";
import type { DateRangeType } from "../../types";
import "./DataSelectContainer.css";
import { useBudgetContext } from "../../hooks/useBudgetContext";
import syncIcon from "/sync-icon.jpg";
import OpenBankingCardListModal from "./OpenBankingCardListModal/OpenBankingCardListModal";

const DataSelectContainr = () => {
  console.log("DataSelector Rendering");

  const { states, actions } = useBudgetContext();
  const selectedDate: DateRangeType = states.selectedDate;
  const years = Array.from({ length: 5 }, (_, i) => selectedDate.year - 4 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSyncCardHistory = useCallback(
    async (selectedCardList: Set<string>) => {
      setIsLoading(true);
      try {
        await actions.syncTransactions();
        alert("거래 내역이 성공적으로 동기화되었습니다.");
      } catch (error) {
        console.error("API 동기화 오류:", error);
        alert("동기화 중 오류가 발생했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
        setShowModal(false);
      }
    },
    []
  );

  return (
    <>
      <div className="data-selector">
        <div className="data-synchronizer">
          <button
            className="sync-button"
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            title="금융사 API 동기화"
          >
            {isLoading ? (
              "..."
            ) : (
              <img src={syncIcon} className="sync-button-img" alt="동기화" />
            )}
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
          className="data-select"
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
          className="data-select"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </select>
      </div>

      {showModal && (
        <OpenBankingCardListModal
          setShowModal={setShowModal}
          onSync={handleSyncCardHistory}
        ></OpenBankingCardListModal>
      )}
    </>
  );
};

export default DataSelectContainr;
