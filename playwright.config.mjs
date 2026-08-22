import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.SITE_BASE_URL || 'http://127.0.0.1:4334';

export default defineConfig({
  testDir: './tests',
  testMatch: '*.spec.mjs',
  fullyParallel: false,
  workers: 1,
  timeout: 90000,
  reporter: [['line']],
  outputDir: process.env.MALONE_TEST_OUTPUT || 'C:/tmp/malone-site-audit',
  webServer: {
    command: 'npm.cmd run dev -- --host 127.0.0.1 --port 4334',
    url: 'http://127.0.0.1:4334/contact',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      PUBLIC_CONTACT_ENDPOINT:
        'https://script.google.com/macros/s/TEST-MALONE-CONTACT-VERIFICATION/exec'
    }
  },
  use: {
    baseURL,
    actionTimeout: 10000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: 'mobile-390',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } }
    }
  ]
});
