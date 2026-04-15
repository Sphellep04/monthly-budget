import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {/* Main content — offset only on md+ where sidebar is visible */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <main className="flex-1 overflow-auto animate-page-enter">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
        <footer className="bg-card/80 border-t border-border/60 backdrop-blur-sm px-6 py-3.5 flex items-center justify-center gap-1.5">
          <span className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()}.
          </span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors-fast underline-offset-2 hover:underline"
          >
            Built with love using caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
