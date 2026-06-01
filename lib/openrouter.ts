import type { SummarizeSuccess } from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_MODELS = [
  "openai/gpt-oss-120b:free",
  "google/gemma-4-31b-it:free",
] as const;

const SYSTEM_PROMPT =
  "당신은 뉴스 요약 전문가입니다. 주어진 제목과 요약문을 바탕으로 핵심만 한국어 2~3문장으로 간결하게 정리하세요. 불필요한 수식어, 인사말, 마크다운은 사용하지 마세요.";

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

function getApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해 주세요."
    );
  }
  return apiKey;
}

function mapOpenRouterError(status: number, body: string): string {
  if (status === 401) {
    return "OpenRouter API 키가 유효하지 않습니다.";
  }
  if (status === 429) {
    return "요청 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (status >= 500) {
    return "AI 서비스에 일시적인 오류가 발생했습니다.";
  }
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } };
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // ignore parse errors
  }
  return `AI 요약에 실패했습니다. (HTTP ${status})`;
}

async function callModel(
  model: string,
  title: string,
  description: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getSiteUrl(),
      "X-OpenRouter-Title": "Daily Brief",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `제목: ${title}\n요약: ${description}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(mapOpenRouterError(response.status, bodyText));
  }

  const data = JSON.parse(bodyText) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("AI 응답이 비어 있습니다.");
  }

  return content;
}

export async function summarizeArticle(
  title: string,
  description: string
): Promise<SummarizeSuccess> {
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle || !trimmedDescription) {
    throw new Error("요약할 제목과 내용이 필요합니다.");
  }

  const apiKey = getApiKey();
  let lastError: Error | null = null;

  for (const model of FREE_MODELS) {
    try {
      const summary = await callModel(
        model,
        trimmedTitle,
        trimmedDescription,
        apiKey
      );
      return { summary, model };
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("알 수 없는 오류");
    }
  }

  throw lastError ?? new Error("AI 요약에 실패했습니다.");
}
