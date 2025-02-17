import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react-swc'
// @ts-expect-error --- TODO - fix this later
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
export default defineConfig(({ mode }) => ({
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
      pure: mode === 'production' ? ['console.log', 'console.info', 'console.warn'] : []
    },
    build: {
      minify: true,
      cssMinify: true,
      rollupOptions: {
        treeshake: true,
        perf: true,
        input: [
          resolve(__dirname, 'src/renderer/index.html'),
          resolve(__dirname, 'src/renderer/copy-widget.html')
        ]
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@editor': resolve(__dirname, 'src/renderer/src/minimal-tiptap/')
      }
    },
    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), react()]
  }
}))
