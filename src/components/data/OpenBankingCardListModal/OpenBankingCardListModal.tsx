import { useState, useEffect, memo, useCallback, useMemo } from "react";
import "./OpenBankingCardListModal.css";
import { ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL } from "../../../const";
import OpenBankingCardItem from "../OpenBankingCardItem/OpenBankingCardItem";
import { useOpenBankingContext } from "../../../hooks/OpenBanking/useOpenBankingContext";

interface OpenBankingCardListModalProps {
  setShowModal: (showModal: boolean) => void;
}

const OpenBankingCardListModal = ({
  setShowModal,
}: OpenBankingCardListModalProps) => {
  console.log("OpenBankingCardListModal Rendering");

  const { states, actions } = useOpenBankingContext();

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
    states.cards.length / ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL
  );

  const currentCardList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL;
    const endIndex = startIndex + ITEM_LIMIT_COUNT_PER_PAGE_FOR_MODAL;
    return states.cards.slice(startIndex, endIndex);
  }, [states.cards, currentPage]);

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
    // 함수형 업데이트 패턴
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
    states.cards.length > 0 && selectedCardList.size === states.cards.length;

  const isIndeterminate =
    selectedCardList.size > 0 && selectedCardList.size < states.cards.length;

  const toggleSelectAllCards = () => {
    if (isAllSelected) {
      setSelectedCardList(new Set());
    } else {
      const allCardNoList = new Set(states.cards.map((card) => card.no));
      setSelectedCardList(allCardNoList);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            가계부에 거래 내역을 동기화할 카드를 선택해 주세요.
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
          {states.cards.length === 0 ? (
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
                    전체 선택 ({selectedCardList.size}/{states.cards.length})
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
                  setShowModal(false);
                  actions.syncCardHistory(selectedCardList);
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
