export function formatPrice(price: number) {
  if (price === 0) return "나눔";
  return `${price.toLocaleString("ko-KR")}원`;
}
