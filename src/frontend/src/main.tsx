import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createIndexedDbPersister } from "./lib/queryPersister";

const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Must be at least as long as persistOptions.maxAge below, or
      // TanStack Query would garbage-collect data from memory before the
      // persister ever gets a chance to write it out.
      gcTime: SEVEN_DAYS_MS,
    },
  },
});

const persister = createIndexedDbPersister();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: SEVEN_DAYS_MS,
        buster: "v1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      <App />
    </PersistQueryClientProvider>
  </ThemeProvider>,
);
