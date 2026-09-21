export const CATEGORIES = [
  "디지털기기",
  "생활가전",
  "가구/인테리어",
  "유아동",
  "생활/주방",
  "의류/패션",
  "스포츠/레저",
  "취미/게임/음반",
  "도서",
  "반려동물",
  "기타",
] as const;

export type Category = (typeof CATEGORIES)[number];
