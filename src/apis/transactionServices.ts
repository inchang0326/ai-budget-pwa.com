import { api } from "./client";
import type {
  Transaction,
  CreateTransactionRequest,
  DeleteTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
  PaginatedResponse,
  DeleteAllTransactionRequest,
} from "../types/apis";

const ENDPOINTS = {
  TRANSACTIONS: "/budget/transactions",
  DELETE: "/budget/transactions/delete",
  DELETE_ALL: "/budget/transactions/delete-all",
  SYNC: "/budget/transactions/sync",
} as const;

// 거래 내역 서비스 클래스
export class TransactionService {
  // 거래 내역 조회 (필터링 및 페이징 지원)
  static async retrieveTransactions(
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<Transaction>> {
    return api.get<PaginatedResponse<Transaction>>(
      ENDPOINTS.TRANSACTIONS,
      filters as Record<string, unknown>
    );
  }

  // 거래 내역 생성
  static async createTransaction(
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    return api.post<Transaction>(ENDPOINTS.TRANSACTIONS, data);
  }

  // 거래 내역 수정
  static async updateTransaction(
    id: string,
    data: UpdateTransactionRequest
  ): Promise<Transaction> {
    /**
     *  update 요청과 멱등성
     *  - update에 대해 전체 교체 => put method 및 멱등성 보장 O(동일한 연산을 여러 번 수행해도 결과가 달라지지 않는 성질)
     *  - update에 대해 부분 변경 => patch method 및 멱등성 보장 X(하지만 멱등성을 보장하도록 구현할 순 있음)
     *    - 변경되는 값에 대해 상대적으로 설정하는 것이 아닌 절대적으로 설정하기(ex. age += 1 X / age = 33)
     *  - update에 대해 post method로도 구현이 가능하지만, REST API 설계 기준 상 update는 put 또는 patch method 임
     */
    return api.put<Transaction>(ENDPOINTS.TRANSACTIONS, data);
  }

  // 거래 내역 삭제
  static async deleteTransaction(
    data: DeleteTransactionRequest
  ): Promise<void> {
    return api.post<void>(ENDPOINTS.DELETE, data);
  }

  // 모든 거래 내역 삭제
  static async deleteAllTransactions(
    data: DeleteAllTransactionRequest
  ): Promise<void> {
    return api.post<void>(ENDPOINTS.DELETE_ALL, data);
  }

  // 거래 내역 동기화 (외부 계좌 연동)
  static async syncTransactions(): Promise<Transaction[]> {
    return api.post<Transaction[]>(ENDPOINTS.SYNC);
  }
}
