export type DateRangeType = {
  year: number;
  month: number;
};

export const CHART_TYPES = {
  CALENDAR: "calendar",
  WORDCLOUD: "wordcloud",
  PIE: "pie",
  BAR: "bar",
} as const;

export type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];

export const CHART_OPTIONS = [
  { type: CHART_TYPES.CALENDAR, label: "수입/지출 캘린더", icon: "📅" },
  { type: CHART_TYPES.WORDCLOUD, label: "수입/지출 키워드", icon: "☁️" },
  { type: CHART_TYPES.PIE, label: "수입/지출 비율", icon: "🥧" },
  { type: CHART_TYPES.BAR, label: "수입/지출 비교", icon: "📊" },
] as const;

export const DATE_TYPES = {
  YYYYMMDD: "YYYY-MM-DD",
} as const;

export const TRANSACTION_TYPES = {
  ALL: "all",
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  cardCompany?: string;
  cardNo?: string;
};

export type OpenBankingCardType = {
  no: string;
  name: string;
  company: string;
  syncAt?: string;
  finCardNo: string;
};
