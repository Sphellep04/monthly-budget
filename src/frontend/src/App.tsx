import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { DownloadSimpleIcon, XIcon } from "@phosphor-icons/react";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { Suspense, lazy, useEffect } from "react";
import { toast } from "sonner";
import { ErrorFallback } from "./components/ErrorFallback";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { useBillReminders } from "./hooks/useBillReminders";
import {
  useApplyRecurringIncome,
  useApplyRecurringTemplates,
  useFlushExpenseOutbox,
} from "./hooks/useBudget";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const BudgetsPage = lazy(() =>
  import("./pages/BudgetsPage").then((m) => ({ default: m.BudgetsPage })),
);
const BudgetDetailPage = lazy(() =>
  import("./pages/BudgetDetailPage").then((m) => ({
    default: m.BudgetDetailPage,
  })),
);
const ChartsPage = lazy(() =>
  import("./pages/ChartsPage").then((m) => ({ default: m.ChartsPage })),
);
const NotesPage = lazy(() =>
  import("./pages/NotesPage").then((m) => ({ default: m.NotesPage })),
);
const AnnualSummaryPage = lazy(() =>
  import("./pages/AnnualSummaryPage").then((m) => ({
    default: m.AnnualSummaryPage,
  })),
);
const InsightsPage = lazy(() =>
  import("./pages/InsightsPage").then((m) => ({ default: m.InsightsPage })),
);
const SearchPage = lazy(() =>
  import("./pages/SearchPage").then((m) => ({ default: m.SearchPage })),
);
const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((m) => ({ default: m.ReportsPage })),
);
const BillsPage = lazy(() =>
  import("./pages/BillsPage").then((m) => ({ default: m.BillsPage })),
);
const TemplatesPage = lazy(() =>
  import("./pages/TemplatesPage").then((m) => ({
    default: m.TemplatesPage,
  })),
);
const IncomePage = lazy(() =>
  import("./pages/IncomePage").then((m) => ({ default: m.IncomePage })),
);
const SavingsGoalsPage = lazy(() =>
  import("./pages/SavingsGoalsPage").then((m) => ({
    default: m.SavingsGoalsPage,
  })),
);
const ReceiptsPage = lazy(() =>
  import("./pages/ReceiptsPage").then((m) => ({ default: m.ReceiptsPage })),
);
const AccountsPage = lazy(() =>
  import("./pages/AccountsPage").then((m) => ({ default: m.AccountsPage })),
);

function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
          <Skeleton key={k} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** Applies recurring templates for the current month on login; toasts on failure only */
function RecurringTemplateApplier() {
  const now = new Date();
  const { isError } = useApplyRecurringTemplates(
    now.getFullYear(),
    now.getMonth() + 1,
  );
  useEffect(() => {
    if (isError) {
      toast.error("Couldn't apply recurring expenses", {
        description: "Some recurring items may be missing this month.",
      });
    }
  }, [isError]);
  return null;
}

/** Applies recurring income for the current month on login; toasts on failure only */
function RecurringIncomeApplier() {
  const now = new Date();
  const { isError } = useApplyRecurringIncome(
    now.getFullYear(),
    now.getMonth() + 1,
  );
  useEffect(() => {
    if (isError) {
      toast.error("Couldn't apply recurring income", {
        description: "Some recurring items may be missing this month.",
      });
    }
  }, [isError]);
  return null;
}

/** Silently checks for bills due soon and surfaces a reminder */
function BillReminderNotifier() {
  useBillReminders();
  return null;
}

/** Retries expenses queued while offline, on load and whenever connectivity returns */
function OfflineOutboxFlusher() {
  const flush = useFlushExpenseOutbox();
  useEffect(() => {
    flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, [flush]);
  return null;
}

/** Slim banner across the top of the shell while the browser is offline */
function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="bg-amber-500/15 border-b border-amber-500/25 px-4 py-1.5 text-center text-xs font-medium text-amber-700 dark:text-amber-400">
      You're offline. Showing your last synced data — new expenses will sync
      once you're back online.
    </div>
  );
}

/** Slim banner offering to install the app, backed by the browser's own
 * install prompt (Chromium only - Safari/iOS has no programmatic prompt, so
 * this never renders there and users add to home screen manually instead). */
function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();
  if (!canInstall) return null;
  return (
    <div className="flex items-center justify-center gap-3 bg-primary/10 border-b border-primary/20 px-4 py-1.5 text-xs font-medium text-primary">
      <span>Install BudgetWise for quicker access and offline use.</span>
      <button
        type="button"
        onClick={promptInstall}
        className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 transition-colors-fast hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <DownloadSimpleIcon weight="bold" className="w-3.5 h-3.5" />
        Install
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-primary/70 hover:text-primary focus-visible:outline-none"
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/** Keeps the iOS status-bar style legible against the resolved theme -
 * translucent (white status-bar text) only reads well over the dark theme's
 * near-black background; the light theme's warm cream background needs the
 * opaque "default" bar instead, or the status bar text washes out. Only
 * mounted once authenticated - LoginPage always forces the light theme on
 * itself regardless of the user's actual preference, so the pre-auth/initial
 * meta value (set in index.html) already matches it. Resets on unmount
 * (e.g. logout) so a stale dark-mode value doesn't leak onto that page. */
function StatusBarThemeSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const meta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    );
    if (!meta) return;
    meta.setAttribute(
      "content",
      resolvedTheme === "dark" ? "black-translucent" : "default",
    );
    return () => meta.setAttribute("content", "default");
  }, [resolvedTheme]);
  return null;
}

function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <StatusBarThemeSync />
      <OfflineBanner />
      <InstallBanner />
      <RecurringTemplateApplier />
      <RecurringIncomeApplier />
      <BillReminderNotifier />
      <OfflineOutboxFlusher />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
  errorComponent: ErrorFallback,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthGuard,
});

// Sibling of authRoute (not a child) so it renders on its own regardless of
// normal sign-in state - the recovery link puts the user in a temporary
// session, not the "actually signed in" state AuthGuard checks for.
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => authRoute,
  id: "layout",
  component: Layout,
  // Isolates page crashes to the content area - sidebar/nav stay usable
  // instead of the whole shell going down with one broken chart.
  errorComponent: ErrorFallback,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});

const budgetsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/budgets",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BudgetsPage />
    </Suspense>
  ),
});

const budgetDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/budgets/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BudgetDetailPage />
    </Suspense>
  ),
});

const chartsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/charts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ChartsPage />
    </Suspense>
  ),
});

const notesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/notes",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <NotesPage />
    </Suspense>
  ),
});

const annualSummaryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/annual-summary",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AnnualSummaryPage />
    </Suspense>
  ),
});

const insightsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/insights",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <InsightsPage />
    </Suspense>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/search",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SearchPage />
    </Suspense>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reports",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReportsPage />
    </Suspense>
  ),
});

const billsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bills",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BillsPage />
    </Suspense>
  ),
});

const templatesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/templates",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TemplatesPage />
    </Suspense>
  ),
});

const incomeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/income",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <IncomePage />
    </Suspense>
  ),
});

const savingsGoalsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/savings-goals",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SavingsGoalsPage />
    </Suspense>
  ),
});

const receiptsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/receipts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReceiptsPage />
    </Suspense>
  ),
});

const accountsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/accounts",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AccountsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  resetPasswordRoute,
  authRoute.addChildren([
    layoutRoute.addChildren([
      dashboardRoute,
      budgetsRoute,
      budgetDetailRoute,
      chartsRoute,
      notesRoute,
      annualSummaryRoute,
      insightsRoute,
      searchRoute,
      reportsRoute,
      billsRoute,
      templatesRoute,
      incomeRoute,
      savingsGoalsRoute,
      receiptsRoute,
      accountsRoute,
    ]),
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
