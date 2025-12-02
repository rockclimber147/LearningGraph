/// <reference types="vitest" />
import { defineConfig } from 'vite' // This imports Vite’s config wrapper so TypeScript gets correct types and autocomplete
import react from '@vitejs/plugin-react' // Vite doesn't understand JSX or React by default
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ // Enables the Vite React plugin
      babel: { // Tells the React plugin to load additional Babel plugins
        plugins: [['babel-plugin-react-compiler']], // This enables the new React Compiler
      },
    }),
    tailwindcss()
  ],
  test: {
    globals: true,        // use describe, it, expect globally
    environment: 'jsdom', // simulate browser
    include: ['**/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}'], // include TS files
    setupFiles: './src/setupTests.ts', // optional global setup
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
      },
    },
  }
});
