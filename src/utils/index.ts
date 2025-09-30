export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number) => {
  if (amount === 0) return "0원";

  const 만 = Math.floor(amount / 10000);
  const 천 = Math.floor((amount % 10000) / 1000);
  const 나머지 = amount % 1000;

  let result = "";

  if (만 > 0) {
    result += `${만}만`;
  }

  if (천 > 0) {
    result += `${천}천`;
  }

  if (나머지 > 0) {
    result += `${나머지}`;
  }

  result += "원";

  return result;
};
