import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Brief — 네이버 뉴스레터",
  description: "네이버 뉴스 API로 최신 뉴스를 정리해 보여주는 뉴스레터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
