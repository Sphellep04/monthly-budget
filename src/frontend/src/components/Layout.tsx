import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {/* Main content - offset only on md+ where sidebar is visible */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        {/* Top padding below md reserves room for the fixed mobile menu
            button (Sidebar.tsx) so it never overlaps the page's own header -
            env() term covers devices with a real safe-area inset on top of
            the button's own height and offset. */}
        <main className="flex-1 overflow-auto animate-page-enter pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] md:pt-0">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
        <footer className="bg-card border-t border-border/60 px-6 pt-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom,0px))] flex items-center justify-center">
          <span className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} BudgetWise
          </span>
        </footer>
      </div>
    </div>
  );
}
