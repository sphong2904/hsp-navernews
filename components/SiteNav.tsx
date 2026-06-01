export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-10 border-b border-ghost-border bg-paper-white">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-8">
        <span className="text-body font-medium leading-[1.4] text-midnight-ink">
          Daily Brief
        </span>
        <span className="text-body font-medium leading-[1.4] text-midnight-ink rounded-full border border-ghost-border bg-paper-white px-2.5 py-1 pointer-events-none">
          네이버 뉴스레터
        </span>
      </div>
    </nav>
  );
}
