import { NextRequest, NextResponse } from "next/server";
import { isValidCategoryId } from "@/lib/news-categories";
import { fetchFilteredNews } from "@/lib/news-search";
import type { NewsApiError } from "@/lib/types";
import type { NewsCategoryId } from "@/lib/news-categories";

const DEFAULT_QUERY = "오늘";
const DEFAULT_CATEGORY: NewsCategoryId = "all";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() || DEFAULT_QUERY;
  const categoryParam = searchParams.get("category")?.trim() || DEFAULT_CATEGORY;

  if (!isValidCategoryId(categoryParam)) {
    const body: NewsApiError = {
      error: "알 수 없는 카테고리입니다.",
      code: "INVALID_CATEGORY",
    };
    return NextResponse.json(body, { status: 400 });
  }

  try {
    const data = await fetchFilteredNews(query, categoryParam);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    const body: NewsApiError = { error: message };
    const status = message.includes("설정되지 않았습니다") ? 500 : 400;

    return NextResponse.json(body, { status });
  }
}
