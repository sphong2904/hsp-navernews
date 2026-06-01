import type { NewsArticle } from "@/lib/types";
import {
  SummarizeButton,
  SummarizePanel,
  SummarizeProvider,
} from "./ArticleSummarize";

interface NewsCardProps {
  index: number;
  article: NewsArticle;
}

export default function NewsCard({ index, article }: NewsCardProps) {
  const articleUrl = article.originallink || article.link;
  const articleKey = `${article.link}-${index}`;

  return (
    <article className="h-full flex flex-col rounded-2xl bg-paper-white p-6 shadow-sm border border-ghost-border transition-all duration-300 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1">
      <SummarizeProvider
        articleKey={articleKey}
        title={article.title}
        description={article.description}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
            {index}
          </span>
          <SummarizeButton />
        </div>
        
        <div className="flex flex-col flex-1">
          <h2 className="text-heading-sm font-display font-semibold text-midnight-ink transition-colors hover:text-indigo-600 line-clamp-2 mb-3">
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
          </h2>
          
          <p className="text-body leading-relaxed text-muted-ash flex-1">
            {article.description}
          </p>
          
          <SummarizePanel />
          
          <div className="mt-6 pt-4 border-t border-ghost-border flex flex-wrap items-center justify-between gap-2">
            <div className="text-caption flex items-center gap-2">
              <span className="font-medium text-midnight-ink">{article.source}</span>
              <span className="text-gray-300" aria-hidden="true">|</span>
              <time dateTime={article.pubDate} className="text-gray-500">{article.pubDateFormatted}</time>
            </div>
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              원문 보기 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </SummarizeProvider>
    </article>
  );
}
