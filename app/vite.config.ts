import { wasp } from "wasp/client/vite"
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [wasp(), tailwindcss()],
  server: {
    open: true,
    proxy: {
      // Proxyfie le endpoint SSE vers le serveur Wasp pour éviter les problèmes CORS.
      // Les routes /operations ont le middleware CORS global, mais pas les routes /api custom.
      '/api/chat-stream': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
