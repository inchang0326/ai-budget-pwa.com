import type { TransactionType } from ".";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  items: Array<T>;
  count: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface DeleteTransactionRequest {
  id: string;
}

export interface DeleteAllTransactionRequest {
  userId: string;
  ids: Array<string>;
}

export interface UpdateTransactionRequest
  extends Partial<CreateTransactionRequest> {}

export interface TransactionFilters {
  userId?: string;
  year?: number;
  month?: number;
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
