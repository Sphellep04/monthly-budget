import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  define: {
    // Stub Supabase env so importing supabaseClient.ts doesn't throw in tests
    // that don't touch the network — keeps tests hermetic regardless of .env.local.
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      "http://localhost:54321",
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify("test-anon-key"),
  },
  test: {
    environment: "node",
  },
});
