import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/sorium": {
        target: "https://api.sorium.openverse.tech",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sorium/, ""),
      },
    },
    allowedHosts: [
      ".csb.app",
      ".codesandbox.io",
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
    ],
  },
});
