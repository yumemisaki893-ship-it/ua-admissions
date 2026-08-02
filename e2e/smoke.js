const { chromium } = require("playwright");
const { randomUUID } = require("node:crypto");

async function fillWhenReady(page, locator, value) {
  for (let i = 0; i < 10; i++) {
    try {
      await locator.waitFor({ state: "attached", timeout: 5000 });
      await locator.fill(value, { timeout: 5000 });
      return;
    } catch {
      await page.waitForTimeout(500);
    }
  }
  throw new Error(`could not fill ${locator}`);
}

(async () => {
  const BASE = process.env.BASE_URL || "http://localhost:3000";
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  page.on("pageerror", (e) => console.log("PAGEERROR:", e.message.slice(0, 150)));

  const email = `e2e-${randomUUID().slice(0, 8)}@example.com`;
  const password = "StrongPass123";

  await page.goto(`${BASE}/register`);
  await page.getByLabel("Full Name").fill("E2E Tester");
  await page.getByLabel("Email Address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForURL(/\/login/, { timeout: 20000 });
  await fillWhenReady(page, page.locator("input[name=email]"), email);
  await fillWhenReady(page, page.locator("input[name=password]"), password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(/\/portal\/dashboard/, { timeout: 25000 });
  await page.getByText("Start My Application").waitFor({ timeout: 15000 });
  console.log(`1. register + student login + portal (${BASE}): OK`);

  const adminCtx = await browser.newContext();
  const admin = await adminCtx.newPage();
  admin.setDefaultTimeout(20000);
  await admin.goto(`${BASE}/login`);
  await fillWhenReady(admin, admin.locator("input[name=email]"), "admin@universityofantique.edu.ph");
  await fillWhenReady(admin, admin.locator("input[name=password]"), "Admin12345!");
  await admin.getByRole("button", { name: "Sign In" }).click();
  await admin.waitForURL(/\/admin/, { timeout: 25000 });
  await admin.getByText(/Admissions Overview|Dashboard/).first().waitFor({ timeout: 15000 });
  await adminCtx.close();
  console.log(`2. admin login -> /admin (${BASE}): OK`);

  await browser.close();
  console.log("ALL SMOKE TESTS PASSED");
})().catch((e) => {
  console.error("SMOKE TEST FAILED:", e.message);
  process.exit(1);
});
