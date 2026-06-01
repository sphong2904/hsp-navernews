"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NewsApiError, NewsApiSuccess } from "@/lib/types";
import NewsHeader from "./NewsHeader";
import NewsList from "./NewsList";
import NewsPagination from "./NewsPagination";
import SearchBar from "./SearchBar";
import SiteNav from "./SiteNav";

const DEFAULT_QUERY = "오늘";
const PAGE_SIZE = 30;

export default function Newsletter() {
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);
  const [data, setData] = useState<NewsApiSuccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchNews = useCallback(async (query: string) => {
    setCurrentPage(1);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/news?q=${encodeURIComponent(query.trim())}`
      );
      const json: NewsApiSuccess | NewsApiError = await response.json();

      if (!response.ok) {
        const err = json as NewsApiError;
        throw new Error(err.error ?? "뉴스를 불러오지 못했습니다.");
      }

      setData(json as NewsApiSuccess);
      setActiveQuery((json as NewsApiSuccess).query);
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error ? err.message : "뉴스를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNews(DEFAULT_QUERY);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchNews]);

  const handleSearch = () => {
    const query = searchInput.trim();
    if (!query) return;
    fetchNews(query);
  };

  const allItems = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = allItems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    const next = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SiteNav />
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-col gap-8">
          <NewsHeader
            query={activeQuery}
            total={data?.total ?? 0}
            itemCount={data?.items.length ?? 0}
            fetchedAt={data?.fetchedAt ?? null}
          />

          <div className="mx-auto w-full max-w-[42rem]">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSubmit={handleSearch}
              isLoading={isLoading}
            />
          </div>

          <div ref={listRef} className="flex flex-col gap-8 scroll-mt-24">
            <NewsList
              items={pageItems}
              isLoading={isLoading}
              error={error}
              startIndex={(safePage - 1) * PAGE_SIZE}
            />

            {!isLoading && !error && allItems.length > 0 && (
              <NewsPagination
                currentPage={safePage}
                totalPages={totalPages}
                pageSize={PAGE_SIZE}
                totalItems={allItems.length}
                onPageChange={handlePageChange}
                disabled={isLoading}
              />
            )}
          </div>

          <footer className="border-t border-ghost-border pt-8 text-center">
            <p className="text-caption">
              뉴스 데이터 제공: 네이버 검색 API · Daily Brief
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
