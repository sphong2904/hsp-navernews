import type { NewsArticle } from "@/lib/types";
import NewsCard from "./NewsCard";

interface NewsListProps {
  items: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  startIndex?: number;
}

function SkeletonArticle() {
  return (
    <div className="animate-pulse rounded-2xl bg-paper-white p-6 shadow-sm border border-ghost-border">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-cloud-canvas" />
          <div className="h-8 w-16 rounded-lg bg-cloud-canvas" />
        </div>
        <div className="space-y-3 mt-2 flex-1">
          <div className="h-5 w-4/5 rounded bg-cloud-canvas" />
          <div className="h-4 w-full rounded bg-cloud-canvas" />
          <div className="h-4 w-full rounded bg-cloud-canvas" />
          <div className="h-3 w-1/3 rounded bg-cloud-canvas" />
        </div>
      </div>
    </div>
  );
}

export default function NewsList({
  items,
  isLoading,
  error,
  startIndex = 0,
}: NewsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" aria-busy="true" aria-label="뉴스 불러오는 중">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonArticle key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="py-8 text-center bg-paper-white rounded-2xl border border-ghost-border">
        <p className="text-body font-medium text-midnight-ink">
          뉴스를 불러오지 못했습니다
        </p>
        <p className="text-caption mt-2">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center bg-paper-white rounded-2xl border border-ghost-border">
        <p className="text-body text-muted-ash">
          검색 결과가 없습니다. 다른 키워드로 검색해 보세요.
        </p>
      </div>
    );
  }

  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 list-none">
      {items.map((article, index) => (
        <li key={`${article.link}-${index}`} className="h-full">
          <NewsCard
            index={startIndex + index + 1}
            article={article}
          />
        </li>
      ))}
    </ol>
  );
}
