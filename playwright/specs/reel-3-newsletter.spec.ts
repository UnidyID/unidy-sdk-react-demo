/**
 * Reel 3 — "Newsletter done right: SOI vs DOI" (~25s)
 * Run: cd playwright && npm run video:reel3
 */

import { test } from "@playwright/test";
import { BASE_URL, brandSuffix } from "../helpers/env";
import { caption } from "../helpers/caption";
import { smoothScroll, enableDarkMode } from "../helpers/navigation";
import { silentLogin } from "../helpers/login";

test("Reel 3 — Newsletter SOI vs DOI", async ({ page }) => {
  test.setTimeout(3 * 60 * 1000);

  await silentLogin(page);
  await enableDarkMode(page);

  await page.goto(`${BASE_URL}/profile/newsletter${brandSuffix}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await caption(page, "Newsletter management — built into the SDK", 2000);

  // ── SOI ────────────────────────────────────────────────────────────────────
  const eventsBtn = page.locator('button:has-text("Events & Tickets")').first();
  if (await eventsBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await eventsBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await caption(page, "SOI — Single Opt-In: active immediately ✓", 2200);
    await eventsBtn.click();
    await page.waitForTimeout(1200);
    await caption(page, "Already logged in → preference saved instantly", 1800);
  }

  // ── DOI ────────────────────────────────────────────────────────────────────
  await smoothScroll(page, 420);

  const weatherSection = page.locator("div").filter({ hasText: /Weather Forecast/i }).last();
  if (await weatherSection.isVisible({ timeout: 2000 }).catch(() => false)) {
    await weatherSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }

  const resendBtn = page.locator('button:has-text("Resend confirmation email")').first();
  const weatherPref = page
    .locator('button:has-text("Temperature"), button:has-text("Wind"), button:has-text("Snow")')
    .first();

  if (await resendBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await resendBtn.scrollIntoViewIfNeeded();
    await caption(page, "DOI — Double Opt-In: email confirmation required", 2500);
    await resendBtn.hover();
    await caption(page, "'Resend confirmation email' — always available", 2200);
  } else if (await weatherPref.isVisible({ timeout: 2000 }).catch(() => false)) {
    await weatherPref.scrollIntoViewIfNeeded();
    await caption(page, "DOI — Double Opt-In: triggers an email confirmation", 2200);
    await weatherPref.click({ force: true });
    await page.waitForTimeout(1200);
    const resendAfter = page.locator('button:has-text("Resend confirmation email")').first();
    if (await resendAfter.isVisible({ timeout: 2500 }).catch(() => false)) {
      await resendAfter.scrollIntoViewIfNeeded();
      await caption(page, "Preferences locked until confirmed via email", 2200);
      await resendAfter.hover();
      await caption(page, "'Resend confirmation email' — always available", 2000);
    }
  }

  await caption(page, "SOI & DOI — both supported out of the box 📧", 2500);
  await page.waitForTimeout(800);
});
