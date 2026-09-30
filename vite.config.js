import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em desenvolvimento, as chamadas para /api são repassadas ao backend Flask.
// Ajuste o endereço se o backend rodar em outra porta.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
