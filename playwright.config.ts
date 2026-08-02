import { defineConfig, devices } from "@playwright/test";

/**
 * E2E test configuration for the admission flow.
 *
 * Prerequisites:
 *   1. Start the database:            docker compose up -d
 *   2. Push the schema:               npx prisma db push
 *   3. Seed sample data:              npm run db:seed
 *   4. Run the tests:                 npm run test:e2e
 *
 * The application must run WITHOUT a PAYMONGO_SECRET_KEY so the
 * simulated payment mode is active (see src/app/api/paymongo/simulate).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
