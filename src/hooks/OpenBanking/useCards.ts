import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { CardService } from "../../apis/cardServices";
import type {
  PaginatedResponse,
  SyncOpenBankingCardHistoryRequest,
} from "../../types/apis";
import type { OpenBankingCard } from "../../types/apis";
import { transactionsQueryKeys } from "../Budget/useTransactions";

// queryKey, stale time, cache time 등 global 하게 적용하여 동일 기준을 가져가야 함
// useQuery 등 조회 쿼리에서 사용하는 key로 데이터의 fresh/stale 확인 및 cache 조회 위한 기준 key
export const cardsQueryKeys = {
  all: ["cards"],
  lists: () => [...cardsQueryKeys.all, "list"],
};
const DEFAULT_STALE_TIME = 0 * 5 * 60 * 1000;
const DEFAULT_GC_TIME = 10 * 60 * 1000;

// 카드 목록 조회
export const useRetrieveCards = (
  options?: Omit<
    UseQueryOptions<PaginatedResponse<OpenBankingCard>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: cardsQueryKeys.lists(),
    queryFn: () => CardService.retrieveCards(),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 3,
    ...options,
  });
};

// 카드 사용 내역 동기화
export const useSyncCardHistory = (
  options?: UseMutationOptions<void, Error, SyncOpenBankingCardHistoryRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CardService.syncCardHistory,
    onSuccess: () => {
      // invalidateQueries의 경우 활성 쿼리는 백그라운드 refetch, 비활성 쿼리는 stale 처리 후 다시 사용할 떄 refetch
      queryClient.invalidateQueries({
        queryKey: cardsQueryKeys.lists(),
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.lists(),
        exact: false,
      });
      alert("카드 동기화를 완료했습니다.");
    },
    onError: (error) => {
      console.error("카드 사용 내역 동기화 실패:", error);
      alert("카드 동기화가 실패했습니다.");
    },
    ...options,
  });
};
