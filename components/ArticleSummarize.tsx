"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SummarizeError, SummarizeSuccess } from "@/lib/types";

interface SummarizeContextValue {
  articleKey: string;
  isOpen: boolean;
  isLoading: boolean;
  summary: string | null;
  model: string | null;
  error: string | null;
  handleClick: () => void;
}

const SummarizeContext = createContext<SummarizeContextValue | null>(null);

function useSummarizeContext() {
  const ctx = useContext(SummarizeContext);
  if (!ctx) {
    throw new Error("Summarize components must be used within SummarizeProvider");
  }
  return ctx;
}

interface SummarizeProviderProps {
  articleKey: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function SummarizeProvider({
  articleKey,
  title,
  description,
  children,
}: SummarizeProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const json: SummarizeSuccess | SummarizeError = await response.json();

      if (!response.ok) {
        const err = json as SummarizeError;
        throw new Error(err.error ?? "요약에 실패했습니다.");
      }

      const data = json as SummarizeSuccess;
      setSummary(data.summary);
      setModel(data.model);
      setIsOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "요약을 불러오지 못했습니다."
      );
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [title, description]);

  const handleClick = useCallback(() => {
    if (isLoading) return;

    if (summary) {
      setIsOpen((prev) => !prev);
      return;
    }

    if (isOpen && error) {
      setIsOpen(false);
      return;
    }

    fetchSummary();
  }, [isLoading, summary, isOpen, error, fetchSummary]);

  const value = useMemo(
    () => ({
      articleKey,
      isOpen,
      isLoading,
      summary,
      model,
      error,
      handleClick,
    }),
    [articleKey, isOpen, isLoading, summary, model, error, handleClick]
  );

  return (
    <SummarizeContext.Provider value={value}>{children}</SummarizeContext.Provider>
  );
}

export function SummarizeButton() {
  const { isOpen, isLoading, summary, handleClick, articleKey } =
    useSummarizeContext();

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-expanded={isOpen}
      aria-controls={`summary-${articleKey}`}
      className="shrink-0 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-100 transition-all duration-200 hover:bg-indigo-100 hover:border-indigo-200 disabled:pointer-events-none disabled:opacity-50"
    >
      {isLoading ? "요약 중…" : summary && isOpen ? "접기" : "✨ AI 요약"}
    </button>
  );
}

export function SummarizePanel() {
  const { articleKey, isOpen, isLoading, summary, model, error } =
    useSummarizeContext();

  if (!isOpen) return null;

  return (
    <div
      id={`summary-${articleKey}`}
      className={`mt-4 rounded-xl border p-4 shadow-inner ${
        error
          ? "border-red-200 bg-red-50"
          : "border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/80"
      }`}
    >
      {isLoading && (
        <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711L6.34315 17.6569C4.88764 16.2014 4 14.2014 4 12C4 7.58172 7.58172 4 12 4V2Z" fill="currentColor" />
          </svg>
          <span className="text-sm font-medium">AI가 핵심 내용을 분석하고 있습니다...</span>
        </div>
      )}
      {!isLoading && error && (
        <>
          <p className="text-sm font-bold text-red-700">요약 실패</p>
          <p className="text-sm mt-1 text-red-600">{error}</p>
        </>
      )}
      {!isLoading && summary && (
        <>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-lg">✨</span>
            <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI 핵심 요약
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-gray-800">{summary}</p>
          {model && (
            <div className="mt-3 flex justify-end">
              <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-white/60 text-indigo-400 border border-indigo-100/50">
                Powered by {model.split("/").pop()}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
