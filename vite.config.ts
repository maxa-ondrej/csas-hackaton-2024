import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  test: {
    watch: false,
    globals: true,
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: ['**/*.test.ts'],
    },
    include: ['**/*.test.{ts,js}'],
  },
});
