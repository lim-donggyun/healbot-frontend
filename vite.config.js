import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 80,
      proxy: {
        "/react": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true, // CORS 문제 해결
          rewrite: (path) => path.replace(/^\/react/, ""),
        },
        "/api": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true, // CORS 문제 해결
        },
      },
    },
  };
});
