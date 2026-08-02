import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Zapewnia poprawne ścieżki na GitHub Pages
  build: {
    outDir: 'dist',
  }
});
