import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  CalendarDays,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Search,
  Settings,
  StickyNote,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { SettingsModal } from "./SettingsModal";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  ocid: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard size={17} />,
    ocid: "sidebar.dashboard.link",
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: <Wallet size={17} />,
    ocid: "sidebar.budgets.link",
  },
  {
    label: "Charts",
    href: "/charts",
    icon: <BarChart2 size={17} />,
    ocid: "sidebar.charts.link",
  },
  {
    label: "Annual Summary",
    href: "/annual-summary",
    icon: <CalendarDays size={17} />,
    ocid: "sidebar.annual_summary.link",
  },
  {
    label: "Insights",
    href: "/insights",
    icon: <Lightbulb size={17} />,
    ocid: "sidebar.insights.link",
  },
  {
    label: "Search",
    href: "/search",
    icon: <Search size={17} />,
    ocid: "sidebar.search.link",
  },
  {
    label: "Notes",
    href: "/notes",
    icon: <StickyNote size={17} />,
    ocid: "sidebar.notes.link",
  },
];

function SidebarInner({
  onNavClick,
  onSettingsOpen,
}: {
  onNavClick?: () => void;
  onSettingsOpen: () => void;
}) {
  const { logout } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/20 text-primary shadow-glow-sm">
          <TrendingUp size={17} strokeWidth={2.2} />
          {/* Inner glow ring */}
          <div className="absolute inset-0 rounded-xl ring-1 ring-primary/30" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-[1.05rem] text-sidebar-foreground tracking-tight leading-none">
            BudgetWise
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-mono mt-0.5 tracking-wider">
            FINANCE TRACKER
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.12em] px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item, i) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={item.ocid}
              onClick={onNavClick}
              style={{ animationDelay: `${i * 40}ms` }}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.8375rem] font-medium transition-colors-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1",
                isActive
                  ? "nav-active-indicator bg-primary/12 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 transition-colors-fast",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/70 group-hover:text-sidebar-accent-foreground",
                )}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_oklch(var(--primary)/0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border/60" />

      {/* User section / Settings / Logout */}
      <div className="px-3 py-4 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsOpen}
          data-ocid="sidebar.settings_button"
          className="w-full justify-start gap-3 text-[0.8125rem] text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors-fast rounded-lg h-9 px-3"
        >
          <Settings size={15} className="flex-shrink-0" />
          <span>Settings</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          data-ocid="sidebar.logout_button"
          className="w-full justify-start gap-3 text-[0.8125rem] text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors-fast rounded-lg h-9 px-3"
        >
          <LogOut size={15} className="flex-shrink-0" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-card border border-border shadow-elevated transition-spring",
          "hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
        data-ocid="sidebar.toggle"
      >
        <span
          className={cn(
            "transition-spring",
            mobileOpen ? "rotate-90" : "rotate-0",
          )}
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </span>
      </button>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-smooth",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{
          background: "oklch(0 0 0 / 0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
        onClick={() => setMobileOpen(false)}
        onKeyDown={(e) => e.key === "Enter" && setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-premium md:hidden",
          "transition-smooth",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarInner
          onNavClick={() => setMobileOpen(false)}
          onSettingsOpen={() => {
            setMobileOpen(false);
            setSettingsOpen(true);
          }}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 h-screen bg-sidebar border-r border-sidebar-border/80 flex-col sticky top-0 shadow-[1px_0_0_0_oklch(var(--sidebar-border)/0.8)]">
        <SidebarInner onSettingsOpen={() => setSettingsOpen(true)} />
      </aside>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
