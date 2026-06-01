export type NewsCategoryId =
  | "all"
  | "general"
  | "economy"
  | "politics"
  | "society"
  | "it"
  | "culture"
  | "sports"
  | "world";

export interface NewsCategory {
  id: NewsCategoryId;
  label: string;
  apiQuery: string;
  matchKeywords: string[];
  excludeKeywords?: string[];
}

const SHARED_EXCLUDE = ["광고", "협찬"];

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: "all",
    label: "전체",
    apiQuery: "",
    matchKeywords: [],
  },
  {
    id: "general",
    label: "종합",
    apiQuery: "오늘 속보",
    matchKeywords: [],
  },
  {
    id: "economy",
    label: "경제",
    apiQuery: "경제 금융 증시",
    matchKeywords: [
      "경제",
      "금융",
      "증시",
      "환율",
      "금리",
      "주식",
      "GDP",
      "물가",
      "수출",
      "무역",
      "코스피",
      "코스닥",
      "채권",
      "부동산",
    ],
    excludeKeywords: [...SHARED_EXCLUDE, "연예", "드라마", "예능"],
  },
  {
    id: "politics",
    label: "정치",
    apiQuery: "정치 국회 대통령",
    matchKeywords: [
      "정치",
      "국회",
      "대통령",
      "정부",
      "여당",
      "야당",
      "외교",
      "장관",
      "의원",
      "선거",
      "탄핵",
      "국정",
    ],
    excludeKeywords: SHARED_EXCLUDE,
  },
  {
    id: "society",
    label: "사회",
    apiQuery: "사회 사건 사고",
    matchKeywords: [
      "사회",
      "사건",
      "사고",
      "재판",
      "경찰",
      "소송",
      "검찰",
      "범죄",
      "화재",
      "교통사고",
    ],
    excludeKeywords: SHARED_EXCLUDE,
  },
  {
    id: "it",
    label: "IT/과학",
    apiQuery: "IT 과학 기술",
    matchKeywords: [
      "IT",
      "AI",
      "인공지능",
      "반도체",
      "스타트업",
      "과학",
      "연구",
      "우주",
      "테크",
      "소프트웨어",
      "로봇",
      "바이오",
    ],
    excludeKeywords: SHARED_EXCLUDE,
  },
  {
    id: "culture",
    label: "생활/문화",
    apiQuery: "문화 연예 생활",
    matchKeywords: [
      "문화",
      "연예",
      "영화",
      "음악",
      "전시",
      "생활",
      "공연",
      "방송",
      "드라마",
      "K팝",
    ],
    excludeKeywords: SHARED_EXCLUDE,
  },
  {
    id: "sports",
    label: "스포츠",
    apiQuery: "스포츠 경기",
    matchKeywords: [
      "스포츠",
      "야구",
      "축구",
      "농구",
      "올림픽",
      "KBO",
      "EPL",
      "골프",
      "배구",
      "e스포츠",
    ],
    excludeKeywords: SHARED_EXCLUDE,
  },
  {
    id: "world",
    label: "세계",
    apiQuery: "국제 해외",
    matchKeywords: [
      "국제",
      "해외",
      "미국",
      "중국",
      "러시아",
      "중동",
      "EU",
      "일본",
      "북한",
      "외신",
      "글로벌",
    ],
    excludeKeywords: SHARED_EXCLUDE,
  },
];

const CATEGORY_MAP = new Map(
  NEWS_CATEGORIES.map((category) => [category.id, category])
);

export function getCategoryById(id: string): NewsCategory | undefined {
  return CATEGORY_MAP.get(id as NewsCategoryId);
}

export function isValidCategoryId(id: string): id is NewsCategoryId {
  return CATEGORY_MAP.has(id as NewsCategoryId);
}

export const FILTERABLE_CATEGORY_IDS = NEWS_CATEGORIES.filter(
  (c) => c.id !== "all"
).map((c) => c.id);
