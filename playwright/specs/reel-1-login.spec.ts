/**
 * Reel 1 — "3 Ways to Integrate Login" (~30s)
 * Run: cd playwright && npm run video:reel1
 */

import { test } from "@playwright/test";
import { BASE_URL, EMAIL, PASSWORD, brandSuffix } from "../helpers/env";
import { caption } from "../helpers/caption";
import { smoothScroll, enableDarkMode } from "../helpers/navigation";

test("Reel 1 — Login in 3 ways", async ({ page }) => {
  test.setTimeout(3 * 60 * 1000);

  await page.goto(`${BASE_URL}${brandSuffix}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await enableDarkMode(page);
  await caption(page, "3 ways to integrate login with Unidy SDK", 2000);

  // ── Scroll to Options ──────────────────────────────────────────────────────
  const optionsSection = page.locator("#options").first();
  if (await optionsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
    await optionsSection.scrollIntoViewIfNeeded();
  } else {
    await smoothScroll(page, 600);
  }
  await page.waitForTimeout(600);

  // ── Option 1: Inline ──────────────────────────────────────────────────────
  const inlineBtn = page.locator('button:has-text("Inline Demo")').first();
  if (await inlineBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await inlineBtn.hover();
    await caption(page, "① Inline — embedded directly in your page", 1800);
    await inlineBtn.click();
    await page.waitForTimeout(600);
  }

  const authSection = page.locator("#authentication").first();
  if (await authSection.isVisible({ timeout: 2000 }).catch(() => false)) {
    await authSection.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(1200);

  // ── Option 2: Dedicated Page ──────────────────────────────────────────────
  await caption(page, "② Dedicated Page — its own /login route", 1600);

  if (await optionsSection.isVisible({ timeout: 1500 }).catch(() => false)) {
    await optionsSection.scrollIntoViewIfNeeded();
  } else {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(500);

  const dedicatedBtn = page.locator('button:has-text("Dedicated Page Demo")').first();
  if (await dedicatedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dedicatedBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    await caption(page, "Full-page login — completely customizable", 1800);
    await page.goBack();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
  }

  // ── Option 3: Modal login ──────────────────────────────────────────────────
  await caption(page, "③ Modal — layered over existing content", 1600);

  const optionsFinal = page.locator("#options").first();
  if (await optionsFinal.isVisible({ timeout: 2000 }).catch(() => false)) {
    await optionsFinal.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(400);

  const modalBtn = page.locator('button:has-text("Modal Demo")').first();
  if (await modalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await modalBtn.click();
    await page.waitForTimeout(1000);
  }

  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ timeout: 5000 });

  await caption(page, "Enter email...", 1200);
  const emailInput = dialog.locator('input[type="email"], input[placeholder*="mail" i]').first();
  await emailInput.click();
  await emailInput.type(EMAIL, { delay: 60 });
  await page.waitForTimeout(400);

  await dialog.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(1500);
  await caption(page, "SDK returns available login methods", 1800);

  const passwordOption = dialog.locator('button:has-text("Password")').first();
  if (await passwordOption.isVisible({ timeout: 4000 }).catch(() => false)) {
    await passwordOption.click();
    await page.waitForTimeout(500);
  }

  const passwordInput = dialog.locator('input[type="password"]').first();
  await passwordInput.click();
  await passwordInput.type(PASSWORD, { delay: 45 });
  await page.waitForTimeout(400);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);

  await caption(page, "Logged in ✓ — one SDK, three integration styles", 2500);
  await page.waitForTimeout(800);
});
