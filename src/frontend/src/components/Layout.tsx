import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {/* Main content - offset only on md+ where sidebar is visible */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <main className="flex-1 overflow-auto animate-page-enter">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
        <footer className="bg-card border-t border-border/60 px-6 pt-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} BudgetWise
          </span>
        </footer>
      </div>
    </div>
  );
}
