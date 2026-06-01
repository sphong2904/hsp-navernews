interface NewsHeaderProps {
  query: string;
  total: number;
  itemCount: number;
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

export default function NewsHeader({
  query,
  total,
  itemCount,
  fetchedAt,
}: NewsHeaderProps) {
  return (
    <header className="bg-engineered-grid rounded-lg px-2 py-6 text-center sm:py-7">
      <h1 className="text-display max-sm:text-[32px] max-sm:tracking-[-0.64px]">
        오늘의 뉴스레터
      </h1>
      <p className="text-subheading mx-auto mt-3 max-w-md">
        &ldquo;{query}&rdquo; 검색 결과 — 총{" "}
        <span className="font-medium text-midnight-ink">
          {total.toLocaleString("ko-KR")}
        </span>
        건 중 최신 {itemCount}건 표시
      </p>
      {fetchedAt && (
        <p className="text-caption mt-2">
          마지막 갱신: {formatFetchedAt(fetchedAt)}
        </p>
      )}
    </header>
  );
}
