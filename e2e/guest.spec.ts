import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

test("guest: pick template, fill, preview, download PDF", async ({ page }) => {
  await page.goto("/templates");
  await page
    .getByRole("link", { name: /sidebar/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/resumes\/local$/, { timeout: 30_000 });

  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");

  await page.getByRole("button", { name: /^Experience/ }).click();
  await page.getByRole("button", { name: "Add experience" }).click();
  await page.getByLabel("Role").fill("Analyst");

  const preview = page.getByLabel("Resume preview");
  await expect(preview.locator("canvas").first()).toBeVisible({
    timeout: 30_000,
  });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("resume-ada-lovelace.pdf");
  const pdf = await readFile((await download.path())!);
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
});
