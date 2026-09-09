import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { NotificationInbox } from "./NotificationInbox";
import { QuickAddDialog } from "./QuickAddDialog";
import { SettingsModal } from "./SettingsModal";

interface NavItem {
  label: string;
  href: string;
}

const NAV_MAIN: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Budgets", href: "/budgets" },
  { label: "Income", href: "/income" },
  { label: "Savings Goals", href: "/savings-goals" },
  { label: "Accounts", href: "/accounts" },
  { label: "Charts", href: "/charts" },
  { label: "Annual Summary", href: "/annual-summary" },
  { label: "Insights", href: "/insights" },
  { label: "Bills", href: "/bills" },
];

const NAV_TOOLS: NavItem[] = [
  { label: "Templates", href: "/templates" },
  { label: "Search", href: "/search" },
  { label: "Reports", href: "/reports" },
  { label: "Notes", href: "/notes" },
  { label: "Receipts", href: "/receipts" },
];

function NavLink({
  item,
  isActive,
  onClick,
  delay,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
  delay: number;
}) {
  return (
    <Link
      to={item.href}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "flex items-center px-3 py-2 rounded-xl text-[0.8125rem] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavSection({
  label,
  items,
  pathname,
  onNavClick,
  startDelay,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  onNavClick?: () => void;
  startDelay: number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 mb-2 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em]">
        {label}
      </p>
      {items.map((item, i) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <NavLink
            key={item.href}
            item={item}
            isActive={isActive}
            onClick={onNavClick}
            delay={startDelay + i * 35}
          />
        );
      })}
    </div>
  );
}

function SidebarInner({
  onNavClick,
  onSettingsOpen,
  onQuickAddOpen,
}: {
  onNavClick?: () => void;
  onSettingsOpen: () => void;
  onQuickAddOpen: () => void;
}) {
  const { signOut } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      {/* 3rem clears a typical status bar on its own; env() grows it further
          for devices that actually report a safe-area inset (notches, etc). */}
      <div className="px-5 pt-[max(3rem,env(safe-area-inset-top,0px))] pb-4">
        <span className="font-display text-xl font-bold text-sidebar-foreground tracking-tight">
          BudgetWise
        </span>
      </div>

      {/* ── Quick Add ── */}
      <div className="px-3 pb-4">
        <Button
          onClick={onQuickAddOpen}
          className="w-full justify-center text-[0.8125rem] font-semibold rounded-xl h-10 shadow-elevated button-hover"
        >
          Quick Add
        </Button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto pb-4">
        <NavSection
          label="Overview"
          items={NAV_MAIN}
          pathname={pathname}
          onNavClick={onNavClick}
          startDelay={0}
        />
        <NavSection
          label="Tools"
          items={NAV_TOOLS}
          pathname={pathname}
          onNavClick={onNavClick}
          startDelay={NAV_MAIN.length * 35}
        />
      </nav>

      {/* ── Bottom ── */}
      {/* Bottom padding clears the home indicator in standalone PWA mode */}
      <div className="px-3 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] border-t border-sidebar-border/50 space-y-0.5">
        <NotificationInbox />
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsOpen}
          className="w-full justify-start text-[0.8125rem] text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-xl h-9 px-3 font-medium"
        >
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-[0.8125rem] text-muted-foreground/70 hover:text-destructive hover:bg-destructive/8 rounded-xl h-9 px-3 font-medium"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle - 1rem clears typical chrome on its own; env() grows it
          further on devices that report a real safe-area inset */}
      <button
        type="button"
        className="fixed top-[max(1rem,env(safe-area-inset-top,0px))] left-[max(1rem,env(safe-area-inset-left,0px))] z-50 md:hidden flex items-center justify-center h-9 px-3.5 rounded-xl bg-card border border-border shadow-elevated hover:bg-muted active:scale-95 transition-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 text-[0.8125rem] font-medium"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        Menu
      </button>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-sidebar border-sidebar-border md:hidden"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarInner
            onNavClick={() => setMobileOpen(false)}
            onSettingsOpen={() => {
              setMobileOpen(false);
              setSettingsOpen(true);
            }}
            onQuickAddOpen={() => {
              setMobileOpen(false);
              setQuickAddOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 h-screen bg-sidebar border-r border-sidebar-border/70 flex-col sticky top-0">
        <SidebarInner
          onSettingsOpen={() => setSettingsOpen(true)}
          onQuickAddOpen={() => setQuickAddOpen(true)}
        />
      </aside>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <QuickAddDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </>
  );
}
