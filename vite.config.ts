import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure proper handling of dynamic imports for routing
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  // Preview configuration for local testing
  preview: {
    port: 5173,
    strictPort: true
  },
  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
    host: "0.0.0.0",
    // Handle SPA routing in development
    historyApiFallback: true
  },
  optimizeDeps: {
    exclude: ["bippy/dist/jsx-runtime", "bippy/dist/jsx-dev-runtime"]
  }
});