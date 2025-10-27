import React from "react";
import type { Transaction } from "../../../types";
import { formatCurrencyCompact } from "../../../utils";
import "./TransactionItem.css";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) => {
  console.log("TransactionItem Rendering");

  const handleDelete = () => {
    if (window.confirm("이 거래 내역을 삭제하시겠습니까?")) {
      onDelete(transaction.id);
    }
  };

  const handleEdit = () => {
    onEdit(transaction);
  };

  return (
    <div className="transaction-item">
      <div className="transaction-info">
        <div className="transaction-card-company">
          {transaction.cardCompanyCode}
        </div>
        <div className="transaction-card-no">{transaction.cardNo}</div>
        <div className="transaction-category">{transaction.category}</div>
        <div className="transaction-description">{transaction.description}</div>
      </div>
      <div className="transaction-details">
        <div className={`transaction-amount ${transaction.type}`}>
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrencyCompact(transaction.amount)}
        </div>
        <div className="transaction-date">{transaction.date}</div>
      </div>
      <div className="transaction-actions">
        <button
          className="edit-button"
          onClick={handleEdit}
          title="수정"
          disabled={transaction.cardNo ? true : false}
        >
          ✏️
        </button>
        <button className="delete-button" onClick={handleDelete} title="삭제">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default React.memo(TransactionItem);
