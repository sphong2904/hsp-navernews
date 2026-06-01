import type { NewsCategoryId } from "@/lib/news-categories";

interface NewsHeaderProps {
  query: string;
  userQuery: string;
  categoryLabel: string;
  category: NewsCategoryId;
  total: number;
  itemCount: number;
  filteredFrom?: number;
  fetchedAt: string | null;
}

function formatFetchedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function buildSubtitle(props: NewsHeaderProps): string {
  const { category, categoryLabel, userQuery, query } = props;

  if (category !== "all" && userQuery) {
    return `${categoryLabel} · "${userQuery}" 검색 결과`;
  }

  if (category !== "all") {
    return `${categoryLabel} 뉴스`;
  }

  return `"${query}" 검색 결과`;
}

export default function NewsHeader({
  query,
  userQuery,
  categoryLabel,
  category,
  total,
  itemCount,
  filteredFrom,
  fetchedAt,
}: NewsHeaderProps) {
  const subtitle = buildSubtitle({
    query,
    userQuery,
    categoryLabel,
    category,
    total,
    itemCount,
    filteredFrom,
    fetchedAt,
  });

  return (
    <header className="bg-engineered-grid rounded-lg px-2 py-6 text-center sm:py-7">
      <h1 className="text-display max-sm:text-[32px] max-sm:tracking-[-0.64px]">
        오늘의 뉴스레터
      </h1>
      <p className="text-subheading mx-auto mt-3 max-w-lg">
        {subtitle} — 총{" "}
        <span className="font-medium text-midnight-ink">
          {total.toLocaleString("ko-KR")}
        </span>
        건 중 최신 {itemCount}건 표시
      </p>
      {filteredFrom !== undefined && filteredFrom > itemCount && (
        <p className="text-caption mt-2">
          카테고리 필터 적용: {filteredFrom}건 수집 후 {itemCount}건 선별
        </p>
      )}
      {fetchedAt && (
        <p className="text-caption mt-2">
          마지막 갱신: {formatFetchedAt(fetchedAt)}
        </p>
      )}
    </header>
  );
}
