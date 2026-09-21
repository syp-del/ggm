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

export const CATEGORY_ICONS: Record<Category, string> = {
  "디지털기기": "📱",
  "생활가전": "🧺",
  "가구/인테리어": "🛋️",
  "유아동": "🧸",
  "생활/주방": "🍳",
  "의류/패션": "👕",
  "스포츠/레저": "⚽",
  "취미/게임/음반": "🎮",
  "도서": "📚",
  "반려동물": "🐶",
  "기타": "🍆",
};

export const PRODUCT_STATUSES = ["판매중", "예약중", "거래완료"] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
