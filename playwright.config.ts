import { defineConfig, devices } from '@playwright/test';
import { Config } from './config/env.config';

/**
 * Playwright Runner Config:
 * - One project per browser.
 * - Trace recorded on first retry for debugging efficiency.
 * - Block service workers to prevent interference with route mocks.
 * - Allure & HTML reporting enabled.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'on-failure' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list']
  ],
  use: {
    baseURL: Config.baseUrl,
    /* Trace recorded on first retry to keep CI artifacts lightweight */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Block service workers to ensure API mocks and interceptors function cleanly */
    serviceWorkers: 'block',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});