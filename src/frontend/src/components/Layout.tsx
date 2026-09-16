import { Outlet } from "@tanstack/react-router";
import { MobileTabBar } from "./MobileTabBar";
import { PageErrorBoundary } from "./PageErrorBoundary";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {/* Main content - offset only on md+ where sidebar is visible */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        {/* Top padding below md just clears a notch/status bar (no floating
            button to reserve extra room for anymore). Bottom padding
            reserves room for the fixed MobileTabBar (4rem tall) plus its own
            safe-area-inset-bottom padding, so page content never sits
            underneath it. */}
        <main className="flex-1 overflow-auto animate-page-enter pt-[env(safe-area-inset-top,0px)] md:pt-0 pb-[calc(env(safe-area-inset-bottom,0px)+4rem)] md:pb-0">
          <div className="page-enter">
            <PageErrorBoundary>
              <Outlet />
            </PageErrorBoundary>
          </div>
        </main>
        <footer className="hidden md:flex bg-card border-t border-border/60 px-6 pt-3.5 pb-3.5 items-center justify-center">
          <span className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} BudgetWise
          </span>
        </footer>
      </div>
      <MobileTabBar />
    </div>
  );
}
