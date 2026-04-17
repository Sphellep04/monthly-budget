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
        <footer className="bg-card/80 border-t border-border/60 backdrop-blur-sm px-6 py-3.5 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} BudgetWise
          </span>
        </footer>
      </div>
    </div>
  );
}
