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
    port: 3000,
    cors: true
  },
define: {
  global: 'globalThis',
  // Remove this line: 'process.env': {}
},
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
    },
    // Fix for Vercel deployment
    sourcemap: false,
    // Use esbuild instead of terser for better compatibility
    minify: 'esbuild',
    target: 'esnext',
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 3000,
    cors: true
  }
})