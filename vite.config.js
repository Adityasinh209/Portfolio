import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // relative asset paths → works on Vercel, Netlify and GitHub Pages sub-paths
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
});
