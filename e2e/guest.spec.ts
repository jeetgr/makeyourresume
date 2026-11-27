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

test("guest: export JSON, import it back", async ({ page }) => {
  await page.goto("/resumes/local");
  await page.getByLabel("First name").fill("Grace");
  await page.getByLabel("Last name").fill("Hopper");

  const menu = page.getByRole("button", { name: "More actions" });
  await menu.click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: "Export JSON", exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("resume-grace-hopper.json");
  const file = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(file).toMatchObject({ app: "makeyourresume", format: 1 });

  await page.getByLabel("First name").fill("Changed");
  await page.getByTestId("import-input").setInputFiles({
    name: "resume.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await page.getByRole("button", { name: "Replace" }).click();
  await expect(page.getByLabel("First name")).toHaveValue("Grace");
});
