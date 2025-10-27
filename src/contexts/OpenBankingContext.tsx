import React, { useReducer, useEffect, useCallback, useMemo } from "react";
import type { JSX } from "react";
import type { OpenBankingCardType } from "../types";
import {
  useRetrieveCards,
  useSyncCardHistory,
} from "../hooks/OpenBanking/useCards";
import isEqual from "lodash/isEqual"; // 깊은 비교 연산자

type OpenBankingStatesType = {
  cards: Array<OpenBankingCardType>;
};

const OPEN_BANKING_ACTION = {
  SEL_CARD: "SELECT_CARDS" as const,
} as const;

const OpenBankingActions = {
  selectCards: (cards: Array<OpenBankingCardType>) => ({
    type: OPEN_BANKING_ACTION.SEL_CARD,
    payload: { cards: cards },
  }),
};

type OpenBankingActionsType = ReturnType<
  (typeof OpenBankingActions)[keyof typeof OpenBankingActions]
>;

const reducer = (
  states: OpenBankingStatesType,
  actions: OpenBankingActionsType
) => {
  switch (actions.type) {
    case OPEN_BANKING_ACTION.SEL_CARD:
      return { ...states, cards: actions.payload.cards };
    default:
      return states;
  }
};

const initalOpenBankingStates: OpenBankingStatesType = {
  cards: [],
};

export interface OpenBankingContextType {
  states: OpenBankingStatesType;
  actions: {
    syncCardHistory: (cardNoList: Set<string>) => void;
  };
}

const OpenBankingContext = React.createContext<OpenBankingContextType | null>(
  null
);

interface OpenBankingProviderPropsType {
  children: JSX.Element | JSX.Element[];
}

export const OpenBankingProvider = (props: OpenBankingProviderPropsType) => {
  console.log("OpenBankingProvider Rendering");
  // [변경상태, 상태변경행위] = useReducer(상태변경로직, 초기상태)
  const [states, dispatch] = useReducer(reducer, initalOpenBankingStates);

  const { data } = useRetrieveCards({}); // 데이터가 곧장 stale 되지만, refetch 시 gcTime에 의해 cached 데이터를 보여줌

  useEffect(() => {
    // undefined data dispatch 및 same data dispatch 방지
    // undefined data 가드, 만약 useSuspenseQuery를 사용했다면 가드가 없어도 됨
    if (data && !isEqual(states.cards, data)) {
      dispatch(OpenBankingActions.selectCards(data.items));
    }
  }, [data]);

  const memoizedStates: OpenBankingStatesType = useMemo(() => {
    return { ...states };
  }, [states.cards]);

  // 쿼리 옵션이 바뀌지 않는 이상 참조가 유지 됨
  const mutation = useSyncCardHistory();

  const syncCardHistory = useCallback(
    async (cardNoList: Set<string>) => {
      await mutation.mutateAsync({
        noList: Array.from(cardNoList),
      });
    },
    [mutation]
  );

  const values: OpenBankingContextType = {
    states: memoizedStates,
    actions: {
      syncCardHistory,
    },
  };

  return (
    <OpenBankingContext.Provider value={values}>
      {props.children}
    </OpenBankingContext.Provider>
  );
};

export default OpenBankingContext;
