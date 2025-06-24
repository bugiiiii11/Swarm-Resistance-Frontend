import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  server: {
    port: 3000
  },
  define: {
    global: 'globalThis',
  },
  // MINIMAL ADDITION - Only add this one line for react-unity-webgl
  optimizeDeps: {
    include: ['react-unity-webgl']
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'favicon.png') {
            return 'Favicon.[ext]'
          }
          return '[name].[hash].[ext]'
        }
      }
    }
  }
})