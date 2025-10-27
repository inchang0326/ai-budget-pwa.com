import { api } from "./client";
import type { PaginatedResponse } from "../types/apis";
import type {
  OpenBankingCard,
  SyncOpenBankingCardHistoryRequest,
} from "../types/apis";

const ENDPOINTS = {
  CARDS: "/budget/open-banking/cards",
} as const;

// 카드 서비스 클래스
export class CardService {
  // 카드 목록 조회 (페이징 지원)
  static async retrieveCards(): Promise<PaginatedResponse<OpenBankingCard>> {
    return api.get<PaginatedResponse<OpenBankingCard>>(ENDPOINTS.CARDS);
  }

  // 카드 사용 내역 동기화 (오픈 뱅킹 카드 연동)
  static async syncCardHistory(
    data: SyncOpenBankingCardHistoryRequest
  ): Promise<void> {
    console.log(data);
    return api.post<void>(ENDPOINTS.CARDS, data);
  }
}
