import { NextRequest, NextResponse } from "next/server";
import { summarizeArticle } from "@/lib/openrouter";
import type { SummarizeError, SummarizeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  let body: SummarizeRequest;

  try {
    body = await request.json();
  } catch {
    const errorBody: SummarizeError = {
      error: "요청 형식이 올바르지 않습니다.",
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const title = body.title?.trim() ?? "";
  const description = body.description?.trim() ?? "";

  if (!title || !description) {
    const errorBody: SummarizeError = {
      error: "제목과 요약문이 필요합니다.",
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  try {
    const result = await summarizeArticle(title, description);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    const errorBody: SummarizeError = { error: message };
    const status = message.includes("설정되지 않았습니다") ? 500 : 502;
    return NextResponse.json(errorBody, { status });
  }
}
