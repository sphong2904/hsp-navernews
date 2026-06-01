export interface NaverNewsItemRaw {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsApiResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItemRaw[];
}

export interface NewsArticle {
  title: string;
  description: string;
  originallink: string;
  link: string;
  pubDate: string;
  pubDateFormatted: string;
  source: string;
}

import type { NewsCategoryId } from "./news-categories";

export type { NewsCategoryId };

export interface NewsApiSuccess {
  query: string;
  userQuery: string;
  category: NewsCategoryId;
  categoryLabel: string;
  total: number;
  display: number;
  filteredFrom?: number;
  lastBuildDate: string;
  fetchedAt: string;
  items: NewsArticle[];
}

export interface NewsApiError {
  error: string;
  code?: string;
}

export interface SummarizeRequest {
  title: string;
  description: string;
}

export interface SummarizeSuccess {
  summary: string;
  model: string;
}

export interface SummarizeError {
  error: string;
}
