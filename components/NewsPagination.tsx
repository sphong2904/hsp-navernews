interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

function pageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    if (i > 0 && p - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(p);
  }

  return result;
}

export default function NewsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  disabled = false,
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = pageRange(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col items-center gap-4"
      aria-label="뉴스 목록 페이지"
    >
      <p className="text-caption text-muted-ash">
        {start}–{end} / {totalItems}건 (페이지 {currentPage} / {totalPages})
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          className="pagination-btn"
          aria-label="이전 페이지"
        >
          이전
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1">
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-caption text-muted-ash"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={disabled}
                aria-label={`${page}페이지`}
                aria-current={page === currentPage ? "page" : undefined}
                className={`pagination-btn min-w-[2.5rem] ${
                  page === currentPage
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 border-transparent"
                    : ""
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
          className="pagination-btn"
          aria-label="다음 페이지"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
