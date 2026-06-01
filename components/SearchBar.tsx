interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  canSubmit: boolean;
  categorySelected: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
  canSubmit,
  categorySelected,
}: SearchBarProps) {
  const placeholder = categorySelected
    ? "키워드 추가 (선택) — 카테고리와 함께 검색"
    : "검색어를 입력하세요 (예: 오늘, 속보, 금리)";

  return (
    <form
      className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="news-search" className="sr-only">
        뉴스 검색어
      </label>
      <input
        id="news-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="input-field min-h-[52px] flex-1 disabled:opacity-45"
      />
      <button
        type="submit"
        disabled={isLoading || !canSubmit}
        className="shrink-0 sm:min-w-[120px] rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/40 disabled:pointer-events-none disabled:opacity-50"
      >
        {isLoading ? "검색 중…" : "검색"}
      </button>
    </form>
  );
}
