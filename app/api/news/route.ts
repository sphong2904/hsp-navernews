import { NextRequest, NextResponse } from "next/server";
import { fetchNaverNews } from "@/lib/naver-news";
import type { NewsApiError } from "@/lib/types";

const DEFAULT_QUERY = "오늘";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() || DEFAULT_QUERY;

  try {
    const data = await fetchNaverNews(query, 50);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    const body: NewsApiError = { error: message };
    const status = message.includes("설정되지 않았습니다") ? 500 : 400;

    return NextResponse.json(body, { status });
  }
}
