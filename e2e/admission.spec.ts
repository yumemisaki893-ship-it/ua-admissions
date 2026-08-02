import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

/**
 * End-to-end test of the admission flow:
 * register -> fill personal info -> select course -> upload documents
 * -> pay (simulated) -> submit -> reference number shown on dashboard.
 *
 * Requires the dev database to be running and seeded (see README).
 */
test.describe("Admission flow", () => {
  test("a student can submit an application end-to-end", async ({ page }) => {
    const email = `student-${randomUUID().slice(0, 8)}@example.com`;
    const password = "StrongPass123";
    const fullName = "Test Student";

    // 1. Register
    await page.goto("/register");
    await page.getByLabel("Full Name").fill(fullName);
    await page.getByLabel("Email Address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Sign In", { exact: false })).toBeVisible();

    // 2. Sign in
    await page.getByLabel("Email Address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/portal\/dashboard/);
    await expect(page.getByText("Start My Application")).toBeVisible();

    // 3. Open the wizard and fill personal information
    await page.getByRole("link", { name: "Start My Application" }).click();
    await expect(page).toHaveURL(/\/portal\/apply/);

    await page.getByLabel("First Name").fill("Juan");
    await page.getByLabel("Middle Name").fill("Santos");
    await page.getByLabel("Last Name").fill("Dela Cruz");
    await page.getByLabel("Gender").click();
    await page.getByRole("option", { name: "Male" }).click();
    await page.getByLabel("Birth Date").fill("2006-05-15");
    await page.getByLabel("Complete Address").fill("123 Rizal Street");
    await page.getByLabel("City / Municipality").fill("Sibalom");
    await page.getByLabel("Province").fill("Antique");
    await page.getByLabel("ZIP Code").fill("5713");
    await page.getByLabel("Mobile Number").fill("09171234567");
    await page.getByLabel("Parent / Guardian Name").fill("Maria Dela Cruz");
    await page.getByRole("button", { name: "Save & Continue" }).click();

    // 4. Select a course (BS Information Technology from COED)
    await expect(page.getByText("Select Your Course")).toBeVisible();
    await page.getByRole("button", { name: /Bachelor of Science in Information Technology/ }).click();
    await page.getByRole("button", { name: "Save & Continue" }).click();

    // 5. Upload the three required documents
    await expect(page.getByText("Upload Requirements")).toBeVisible();
    const files: Record<string, string> = {
      BIRTH_CERT: "tests/fixtures/birth-cert.pdf",
      FORM_137: "tests/fixtures/form137.pdf",
      PHOTO: "tests/fixtures/photo.png",
    };
    for (const [index, type] of Object.entries(files)) {
      void index;
      const uploadButton = page.getByRole("button", { name: "Upload", exact: true }).nth(Object.keys(files).indexOf(type));
      const fileInput = uploadButton.locator("..").locator("input[type=file]");
      await fileInput.setInputFiles(files[type]);
      await expect(uploadButton).toBeDisabled(); // uploading…
      await expect(page.getByText("PSA Birth Certificate", { exact: false }).first()).toBeVisible();
    }

    const continueBtn = page.getByRole("button", { name: "Continue" });
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    // 6. Pay the application fee (simulated mode)
    await expect(page.getByText("Application Fee Payment")).toBeVisible();
    await page.getByRole("button", { name: /Pay PHP/ }).click();
    // Simulated checkout redirects back to the wizard marked as paid
    await expect(page).toHaveURL(/step=5&payment=success/, { timeout: 15_000 });
    await expect(page.getByText("Payment received")).toBeVisible({ timeout: 10_000 });

    // 7. Review and submit
    await expect(page.getByText("Review & Submit")).toBeVisible();
    await page.getByRole("button", { name: "Submit Application" }).click();

    // 8. Success + reference number
    await expect(page.getByText("Application Submitted!")).toBeVisible();
    await expect(page.getByText(/UA-\d{4}-\d{5}/)).toBeVisible();

    // 9. Dashboard shows the pending status
    await page.getByRole("link", { name: "Go to Dashboard" }).click();
    await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/UA-\d{4}-\d{5}/)).toBeVisible();
  });

  test("unauthenticated users are redirected from the portal", async ({ page }) => {
    await page.goto("/portal/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
