import { Link } from "@tanstack/react-router";

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  const linkBase =
    "text-sm text-muted-foreground hover:text-foreground transition";
  const activeCls = "text-foreground font-medium";

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold">
            R
          </div>
          <span className="font-semibold tracking-tight">Resumely</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkBase} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/builder" className={linkBase} activeProps={{ className: activeCls }}>
            Builder
          </Link>
          <Link to="/checker" className={linkBase} activeProps={{ className: activeCls }}>
            Recruiter Review
          </Link>
        </nav>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
