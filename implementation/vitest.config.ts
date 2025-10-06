import { defineConfig } from 'vitest/config.js'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: { enabled: false }
  }
})

