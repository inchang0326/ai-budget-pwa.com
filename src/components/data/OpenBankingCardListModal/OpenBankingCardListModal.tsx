import { useState, useEffect, memo, useCallback, useMemo } from "react";
import "./OpenBankingCardListModal.css";
import type { OpenBankingCardType } from "../../../types";
import { ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL } from "../../../const";
import OpenBankingCardItem from "../OpenBankingCardItem/OpenBankingCardItem";

// Context API + useReducer 사용, react-query wrapping Axios 연결
const targetCardList: Array<OpenBankingCardType> = [
  {
    no: "1234-****-****-5678",
    name: "신한카드",
    company: "신한카드",
    syncAt: "2025-10-26",
  },
  {
    no: "9876-****-****-1234",
    name: "삼성카드",
    company: "삼성카드",
    syncAt: "2025-10-25",
  },
  {
    no: "5555-****-****-6666",
    name: "국민카드",
    company: "KB국민카드",
    syncAt: "2025-10-24",
  },
  {
    no: "7777-****-****-8888",
    name: "현대카드",
    company: "현대카드",
    syncAt: "2025-10-23",
  },
  {
    no: "3333-****-****-4444",
    name: "우리카드",
    company: "우리카드",
    syncAt: "2025-10-22",
  },
  {
    no: "2222-****-****-3333",
    name: "하나카드",
    company: "하나카드",
    syncAt: "2025-10-21",
  },
  {
    no: "4444-****-****-5555",
    name: "롯데카드",
    company: "롯데카드",
    syncAt: "2025-10-20",
  },
  {
    no: "6666-****-****-7777",
    name: "NH농협카드",
    company: "NH농협카드",
    syncAt: "2025-10-19",
  },
];

interface OpenBankingCardListModalProps {
  setShowModal: (showModal: boolean) => void;
  onSync: (selectedCardList: Set<string>) => void;
}

const OpenBankingCardListModal = ({
  setShowModal,
  onSync,
}: OpenBankingCardListModalProps) => {
  console.log("OpenBankingCardListModal Rendering");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCardList, setSelectedCardList] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // close modal by ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, []);

  // close modal by clicking modal-overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // for pagination
  const totalPages = Math.ceil(
    targetCardList.length / ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL
  );

  const currentCardList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL;
    const endIndex = startIndex + ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL;
    return targetCardList.slice(startIndex, endIndex);
  }, [targetCardList, currentPage]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // for selecting a card to be synchronized
  const toggleSelectCard = useCallback((cardNo: string) => {
    setSelectedCardList((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(cardNo)) {
        newSelection.delete(cardNo);
      } else {
        newSelection.add(cardNo);
      }
      return newSelection;
    });
  }, []);

  const isAllSelected =
    targetCardList.length > 0 &&
    selectedCardList.size === targetCardList.length;

  const isIndeterminate =
    selectedCardList.size > 0 && selectedCardList.size < targetCardList.length;

  const toggleSelectAllCards = () => {
    if (isAllSelected) {
      setSelectedCardList(new Set());
    } else {
      const allCardNoList = new Set(targetCardList.map((card) => card.no));
      setSelectedCardList(allCardNoList);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            가계부에 사용 내역을 동기화할 카드를 선택해 주세요.
          </h2>
          <button
            className="modal-close-btn"
            onClick={() => setShowModal(false)}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {targetCardList.length === 0 ? (
            <div className="modal-empty">
              <p>금융결제원 오픈뱅킹에 등록된 카드가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="select-all-container">
                <div className="select-all-checkbox">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isIndeterminate;
                      }
                    }}
                    onChange={toggleSelectAllCards}
                  />
                  <label htmlFor="select-all">
                    전체 선택 ({selectedCardList.size}/{targetCardList.length})
                  </label>
                </div>
              </div>

              <div className="card-list">
                {currentCardList.map((card) => (
                  <OpenBankingCardItem
                    key={card.no}
                    card={card}
                    selected={selectedCardList.has(card.no)}
                    onSelect={toggleSelectCard}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    aria-label="이전 페이지"
                  >
                    ‹
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          className={`pagination-number ${
                            currentPage === pageNum
                              ? "pagination-number-active"
                              : ""
                          }`}
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-footer-info">
            {selectedCardList.size > 0 && (
              <span className="selected-count">
                {selectedCardList.size}개 선택됨
              </span>
            )}
          </div>
          <div className="modal-footer-actions">
            <button
              className="btn-base btn-secondary"
              onClick={() => setShowModal(false)}
            >
              취소
            </button>
            <button
              className="btn-base btn-primary"
              onClick={() => {
                if (
                  window.confirm(
                    `선택한 ${selectedCardList.size}개의 카드를 동기화하시겠습니까?`
                  )
                ) {
                  onSync(selectedCardList);
                }
              }}
              disabled={selectedCardList.size === 0}
            >
              동기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OpenBankingCardListModal);
