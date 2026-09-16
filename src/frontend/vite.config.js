import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    exclude: ["next-themes"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/*.png"],
      manifest: {
        name: "BudgetWise | Your Monthly Budget Tracker",
        short_name: "BudgetWise",
        description: "Track your monthly budgets and expenses with clarity.",
        theme_color: "#005e26",
        background_color: "#f9f5eb",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/pwa-72x72.png",   sizes: "72x72",   type: "image/png" },
          { src: "/icons/pwa-96x96.png",   sizes: "96x96",   type: "image/png" },
          { src: "/icons/pwa-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/pwa-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/pwa-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/pwa-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/icons/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            // Data requests must always hit the network live - a stale cached
            // response here would show the wrong balance. Query persistence
            // (see src/lib/queryPersister.ts) is what makes reads work offline;
            // this rule intentionally does not cache.
            urlPattern: /^https:\/\/[^/]+\.supabase\.co\/.*/i,
            handler: "NetworkOnly",
          },
          {
            // Fonts are loaded live from Google Fonts (see the @import at the
            // top of index.css) rather than self-hosted, so this is what
            // makes them available offline instead of falling back to a
            // system font every time there's no connection.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Tesseract.js fetches its OCR engine (wasm core) and trained
            // language data from a CDN at runtime - several MB on first scan.
            // Cache them so repeat scans, including offline ones, don't re-fetch.
            urlPattern:
              /^https:\/\/(cdn\.jsdelivr\.net\/npm\/tesseract\.js-core|tessdata\.projectnaptha\.com)\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "tesseract-ocr-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
