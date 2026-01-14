import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for AI Marketplace E2E tests
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Maximum time one test can run for */
  timeout: 60 * 1000,
  
  /* Run tests in files in parallel */
  fullyParallel: false, // Sequential for auth-dependent tests
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['list'],
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.TEST_BASE_URL || 'http://agent-marketplace.local',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Note: webServer not configured - assumes you're already running the app
   * at http://agent-marketplace.local via K3s/Ingress or docker-compose */
});
