import type {
  NaverNewsApiResponse,
  NaverNewsItemRaw,
  NewsArticle,
  NewsApiSuccess,
} from "./types";

const NAVER_NEWS_API_URL = "https://openapi.naver.com/v1/search/news.json";
export const NEWS_FETCH_COUNT = 100;

export function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .trim();
}

export function formatPubDate(pubDate: string): string {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) {
    return pubDate;
  }
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "출처 미상";
  }
}

function mapItem(item: NaverNewsItemRaw): NewsArticle {
  const originallink = item.originallink || item.link;
  return {
    title: stripHtml(item.title),
    description: stripHtml(item.description),
    originallink,
    link: item.link,
    pubDate: item.pubDate,
    pubDateFormatted: formatPubDate(item.pubDate),
    source: extractSource(originallink),
  };
}

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "NAVER_CLIENT_ID 또는 NAVER_CLIENT_SECRET이 설정되지 않았습니다. .env.local 파일을 확인해 주세요."
    );
  }

  return { clientId, clientSecret };
}

export async function fetchNaverNews(
  query: string,
  display = NEWS_FETCH_COUNT
): Promise<NewsApiSuccess> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    throw new Error("검색어를 입력해 주세요.");
  }

  const { clientId, clientSecret } = getCredentials();

  const params = new URLSearchParams({
    query: trimmedQuery,
    display: String(Math.min(Math.max(display, 1), 100)),
    start: "1",
    sort: "date",
  });

  const response = await fetch(`${NAVER_NEWS_API_URL}?${params.toString()}`, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "API 권한이 없습니다. 네이버 개발자 센터에서 검색 API 사용 설정을 확인해 주세요."
      );
    }
    if (response.status === 400) {
      throw new Error("잘못된 검색 요청입니다. 검색어를 확인해 주세요.");
    }
    throw new Error(`뉴스를 불러오지 못했습니다. (HTTP ${response.status})`);
  }

  const data: NaverNewsApiResponse = await response.json();

  return {
    query: trimmedQuery,
    total: data.total,
    display: data.display,
    lastBuildDate: data.lastBuildDate,
    fetchedAt: new Date().toISOString(),
    items: (data.items ?? []).map(mapItem),
  };
}
