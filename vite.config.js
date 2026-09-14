import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE_PATH is set automatically by the GitHub Pages workflow
// (.github/workflows/deploy.yml) to match your repo name, e.g. '/memories-club/'.
// Locally (npm run dev) it's unset, which correctly falls back to '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
});
