import React, { useReducer, useEffect, useCallback, useMemo } from "react";
import type { JSX } from "react";
import type { DateRangeType } from "../types";
import type { Transaction } from "../types/apis";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useDeleteAllTransactions,
  useSyncTransactions,
} from "../hooks/useTransactions";
import { keepPreviousData } from "@tanstack/react-query";
import { ITEM_LIMIT_COUNT_PER_PAGE } from "../const";
import dayjs from "dayjs";
import isEqual from "lodash/isEqual"; // 깊은 비교 연산자

type BudgetStatesType = {
  selectedDate: DateRangeType;
  totalCount: number; // read-only
  currentPage: number;
  totalPage: number; // read-only
  transactions: Array<Transaction>;
};

const BUDGET_ACTION = {
  CHG_DATE: "CHANGE_DATE" as const,
  CHG_PAGE: "CHANGE_PAGE" as const,
  SEL_TRAN: "SELECT_TRANSACTIONS" as const,
  ADD_TRAN: "ADD_TRANSACTION" as const,
  DEL_TRAN: "DELETE_TRANSACTION" as const,
  DEL_ALL_TRAN: "DELETE_ALL_TRANSACTIONS" as const,
  EDT_TRAN: "EDIT_TRANSACTION" as const,
  SYN_TRAN: "SYNC_TRANSACTIONS" as const,
} as const;

const BudgetActions = {
  changeDate: (selectedDate: DateRangeType) => ({
    type: BUDGET_ACTION.CHG_DATE,
    payload: { selectedDate: selectedDate },
  }),
  changePage: (currentPage: number) => ({
    type: BUDGET_ACTION.CHG_PAGE,
    payload: { currentPage: currentPage },
  }),
  selectTransactions: (transactions: Array<Transaction>) => ({
    type: BUDGET_ACTION.SEL_TRAN,
    payload: { transactions: transactions },
  }),
  addTransaction: (transaction: Omit<Transaction, "id">) => ({
    type: BUDGET_ACTION.ADD_TRAN,
    payload: { transaction: transaction },
  }),
  deleteTransaction: (id: string) => ({
    type: BUDGET_ACTION.DEL_TRAN,
    payload: { id: id },
  }),
  deleteAllTransactions: () => ({
    type: BUDGET_ACTION.DEL_ALL_TRAN,
    payload: {},
  }),
  editTransaction: (id: string, transaction: Omit<Transaction, "id">) => ({
    type: BUDGET_ACTION.EDT_TRAN,
    payload: { id: id, transaction: transaction },
  }),
  syncTransactions: () => ({
    type: BUDGET_ACTION.SYN_TRAN,
    payload: {},
  }),
};

type BudgetActionsType = ReturnType<
  (typeof BudgetActions)[keyof typeof BudgetActions]
>;

const reducer = (states: BudgetStatesType, actions: BudgetActionsType) => {
  switch (actions.type) {
    case BUDGET_ACTION.CHG_DATE:
      if (states.selectedDate.month != actions.payload.selectedDate.month)
        return {
          ...states,
          selectedDate: {
            ...states.selectedDate,
            month: actions.payload.selectedDate.month,
          },
        };
      else if (states.selectedDate.year != actions.payload.selectedDate.year)
        return {
          ...states,
          selectedDate: {
            ...states.selectedDate,
            year: actions.payload.selectedDate.year,
          },
        };
      else return states;
    case BUDGET_ACTION.CHG_PAGE:
      return { ...states, currentPage: actions.payload.currentPage };
    case BUDGET_ACTION.SEL_TRAN:
      return { ...states, transactions: actions.payload.transactions };
    default:
      return states;
  }
};

const initalBudgetAppStates: BudgetStatesType = {
  selectedDate: {
    year: dayjs().year(),
    month: dayjs().month() + 1,
  },
  totalCount: 0, // read-only
  currentPage: 1,
  totalPage: 1, // read-only
  transactions: [],
};

export interface BudgetContextType {
  states: BudgetStatesType;
  actions: {
    changeDate: (currentDate: DateRangeType) => void;
    changePage: (currentPage: number) => void;
    addTransaction: (transaction: Omit<Transaction, "id">) => void;
    deleteTransaction: (id: string) => void;
    deleteAllTransactions: () => void;
    editTransaction: (id: string, updated: Omit<Transaction, "id">) => void;
    syncTransactions: () => void;
  };
}

const BudgetContext = React.createContext<BudgetContextType | null>(null);

interface BudgetProviderPropsType {
  children: JSX.Element | JSX.Element[];
}

export const BudgetProvider = (props: BudgetProviderPropsType) => {
  console.log("BudgetProvider Rendering");
  // [변경상태, 상태변경행위] = useReducer(상태변경로직, 초기상태)
  const [states, dispatch] = useReducer(reducer, initalBudgetAppStates);

  // 최초 selectedDate.year, selectedDate.month 기준 데이터 조회
  // 참고1: React Hooks 정책에 따라 Hook은 컴포넌트 본문 또는 커스텀 훅의 최상위에서만 호출해야 하며, 루프/조건/중첩 함수(=reducer 포함) 안에서는 금지임
  // 참고2: useQuery의 데이터 정책은 즉시 로딩, useSuspenseQuery의 데이터 정책은 대기 후 로딩이라, useQuery는 데이터가 보장되지 않아 직접 가드를 해야 함
  const { data } = useTransactions(
    {
      year: states.selectedDate.year,
      month: states.selectedDate.month,
      page: states.currentPage,
      limit: ITEM_LIMIT_COUNT_PER_PAGE,
    },
    /**
     *  목적: 페이징 과정 등 Fallback UI 노출 시, 이전 데이터를 보여주기 위함
     *  참고: useSuspenseQuery는 데이터 상태를 완료 또는 대기 2가지로만 보며 중간 표시 상태는 배제하기 떄문에, placeholderData 옵션을 지원하지 않음
     *       만약 비슷하게 기능을 구현하고 싶으면, useTransition 같은 훅과 함께 사용해야 함
     */
    {
      placeholderData: keepPreviousData,
    }
  );

  useEffect(() => {
    // undefined data dispatch 및 same data dispatch 방지
    // undefined data 가드, 만약 useSuspenseQuery를 사용했다면 가드가 없어도 됨
    if (data) {
      const byId = (a: Transaction, b: Transaction) => a.id.localeCompare(b.id);
      const sortedStatesTransactions = [...states.transactions].sort(byId);
      const sortedDataItems = [...data.items].sort(byId);
      if (!isEqual(sortedStatesTransactions, sortedDataItems)) {
        dispatch(BudgetActions.selectTransactions(sortedDataItems));
      }
    }
  }, [data]);

  const memoizedStates: BudgetStatesType = useMemo(() => {
    return {
      ...states,
      totalCount: data?.totalCount ?? 1,
      totalPage: data?.totalPages ?? 1,
    };
  }, [
    states.selectedDate,
    states.totalCount,
    states.currentPage,
    states.totalPage,
    states.transactions,
  ]);

  const changeDate = useCallback((currentDate: DateRangeType) => {
    dispatch(BudgetActions.changeDate(currentDate));
  }, []);

  const changePage = useCallback((currentPage: number) => {
    dispatch(BudgetActions.changePage(currentPage));
  }, []);

  // 쿼리 옵션이 바뀌지 않는 이상 참조가 유지 됨
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction();
  const deleteAllMutation = useDeleteAllTransactions();
  const updateMutation = useUpdateTransaction();
  const syncMutation = useSyncTransactions();

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      await createMutation.mutateAsync({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      });
    },
    [createMutation]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const deleteAllTransactions = useCallback(async () => {
    await deleteAllMutation.mutateAsync();
  }, [deleteAllMutation]);

  const editTransaction = useCallback(
    async (id: string, transaction: Omit<Transaction, "id">) => {
      await updateMutation.mutateAsync({
        id,
        data: {
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
        },
      });
    },
    [updateMutation]
  );

  const syncTransactions = useCallback(async () => {
    await syncMutation.mutateAsync();
  }, [syncMutation]);

  const values: BudgetContextType = {
    states: memoizedStates,
    actions: {
      changeDate,
      changePage,
      addTransaction,
      deleteTransaction,
      deleteAllTransactions,
      editTransaction,
      syncTransactions,
    },
  };

  return (
    <BudgetContext.Provider value={values}>
      {props.children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;
