/**
 * Reel 2 — "Your profile, your data" (~30s)
 * Run: cd playwright && npm run video:reel2
 */

import { test } from "@playwright/test";
import { BASE_URL, brandSuffix } from "../helpers/env";
import { caption } from "../helpers/caption";
import { smoothScroll, navTo, enableDarkMode } from "../helpers/navigation";
import { silentLogin } from "../helpers/login";

test("Reel 2 — Profile, Tickets & Wallet", async ({ page }) => {
  test.setTimeout(3 * 60 * 1000);

  await silentLogin(page);
  await enableDarkMode(page);

  // ── Profile Details ────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/profile/details${brandSuffix}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await caption(page, "User profile — edit everything in one place", 2000);
  await smoothScroll(page, 250);

  const streetInput = page.getByLabel(/street address/i).first();
  if (await streetInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await streetInput.scrollIntoViewIfNeeded();
    await streetInput.click({ clickCount: 3 });
    await streetInput.fill("Musterstraße 12");
    await page.waitForTimeout(300);

    const cityInput = page.getByLabel(/^city$/i).first();
    if (await cityInput.isVisible({ timeout: 1500 }).catch(() => false)) {
      await cityInput.click({ clickCount: 3 });
      await cityInput.fill("Hamburg");
      await page.waitForTimeout(300);
    }
  }

  const dobInput = page.locator('input[type="date"]').first();
  if (await dobInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dobInput.scrollIntoViewIfNeeded();
    await dobInput.fill("1990-06-15");
    await page.waitForTimeout(300);
  }

  await caption(page, "Address, birthday — stored securely via the SDK", 1800);

  const saveBtn = page.locator('button:has-text("Save changes")').first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await page.waitForTimeout(1000);
    await caption(page, "Saved ✓", 1000);
  }

  // ── Tickets ────────────────────────────────────────────────────────────────
  await caption(page, "Navigating to Tickets", 1200);
  await navTo(page, "/profile/tickets");
  await caption(page, "Event tickets — right inside the user profile", 1800);

  const createBtn = page
    .locator('button:has-text("Create"), button:has-text("Dummy"), button:has-text("Generate")')
    .first();
  if (await createBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await createBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
  }

  await smoothScroll(page, 280);
  await page.waitForTimeout(700);

  const pdfBtn = page.locator('button:has-text("PDF"), a:has-text("PDF")').first();
  if (await pdfBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await pdfBtn.scrollIntoViewIfNeeded();
    await pdfBtn.hover();
    await caption(page, "Export as PDF", 1500);
  }

  const walletBtn = page
    .locator('button:has-text("Wallet"), button:has-text("Apple"), a:has-text("Wallet")')
    .first();
  if (await walletBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await walletBtn.scrollIntoViewIfNeeded();
    await walletBtn.hover();
    await caption(page, "Or add to Apple Wallet as .pkpass", 2000);
    await page.waitForTimeout(600);
  }

  // ── Subscriptions ──────────────────────────────────────────────────────────
  await caption(page, "Memberships & subscriptions too", 1500);
  await navTo(page, "/profile/subscriptions");

  const createSubBtn = page
    .locator('button:has-text("Create"), button:has-text("Dummy"), button:has-text("Generate")')
    .first();
  if (await createSubBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await createSubBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
  }

  await smoothScroll(page, 200);
  await caption(page, "Tickets, profile, subscriptions — all in one SDK 🎟️", 2500);
  await page.waitForTimeout(800);
});
