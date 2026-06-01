import { NEWS_CATEGORIES, type NewsCategoryId } from "@/lib/news-categories";

interface CategoryFilterProps {
  value: NewsCategoryId;
  onChange: (category: NewsCategoryId) => void;
  disabled?: boolean;
}

export default function CategoryFilter({
  value,
  onChange,
  disabled = false,
}: CategoryFilterProps) {
  return (
    <div
      className="flex flex-col gap-2"
      role="group"
      aria-label="뉴스 카테고리"
    >
      <p className="text-caption font-semibold text-muted-ash">카테고리</p>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        {NEWS_CATEGORIES.map((category) => {
          const selected = value === category.id;
          return (
            <button
              key={category.id}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(category.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-caption font-semibold transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed ${
                selected
                  ? "border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                  : "border-ghost-border bg-paper-white text-midnight-ink hover:border-indigo-200 hover:bg-indigo-50/50"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
