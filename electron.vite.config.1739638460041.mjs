// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
var __electron_vite_injected_dirname = "C:\\Users\\pc\\Desktop\\learn-electron";
var electron_vite_config_default = defineConfig(({ mode }) => ({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    esbuild: {
      treeShaking: true,
      color: true,
      pure: mode === "production" ? ["console.log", "console.info", "console.warn"] : []
    },
    build: {
      minify: true,
      cssMinify: true,
      rollupOptions: {
        treeshake: true,
        perf: true,
        input: [
          resolve(__electron_vite_injected_dirname, "src/renderer/index.html"),
          resolve(__electron_vite_injected_dirname, "src/renderer/copy-widget.html")
        ]
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve(__electron_vite_injected_dirname, "src/renderer/src"),
        "@editor": resolve(__electron_vite_injected_dirname, "src/renderer/src/minimal-tiptap/")
      }
    },
    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react()]
  }
}));
export {
  electron_vite_config_default as default
};
