import React, { useState, useCallback } from "react";
import type { Transaction } from "../../types";
import { TRANSACTION_TYPES, DATE_TYPES } from "../../types";
import TransactionForm from "./TransactionForm/TransactionForm";
import TransactionList from "./TransactionList/TransactionList";
import "./TransactionContainer.css";
import dayjs from "dayjs";
import { useBudgetContext } from "../../hooks/useBudgetContext";

const TransactionContainer = () => {
  console.log("TransactionContainer Rendering");

  const { states, actions } = useBudgetContext();
  const transactions = states.transactions;

  const [formData, setFormData] = useState<Transaction>({
    id: "",
    type: TRANSACTION_TYPES.EXPENSE,
    amount: 0,
    category: "",
    description: "",
    date: dayjs().format(DATE_TYPES.YYYYMMDD),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSetFormData = useCallback((formData: Transaction) => {
    setFormData({
      id: formData.id,
      type: formData.type,
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });
  }, []);

  const resetFormData = () => {
    setFormData({
      id: "",
      type: TRANSACTION_TYPES.EXPENSE,
      amount: 0,
      category: "",
      description: "",
      date: dayjs().format(DATE_TYPES.YYYYMMDD),
    });
  };

  const handleOnClickAdd = () => {
    resetFormData();
    if (!showForm) setShowForm(!showForm);
    setEditingId(null);
  };

  const handleOnClickCancel = useCallback(() => {
    resetFormData();
    setShowForm(false);
    setEditingId(null);
  }, []);

  const handleOnClickEdit = useCallback((transaction: Transaction) => {
    setFormData({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    });
    setEditingId(transaction.id);
    setShowForm(true);
  }, []);

  const handleOnClickAllClear = () => {
    if (
      window.confirm(
        "모든 거래 내역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      const ids: Array<string> = transactions.map((t) => t.id);
      actions.deleteAllTransactions(ids);
      handleOnClickCancel();
    }
  };

  return (
    <div className="transaction-section">
      <div className="section-header">
        <h3>거래 내역</h3>
        <div className="header-buttons">
          <button
            className="clear-button"
            onClick={handleOnClickAllClear}
            disabled={transactions.length === 0}
          >
            모두 삭제
          </button>

          <button className="add-button" onClick={handleOnClickAdd}>
            추가
          </button>
        </div>
      </div>

      {showForm && (
        <TransactionForm
          editingId={editingId}
          formData={formData}
          handleSetFormData={handleSetFormData}
          handleOnClickCancel={handleOnClickCancel}
          onAdd={actions.addTransaction}
          onEdit={actions.editTransaction}
        ></TransactionForm>
      )}

      <TransactionList
        transactions={transactions}
        handleOnClickEdit={handleOnClickEdit}
        onDelete={actions.deleteTransaction}
      ></TransactionList>
    </div>
  );
};

export default React.memo(TransactionContainer);
