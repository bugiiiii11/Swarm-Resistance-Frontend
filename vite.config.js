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
    // Add CORS headers for development
    cors: true
  },
  define: {
    global: 'globalThis',
    // Ensure environment variables are available
    'process.env': {}
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
    // Ensure source maps for better debugging
    sourcemap: false, // Set to true if you need debugging in production
    // Optimize build for production
    minify: 'terser',
    target: 'esnext'
  },
  // Preview configuration for Vercel
  preview: {
    port: 3000,
    cors: true
  }
})