import React, { useState, useMemo, useCallback } from "react";
import type { Transaction, TransactionType } from "../../../types";
import { TRANSACTION_TYPES } from "../../../types";
import TransactionItem from "../TransactionItem/TransactionItem";
import "./TransactionList.css";
import dayjs from "dayjs";
import { ITEM_LIMIT_COUNT_PER_PAGE } from "../../../const";

interface TransactionListProps {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  onPageChange: (currentPgae: number) => void;
  transactions: Transaction[];
  handleOnClickEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList = ({
  totalCount,
  totalPage,
  currentPage,
  onPageChange,
  transactions,
  handleOnClickEdit,
  onDelete,
}: TransactionListProps) => {
  console.log("TransactionList Rendering");
  const [searchType, setSearchType] = useState<TransactionType>(
    TRANSACTION_TYPES.ALL
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  /* for searching */
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchType !== TRANSACTION_TYPES.ALL) {
      filtered = filtered.filter((t) => t.type === searchType);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.amount.toString().includes(term)
      );
    }

    // descending by date
    return filtered.sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
    );
  }, [transactions, searchTerm, searchType]);

  const handleSearchTypeChange = useCallback((type: TransactionType) => {
    setSearchType(type);
    onPageChange(1);
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    1;
  }, []);

  /* for paginatiin */
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEM_LIMIT_COUNT_PER_PAGE;
    return filteredTransactions.slice(
      startIndex,
      startIndex + ITEM_LIMIT_COUNT_PER_PAGE
    );
  }, [filteredTransactions, currentPage]);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <>
      {/* Search */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="카테고리, 설명, 금액으로 검색..."
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-button ${
              searchType === TRANSACTION_TYPES.ALL ? "active" : ""
            }`}
            onClick={() => handleSearchTypeChange(TRANSACTION_TYPES.ALL)}
          >
            전체
          </button>
          <button
            className={`filter-button ${
              searchType === TRANSACTION_TYPES.INCOME ? "active" : ""
            }`}
            onClick={() => handleSearchTypeChange(TRANSACTION_TYPES.INCOME)}
          >
            수입
          </button>
          <button
            className={`filter-button ${
              searchType === TRANSACTION_TYPES.EXPENSE ? "active" : ""
            }`}
            onClick={() => handleSearchTypeChange(TRANSACTION_TYPES.EXPENSE)}
          >
            지출
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            {searchTerm ? "검색 결과가 없습니다." : "거래 내역이 없습니다."}
            <br />
            {!searchTerm &&
              "상단 조회 월을 변경하시거나 외부 데이터를 동기화 하세요. 또는 직접 추가해 보세요."}
          </div>
        ) : (
          <>
            {/* Transaction Items */}
            <div className="transaction-items">
              {paginatedTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleOnClickEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {/* Pages */}
            {totalPage > 1 && (
              <div className="pagination">
                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹ 이전
                </button>

                {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`page-button ${
                        page === currentPage ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="page-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage}
                >
                  다음 ›
                </button>
              </div>
            )}

            <div className="pagination-info">
              전체 {totalCount}건 중{" "}
              {(currentPage - 1) * ITEM_LIMIT_COUNT_PER_PAGE + 1}-
              {Math.min(currentPage * ITEM_LIMIT_COUNT_PER_PAGE, totalCount)}건
              표시
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(TransactionList);
