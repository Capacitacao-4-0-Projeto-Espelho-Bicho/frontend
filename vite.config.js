import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Em desenvolvimento, as chamadas para /api são repassadas ao back-end.
// Por padrão vão para a API no Render (SCRUM-96). Para usar um back-end
// local, crie um .env.local com:  VITE_API_ALVO=http://localhost:5000
const API_PADRAO = "https://capacitacao-4-0-api.onrender.com";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const alvo = env.VITE_API_ALVO || API_PADRAO;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: alvo,
          changeOrigin: true,
          secure: true,
          // o Render gratuito leva até ~1 min para acordar
          timeout: 90_000,
          proxyTimeout: 90_000,
        },
      },
    },
  };
});
