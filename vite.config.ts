import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      host: "bob",
    },
    changeOrigin: true,
    proxy: {
      // Proxy all API requests starting with /api to the Directus server
      '/api': {
        target: 'https://directus.kaascan.com',
        changeOrigin: true,
        secure: false, // If using self-signed SSL certs
        rewrite: (path) =>
          path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
