import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:3001"
    ),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  base: "/",
});
