import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { useApplyRecurringTemplates } from "./hooks/useBudget";

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

/** Silently applies recurring templates for the current month on login */
function RecurringTemplateApplier() {
  const now = new Date();
  useApplyRecurringTemplates(now.getFullYear(), now.getMonth() + 1);
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
      <RecurringTemplateApplier />
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
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthGuard,
});

const layoutRoute = createRoute({
  getParentRoute: () => authRoute,
  id: "layout",
  component: Layout,
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

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([
    layoutRoute.addChildren([
      dashboardRoute,
      budgetsRoute,
      budgetDetailRoute,
      chartsRoute,
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
  return <RouterProvider router={router} />;
}
