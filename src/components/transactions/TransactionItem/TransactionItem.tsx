import React from "react";
import type { Transaction } from "../../../types";
import { formatCurrencyCompact } from "../../../utils";
import "./TransactionItem.css";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string, cardNo?: string) => void;
}

const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) => {
  const handleDelete = () => {
    if (window.confirm("이 거래 내역을 삭제하시겠습니까?")) {
      onDelete(transaction.id, transaction.cardNo);
    }
  };

  const handleEdit = () => {
    onEdit(transaction);
  };

  return (
    <div className="transaction-item">
      {transaction.cardNo && (
        <div className="transaction-item__card-info">
          <div className="transaction-item__card-company">
            {transaction.cardCompany}
          </div>
          <div className="transaction-item__card-no">{transaction.cardNo}</div>
        </div>
      )}
      <div className="transaction-item__info">
        <div className="transaction-item__category">{transaction.category}</div>
        <div className="transaction-item__description">{transaction.description}</div>
      </div>
      <div className="transaction-item__details">
        <div
          className={`transaction-item__amount ${
            transaction.type === "income" ? "transaction-item__amount--income" : "transaction-item__amount--expense"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrencyCompact(transaction.amount)}
        </div>
        <div className="transaction-item__date">{transaction.date}</div>
      </div>
      <div className="transaction-item__actions">
        <button
          className="transaction-item__btn transaction-item__btn--edit"
          onClick={handleEdit}
          title="수정"
          disabled={!!transaction.cardNo}
        >
          ✏️
        </button>
        <button
          className="transaction-item__btn transaction-item__btn--delete"
          onClick={handleDelete}
          title="삭제"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default React.memo(TransactionItem);
