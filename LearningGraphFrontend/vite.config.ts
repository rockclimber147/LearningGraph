import { defineConfig } from 'vite' // This imports Vite’s config wrapper so TypeScript gets correct types and autocomplete
import react from '@vitejs/plugin-react' // Vite doesn't understand JSX or React by default

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ // Enables the Vite React plugin
      babel: { // Tells the React plugin to load additional Babel plugins
        plugins: [['babel-plugin-react-compiler']], // This enables the new React Compiler
      },
    }),
  ],
})
