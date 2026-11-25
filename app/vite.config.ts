import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// La app se publica bajo /app/ junto a la landing (ver vercel.json y scripts/build-all.cjs).
export default defineConfig({
  base: '/app/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Gráficos y logo compartidos con la landing (sin duplicar el código).
      '@landing': fileURLToPath(new URL('../landing/src', import.meta.url)),
    },
  },
  server: { port: 5173, fs: { allow: ['..'] } },
});
