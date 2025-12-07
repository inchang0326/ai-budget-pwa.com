import React from "react";
import type { Transaction, TransactionType } from "../../../types";
import { TRANSACTION_TYPES, DATE_TYPES } from "../../../types";
import "./TransactionForm.css";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface TransactionFormProps {
  editingId: string | null;
  handleOnClickCancel: () => void;
  formData: Transaction;
  handleSetFormData: (formData: Transaction) => void;
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionForm = ({
  editingId,
  handleOnClickCancel,
  formData,
  handleSetFormData,
  onAdd,
  onEdit,
}: TransactionFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const transactionData = {
      id: formData.id,
      type: formData.type,
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
    };

    if (editingId) {
      onEdit(transactionData);
    } else {
      onAdd(transactionData);
    }

    handleOnClickCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="transaction-form__header">
        <h4 className="transaction-form__title">{editingId ? "거래 내역 수정" : "거래 내역 추가"}</h4>
      </div>

      <div className="transaction-form__row">
        <select
          value={formData.type}
          onChange={(e) =>
            handleSetFormData({
              ...formData,
              type: e.target.value as TransactionType,
            })
          }
          className="transaction-form__input transaction-form__select"
        >
          <option value={TRANSACTION_TYPES.EXPENSE}>지출</option>
          <option value={TRANSACTION_TYPES.INCOME}>수입</option>
        </select>

        <input
          type="text"
          placeholder="금액"
          value={formData.amount}
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) {
              alert("숫자를 입력해주세요.");
              return;
            }
            handleSetFormData({ ...formData, amount: Number(e.target.value) });
          }}
          className="transaction-form__input transaction-form__input--amount"
        />
      </div>

      <div className="transaction-form__row">
        <input
          type="text"
          placeholder="카테고리"
          value={formData.category}
          onChange={(e) =>
            handleSetFormData({ ...formData, category: e.target.value })
          }
          className="transaction-form__input"
        />
        <div className="transaction-form__input transaction-form__datepicker-wrapper">
          <DatePicker
            selected={dayjs(formData.date).toDate()}
            onChange={(d) => {
              dayjs(d).isValid() &&
                handleSetFormData({
                  ...formData,
                  date: dayjs(d).format(DATE_TYPES.YYYYMMDD),
                });
            }}
            dateFormat="yyyy-MM-dd"
            locale={ko}
            placeholderText="YYYY-MM-DD"
            className="transaction-form__datepicker-input"
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="설명"
        value={formData.description}
        onChange={(e) =>
          handleSetFormData({ ...formData, description: e.target.value })
        }
        className="transaction-form__input transaction-form__input--full"
      />

      <div className="transaction-form__actions">
        <button type="submit" className="transaction-form__btn transaction-form__btn--submit">
          완료
        </button>
        <button
          type="button"
          className="transaction-form__btn transaction-form__btn--cancel"
          onClick={handleOnClickCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default React.memo(TransactionForm);
