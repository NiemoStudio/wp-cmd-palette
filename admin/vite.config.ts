import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeDir = __dirname.split("/").pop();

// https://vite.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        assetFileNames: "assets/[name]-[hash].[ext]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
      jsxImportSource: "react",
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [themeDir + ".local"],
    cors: true,
    host: true,
    port: 5175,
    watch: {
      ignored: ["!**/node_modules/**"],
      usePolling: true,
    },
  },
});
