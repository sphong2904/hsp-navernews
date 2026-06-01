import {
  getCategoryById,
  type NewsCategory,
  type NewsCategoryId,
} from "./news-categories";
import {
  fetchNaverNews,
  NEWS_FETCH_COUNT,
  type NaverFetchResult,
} from "./naver-news";
import type { NewsApiSuccess, NewsArticle } from "./types";

const NAVER_MAX_START = 1000;
const BATCH_SIZE = 100;

export function buildSearchQuery(
  userQuery: string,
  categoryId: NewsCategoryId
): string {
  const trimmed = userQuery.trim();
  const category = getCategoryById(categoryId);

  if (!category || categoryId === "all") {
    return trimmed || "오늘";
  }

  if (trimmed) {
    return `${category.apiQuery} ${trimmed}`.trim();
  }

  return category.apiQuery;
}

function articleText(article: NewsArticle): string {
  return `${article.title} ${article.description}`;
}

export function matchesCategory(
  article: NewsArticle,
  category: NewsCategory
): boolean {
  if (category.id === "all" || category.id === "general") {
    return true;
  }

  if (category.matchKeywords.length === 0) {
    return true;
  }

  const text = articleText(article);

  if (
    category.excludeKeywords?.some((keyword) => text.includes(keyword))
  ) {
    return false;
  }

  return category.matchKeywords.some((keyword) => text.includes(keyword));
}

function dedupeByLink(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.link || article.originallink;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function fetchFilteredNews(
  userQuery: string,
  categoryId: NewsCategoryId,
  targetCount = NEWS_FETCH_COUNT
): Promise<NewsApiSuccess> {
  const category = getCategoryById(categoryId);
  if (!category) {
    throw new Error("알 수 없는 카테고리입니다.");
  }

  const apiQuery = buildSearchQuery(userQuery, categoryId);
  const shouldFilter =
    categoryId !== "all" && category.matchKeywords.length > 0;

  const collected: NewsArticle[] = [];
  let filteredFrom = 0;
  let naverTotal = 0;
  let lastBuildDate = "";
  let start = 1;

  while (collected.length < targetCount && start <= NAVER_MAX_START) {
    const batch: NaverFetchResult = await fetchNaverNews(
      apiQuery,
      BATCH_SIZE,
      start
    );

    naverTotal = batch.total;
    lastBuildDate = batch.lastBuildDate;
    filteredFrom += batch.items.length;

    const filtered = shouldFilter
      ? batch.items.filter((item) => matchesCategory(item, category))
      : batch.items;

    for (const item of filtered) {
      if (collected.length >= targetCount) {
        break;
      }
      collected.push(item);
    }

    if (batch.items.length < BATCH_SIZE) {
      break;
    }

    start += BATCH_SIZE;
  }

  const items = dedupeByLink(collected).slice(0, targetCount);

  return {
    query: apiQuery,
    userQuery: userQuery.trim(),
    category: categoryId,
    categoryLabel: category.label,
    total: naverTotal,
    display: items.length,
    filteredFrom: shouldFilter ? filteredFrom : undefined,
    lastBuildDate,
    fetchedAt: new Date().toISOString(),
    items,
  };
}
