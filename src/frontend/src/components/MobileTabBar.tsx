import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  HouseIcon,
  ListIcon,
  PlusIcon,
  ReceiptIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { QuickAddDialog } from "./QuickAddDialog";
import { SettingsModal } from "./SettingsModal";
import { SidebarInner } from "./Sidebar";

interface TabItem {
  label: string;
  href: string;
  icon: typeof HouseIcon;
}

const LEFT_TABS: TabItem[] = [
  { label: "Home", href: "/", icon: HouseIcon },
  { label: "Budgets", href: "/budgets", icon: WalletIcon },
];

const RIGHT_TABS: TabItem[] = [
  { label: "Bills", href: "/bills", icon: ReceiptIcon },
];

function RouteTab({ item, isActive }: { item: TabItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 h-full flex-1 transition-colors-fast focus-visible:outline-none",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon weight={isActive ? "fill" : "regular"} className="w-5 h-5" />
      <span className="text-[10px] font-medium leading-none">{item.label}</span>
    </Link>
  );
}

/**
 * Bottom tab bar shown only below md. Primary nav (hamburger-in-a-drawer)
 * was replaced with this because a hamburger-only mobile nav reads as a
 * responsive website, not an app -- the 5 most-reached-for destinations
 * belong within thumb range at the bottom. "More" still opens the full nav
 * list (everything else) as a side drawer, same as before.
 */
export function MobileTabBar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="grid grid-cols-5 h-16">
          {LEFT_TABS.map((item) => (
            <RouteTab
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setQuickAddOpen(true)}
              aria-label="Quick add"
              className="-mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated active:scale-95 transition-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <PlusIcon weight="bold" className="w-6 h-6" />
            </button>
          </div>

          {RIGHT_TABS.map((item) => (
            <RouteTab
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
            />
          ))}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-label="More"
            className="flex flex-col items-center justify-center gap-1 h-full flex-1 text-muted-foreground transition-colors-fast focus-visible:outline-none"
          >
            <ListIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-sidebar border-sidebar-border md:hidden"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarInner
            onNavClick={() => setMoreOpen(false)}
            onSettingsOpen={() => {
              setMoreOpen(false);
              setSettingsOpen(true);
            }}
            onQuickAddOpen={() => {
              setMoreOpen(false);
              setQuickAddOpen(true);
            }}
          />
        </SheetContent>
      </Sheet>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <QuickAddDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </>
  );
}
