import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: '@mdx-js/react',
    }),
    react(),
    TanStackRouterVite(),
    tailwindcss(),
  ],
})

