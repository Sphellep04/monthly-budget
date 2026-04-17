import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  Bell,
  BookTemplate,
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
  icon: React.ElementType;
}

const NAV_MAIN: NavItem[] = [
  { label: "Dashboard",      href: "/",               icon: LayoutDashboard },
  { label: "Budgets",        href: "/budgets",         icon: Wallet          },
  { label: "Charts",         href: "/charts",          icon: BarChart2       },
  { label: "Annual Summary", href: "/annual-summary",  icon: CalendarDays    },
  { label: "Insights",       href: "/insights",        icon: Lightbulb       },
  { label: "Bills",          href: "/bills",           icon: Bell            },
];

const NAV_TOOLS: NavItem[] = [
  { label: "Templates", href: "/templates", icon: BookTemplate },
  { label: "Search",    href: "/search",    icon: Search       },
  { label: "Notes",     href: "/notes",     icon: StickyNote   },
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
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-xl text-[0.8125rem] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon
        size={16}
        strokeWidth={isActive ? 2.5 : 2}
        className={cn(
          "flex-shrink-0 transition-all duration-150",
          isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-sidebar-accent-foreground",
        )}
      />
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
      <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em]">
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
}: {
  onNavClick?: () => void;
  onSettingsOpen: () => void;
}) {
  const { logout } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-sm">
              <TrendingUp size={18} strokeWidth={2.5} className="text-primary-foreground" />
            </div>
          </div>
          <div>
            <p className="font-display font-bold text-[1.05rem] text-sidebar-foreground tracking-tight leading-none">
              BudgetWise
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-mono mt-0.5 tracking-widest uppercase">
              Finance
            </p>
          </div>
        </div>
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
      <div className="px-3 py-4 border-t border-sidebar-border/50 space-y-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsOpen}
          className="w-full justify-start gap-3 text-[0.8125rem] text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 rounded-xl h-9 px-3 font-medium"
        >
          <Settings size={15} strokeWidth={2} className="flex-shrink-0" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-3 text-[0.8125rem] text-muted-foreground/70 hover:text-destructive hover:bg-destructive/8 rounded-xl h-9 px-3 font-medium"
        >
          <LogOut size={15} strokeWidth={2} className="flex-shrink-0" />
          Sign out
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
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-card border border-border shadow-elevated hover:bg-muted active:scale-95 transition-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <span className={cn("transition-spring", mobileOpen ? "rotate-90" : "rotate-0")}>
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </span>
      </button>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-smooth",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        style={{ background: "oklch(0 0 0 / 0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
        onClick={() => setMobileOpen(false)}
        onKeyDown={(e) => e.key === "Enter" && setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-premium md:hidden transition-smooth",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarInner
          onNavClick={() => setMobileOpen(false)}
          onSettingsOpen={() => { setMobileOpen(false); setSettingsOpen(true); }}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 h-screen bg-sidebar border-r border-sidebar-border/70 flex-col sticky top-0">
        <SidebarInner onSettingsOpen={() => setSettingsOpen(true)} />
      </aside>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
