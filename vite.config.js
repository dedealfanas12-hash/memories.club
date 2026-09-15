import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// VITE_BASE_PATH is set automatically by the GitHub Pages workflow
// (.github/workflows/deploy.yml) to match your repo name, e.g. '/memories-club/'.
// Locally (npm run dev) it's unset, which correctly falls back to '/'.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Memories Club',
        short_name: 'Memories Club',
        description: 'Bikin undangan & kartu digital custom untuk momen spesialmu — ulang tahun, anniversary, wisuda, pernikahan, dan lainnya.',
        theme_color: '#7A2E4D',
        background_color: '#F6F3EE',
        lang: 'id',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  base: process.env.VITE_BASE_PATH || '/',
});
