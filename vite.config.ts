import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isPlugin = mode === "plugin";
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.AS_PLUGIN": JSON.stringify(isPlugin),
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
