import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  LayoutDashboard,
  LogOut,
  Menu,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

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
    icon: <LayoutDashboard size={18} />,
    ocid: "sidebar.dashboard.link",
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: <Wallet size={18} />,
    ocid: "sidebar.budgets.link",
  },
  {
    label: "Charts",
    href: "/charts",
    icon: <BarChart2 size={18} />,
    ocid: "sidebar.charts.link",
  },
];

export function Sidebar() {
  const { logout } = useAuth();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
          <TrendingUp size={16} />
        </div>
        <span className="font-display font-semibold text-lg text-sidebar-foreground tracking-tight">
          BudgetWise
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={item.ocid}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <span
                className={cn(
                  "transition-smooth",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Logout */}
      <div className="px-3 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          data-ocid="sidebar.logout_button"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-card border border-border shadow-sm"
        onClick={() => setMobileOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
        data-ocid="sidebar.toggle"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Enter" && setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-smooth md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 h-screen bg-sidebar border-r border-sidebar-border flex-col sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
