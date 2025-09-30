import { createPortal } from "react-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import "./GlobalLoader.css";

export default function GlobalLoader({
  /**
   *  true: 최초 로딩 pending 포함, false: refetch만(data 존재 and fetchStatus==='fetching')
   *  refetch란 최초 로딩 이후 동일한 Query Key에 대해 다시 fetch가 발생하는 모든 상황을 의미함
   *  - 포커스, 재연결, 마운트 정책, 무효화, 수동 refetch, 인터벌 등을 포함함
   */
  includeInitial = false,
}: {
  includeInitial?: boolean;
}) {
  // useIsFetching: 백엔드 서버로부터 데이터를 가져오는 중인 쿼리 개수를 조회하도록 함, predicate 옵션으로 "카운트 할 쿼리만" 선별할 수도 있음
  const fetchingCount = useIsFetching(
    includeInitial
      ? undefined // 최초 로딩 포함 모든 fetching 집계
      : {
          predicate: (query) => {
            // 참고: v5의 status는 'pending'|'success'|'error', fetchStatus는 'fetching'|'paused'|'idle'
            return (
              query.state.data !== undefined &&
              query.state.fetchStatus === "fetching"
            );
          },
        }
  );

  const mutatingCount = useIsMutating();

  const active = (fetchingCount ?? 0) + (mutatingCount ?? 0) > 0;
  if (!active) return null;

  return createPortal(
    <div className="global-loader-overlay">
      <div className="global-loader-bar">
        <div className="bar-fill" />
      </div>
    </div>,
    document.body
  );
}
