import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['code/tests/**/*.test.ts'],
    coverage: { enabled: false }
  }
})

