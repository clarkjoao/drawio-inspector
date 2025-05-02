import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { writeFileSync, readFileSync, existsSync } from "fs";

export default defineConfig(({ mode }) => {
  const isPlugin = mode === "plugin";

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.AS_PLUGIN": JSON.stringify(isPlugin),
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: isPlugin
      ? {
          lib: {
            entry: path.resolve(__dirname, "src/plugin.tsx"),
            formats: ["iife"],
            name: "ReactDrawioPlugin",
            fileName: () => "replay.js",
          },
          rollupOptions: {
            output: {
              globals: {},
            },
          },
          cssCodeSplit: true,
          assetsInlineLimit: 0,
          outDir: "dist/plugin",
          emptyOutDir: true,
          minify: true,
          sourcemap: false,
          async writeBundle() {
            const bundlePath = path.resolve(__dirname, "dist/plugin/replay.js");
            const cssPath = path.resolve(__dirname, "dist/plugin/style.css");
            const outputPath = path.resolve(
              __dirname,
              "dist/plugin/replay-inline.js"
            );

            const bundleContent = readFileSync(bundlePath, "utf-8");
            const base64Bundle = Buffer.from(bundleContent).toString("base64");

            let cssContent = "";
            if (existsSync(cssPath)) {
              cssContent = readFileSync(cssPath, "utf-8");
            }

            const cssInjection = cssContent
              ? `
                (function() {
                  var style = document.createElement('style');
                  style.textContent = \`${cssContent.replace(/`/g, "\\`")}\`;
                  document.head.appendChild(style);
                })();
              `.trim()
              : "";

            const loaderScript = `
              (function() {
                ${cssInjection}

                const base64 = '${base64Bundle}';
                const decoded = atob(base64);
                const blob = new Blob([decoded], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);

                const script = document.createElement('script');
                script.src = url;
                script.onload = () => {
                  console.log('✅ Plugin ReactDrawio carregado!');
                  if (window.ReactDrawioPlugin && window.ReactDrawioPlugin.init) {
                    window.ReactDrawioPlugin.init();
                  }
                };
                document.body.appendChild(script);
              })();
            `.trim();

            writeFileSync(outputPath, loaderScript);
            console.log("✅ Plugin Base64 inline com CSS gerado com sucesso!");
          },
        }
      : {
          outDir: "dist/app",
          emptyOutDir: false,
        },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
