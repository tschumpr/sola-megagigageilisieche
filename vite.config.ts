import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/sola-megagigageilisieche/",
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  publicDir: "public",
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
