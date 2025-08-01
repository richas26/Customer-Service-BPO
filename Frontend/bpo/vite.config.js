// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    'global': 'window',
  },
  build: {
    assetsInclude: ['**/*.png'], // Ensure images are bundled properly
  },
});
