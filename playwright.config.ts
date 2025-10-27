import { defineConfig } from '@playwright/test';

// https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.e2e\.ts/,
  fullyParallel: true,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_PROTECTION_BYPASS || '',
    },
    trace: 'on-first-retry',
  },
});
