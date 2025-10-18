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
  formData: Omit<Transaction, "id">;
  handleSetFormData: (formData: Omit<Transaction, "id">) => void;
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  onEdit: (id: string, transaction: Omit<Transaction, "id">) => void;
}

const TransactionForm = ({
  editingId,
  handleOnClickCancel,
  formData,
  handleSetFormData,
  onAdd,
  onEdit,
}: TransactionFormProps) => {
  console.log("TransactionForm Rendering");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // form의 submit 시 발생하는 새로고침 이벤트 전파 방지
    if (!formData.amount || !formData.category || !formData.description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const transactionData = {
      type: formData.type,
      amount: formData.amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
    };

    if (editingId) {
      onEdit(editingId, transactionData);
    } else {
      onAdd(transactionData);
    }

    handleOnClickCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="add-transaction-form">
      <div className="form-header">
        <h4>{editingId ? "거래 내역 수정" : "거래 내역 추가"}</h4>
      </div>

      <div className="form-row">
        <select
          value={formData.type}
          onChange={(e) =>
            handleSetFormData({
              ...formData,
              type: e.target.value as TransactionType,
            })
          }
          className="form-input"
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
          className="form-input"
        />
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="카테고리"
          value={formData.category}
          onChange={(e) =>
            handleSetFormData({ ...formData, category: e.target.value })
          }
          className="form-input"
        />
        <div className="form-input for-datepicker">
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
            className="react-datepicker-custom"
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
        className="form-input"
      />

      <div className="form-buttons">
        <button type="submit" className="submit-button">
          완료
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={handleOnClickCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default React.memo(TransactionForm);
