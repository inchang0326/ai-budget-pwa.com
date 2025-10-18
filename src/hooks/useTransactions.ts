import {
  useQuery,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { TransactionService } from "../apis/transactionServices";
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
  PaginatedResponse,
  DeleteTransactionRequest,
  DeleteAllTransactionRequest,
} from "../types/apis";

// queryKey, stale time, cache time 등 global 하게 적용하여 동일 기준을 가져가야 함
// useQuery 등 조회 쿼리에서 사용하는 key로 데이터의 fresh/stale 확인 및 cache 조회 위한 기준 key
export const queryKeys = {
  all: ["transactions"],
  lists: () => [...queryKeys.all, "list"],
  list: (filters: TransactionFilters) => [...queryKeys.lists(), { filters }],
  infinite: (filters: Omit<TransactionFilters, "page">, limit: number) => [
    ...queryKeys.lists(),
    "infinite",
    { filters, limit },
  ],
  details: () => [...queryKeys.all, "detail"],
  detail: (id: string) => [...queryKeys.details(), id],
};
// 참고: https://velog.io/@taewo/React-Query%EC%9D%98-Stale-Time-Cache-Time
/**
 *  데이터를 fresh 상태로 여기는 시간이며, 경과 후 stale 상태가 된 데이터를 refetch 할 시점을 알려준다.
 *  기본적인 동작 상 발생하는 refetch 외에도 다음과 같은 케이스에서도 refetch가 발생함
 *  - refetchOnWindowFocus 옵션: 윈도우 탭 포커싱 시(디폴트 true)
 *  - refetchOnReconnect 옵션: 네트워크 다시 연결 시(디폴트 true)
 *  - 특별히 설정한 refetch interval 시
 *  즉,
 *  - 데이터가 fresh 상태면, 쿼리 인스턴스가 새롭게 마운트 되어도 네트워크 refetch가 발생하지 않는다.
 *  - stale tiem 경과 후 데이터가 stale 상태가 되면, 네트워크 refetch가 발생한다.
 */
const DEFAULT_STALE_TIME = 0 * 5 * 60 * 1000;
/**
 *  fresh 상태의 데이터를 caching 해두는 시간이다.
 *  예를들어, stale time 내 동일한 react-query의 재 요청이라면, cached fresh 데이터를 재활용하 수 있도록 한다.
 */
const DEFAULT_GC_TIME = 10 * 60 * 1000;
// 만약 stale time이 0이라면(디폴트), react-query의 캐싱 기능을 제대로 활용할 수 없다.
// 왜냐하면, 항상 캐싱되어 있는 데이터가 stale한 상태로 여기기 때문에 서버에 계속적인 요청을 하게 된다.
// 항상 새로 조회를 원하면, [staleTime=0, refetchOnMount: 'always', refetchOnWindowFocus: true] 조합 + UX는 placeholderData: keepPreviousData로 완화

// 거래 내역 목록 조회
export const useTransactions = (
  filters: TransactionFilters = {},
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Transaction>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => TransactionService.retrieveTransactions(filters),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    retry: 3,
    ...options,
  });
};

// (Suspense) 거래 내역 목록 조회
export const useSuspenseTransactions = (filters: TransactionFilters = {}) => {
  return useSuspenseQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => TransactionService.retrieveTransactions(filters),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// (Suspense) 무한 스크롤
export const useSuspenseInfiniteTransactions = (
  filters: Omit<TransactionFilters, "page"> = {},
  limit: number = 20
) => {
  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.infinite(filters, limit),
    queryFn: ({ pageParam }) =>
      TransactionService.retrieveTransactions({
        ...filters,
        page: pageParam as number,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPrev ? firstPage.page - 1 : undefined;
    },
    staleTime: DEFAULT_STALE_TIME,
  });
};

// 거래 내역 생성
export const useCreateTransaction = (
  options?: UseMutationOptions<Transaction, Error, CreateTransactionRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TransactionService.createTransaction,
    onSuccess: () => {
      /**
       *  ["transactions", "lists", { * }] 캐시 모두 stale 상태로 갱신 (exact: false)
       *  이에 따라 해당 queryKey를 구독하는 useTransactions에서 refetch가 발생하며
       *  자연스럽게 BudgetContext.tsx 내에서 useTransactions 통해 데이터 재조회 함
       */
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });
    },
    onError: (error) => {
      console.error("거래 내역 생성 실패:", error);
    },
    ...options,
  });
};

// (Suspense) 거래 내역 생성
export const useSuspenseCreateTransaction = () => {
  const mutation = useCreateTransaction();

  const mutateWithSuspense = (data: CreateTransactionRequest) => {
    return new Promise<Transaction>((resolve, reject) => {
      mutation.mutate(data, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };

  return {
    ...mutation,
    mutateAsync: mutateWithSuspense,
    isLoading: mutation.isPending,
  };
};

// 거래 내역 수정
interface UpdateTransactionContext {
  previousTransaction?: Transaction;
}

export const useUpdateTransaction = (
  options?: UseMutationOptions<
    Transaction,
    Error,
    UpdateTransactionRequest,
    UpdateTransactionContext
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    Transaction,
    Error,
    UpdateTransactionRequest,
    UpdateTransactionContext
  >({
    mutationFn: TransactionService.updateTransaction,
    onMutate: async (
      data: UpdateTransactionRequest
    ): Promise<UpdateTransactionContext> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.detail(data.id) }),
        queryClient.cancelQueries({
          queryKey: queryKeys.lists(),
          exact: false,
        }),
      ]);

      const previousTransaction = queryClient.getQueryData<Transaction>(
        queryKeys.detail(data.id)
      );

      if (previousTransaction) {
        const updatedTransaction = { ...previousTransaction, ...data };
        queryClient.setQueryData<Transaction>(
          queryKeys.detail(data.id),
          updatedTransaction
        );
      }

      return { previousTransaction };
    },
    onError: (error, data, context) => {
      console.error("거래 내역 수정 실패:", error);

      if (context?.previousTransaction) {
        queryClient.setQueryData(
          queryKeys.detail(data.id),
          context.previousTransaction
        );
      }
    },
    onSettled: (_, __, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });
    },
    ...options,
  });
};

// (Suspense) 거래 내역 수정
export const useSuspenseUpdateTransaction = () => {
  const mutation = useUpdateTransaction();

  const mutateWithSuspense = (data: UpdateTransactionRequest) => {
    return new Promise<Transaction>((resolve, reject) => {
      mutation.mutate(data, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };

  return {
    ...mutation,
    mutateAsync: mutateWithSuspense,
    isLoading: mutation.isPending,
  };
};

// 거래 내역 삭제
interface DeleteTransactionContext {
  previousTransaction?: Transaction;
  id: string;
}

export const useDeleteTransaction = (
  options?: UseMutationOptions<
    void,
    Error,
    DeleteTransactionRequest,
    DeleteTransactionContext
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    DeleteTransactionRequest,
    DeleteTransactionContext
  >({
    mutationFn: TransactionService.deleteTransaction,
    /**
     *  서버 요청 직전에 실행되어, 다음과 같은 기능을 함
     *  - 낙관적 업데이트: 변경 데이터로 먼저 화면 콘텐츠를 바꿔 보여줄 수 있도록 함
     *  - 롤백 준비: 이전 데이터 스냅샷을 저장해 둔 후, 이를 onError에서 롤백 위해 사용할 수 있도록 함
     *  - cancelQueries: 기존 queryKey 요청 취소 (낙관적 업데이트 수행했지만, 기존 요청의 지연 응답으로 인해, 낙관적 업데이트 이전 데이터로 보여질 수 있음)
     *  - removeQueires: 기존 캐시된 queryKey 및 데이터 제거 (백엔드상 데이터가 제거됐지만, 프론트엔드상 캐싱 데이터를 여전히 확인 가능한 정합성 문제 발생)
     */
    onMutate: async (
      data: DeleteTransactionRequest
    ): Promise<DeleteTransactionContext> => {
      // 롤백 준비 (이전 스냅샷 저장)
      const previousTransaction = queryClient.getQueryData<Transaction>(
        queryKeys.detail(data.id)
      );

      queryClient.removeQueries({
        queryKey: queryKeys.detail(data.id),
      });

      return { previousTransaction, id: data.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });
    },
    onError: (error, data, context) => {
      console.error("거래 내역 삭제 실패:", error);

      // 롤백
      if (context?.previousTransaction) {
        queryClient.setQueryData(
          queryKeys.detail(context.id),
          context.previousTransaction
        );
      }
    },
    ...options,
  });
};

// (Suspense) 거래 내역 삭제
export const useSuspenseDeleteTransaction = () => {
  const mutation = useDeleteTransaction();

  const mutateWithSuspense = (data: DeleteTransactionRequest) => {
    return new Promise<void>((resolve, reject) => {
      mutation.mutate(data, {
        onSuccess: resolve,
        onError: reject,
      });
    });
  };

  return {
    ...mutation,
    mutateAsync: mutateWithSuspense,
    isLoading: mutation.isPending,
  };
};

// 모든 거래 내역 삭제
interface DeleteAllTransactionContext {
  previousTransactions?: Array<Transaction | undefined>;
  ids: Array<string>;
}

export const useDeleteAllTransactions = (
  options?: UseMutationOptions<
    void,
    Error,
    DeleteAllTransactionRequest,
    DeleteAllTransactionContext
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    DeleteAllTransactionRequest,
    DeleteAllTransactionContext
  >({
    mutationFn: TransactionService.deleteAllTransactions,
    onMutate: async (
      data: DeleteAllTransactionRequest
    ): Promise<DeleteAllTransactionContext> => {
      const previousTransactions: Array<Transaction | undefined> = data.ids.map(
        (id) => queryClient.getQueryData<Transaction>(queryKeys.detail(id))
      );

      for (const id of data.ids) {
        queryClient.removeQueries({
          queryKey: queryKeys.detail(id),
        });
      }

      return { previousTransactions, ids: data.ids };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });
    },
    onError: (error, data, context) => {
      console.error("모든 거래 내역 삭제 실패:", error);

      // 롤백
      if (context?.previousTransactions) {
        context.previousTransactions.forEach((transaction, index) => {
          const id = context.ids[index];
          if (transaction !== undefined) {
            queryClient.setQueryData(queryKeys.detail(id), transaction);
          }
        });
      }
    },
    ...options,
  });
};

// 거래 내역 동기화 (외부 계좌 연동)
export const useSyncTransactions = (
  options?: UseMutationOptions<Transaction[], Error, void>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TransactionService.syncTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
        exact: false,
      });
    },
    onError: (error) => {
      console.error("거래 내역 동기화 실패:", error);
    },
    ...options,
  });
};
