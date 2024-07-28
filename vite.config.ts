import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     legacy()
//   ],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: './src/setupTests.ts',
//   }
// })

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.REACT_APP_SUPABASE_URL": JSON.stringify(
        env.REACT_APP_SUPABASE_URL
      ),
      "process.env.REACT_APP_SUPABASE_KEY": JSON.stringify(
        env.REACT_APP_SUPABASE_KEY
      ),
      "process.env.REACT_APP_GOOGLE_MAPS_API": JSON.stringify(
        env.REACT_APP_GOOGLE_MAPS_API
      ),
    },
    plugins: [react(), legacy()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
