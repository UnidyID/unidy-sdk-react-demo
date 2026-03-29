import type { Page } from "@playwright/test";
import { BASE_URL, EMAIL, PASSWORD, brandSuffix } from "./env";

/**
 * Silently logs in via the dedicated /login page.
 * Used in reels that start already authenticated.
 */
export async function silentLogin(page: Page) {
  await page.goto(`${BASE_URL}/login${brandSuffix}`);
  await page.waitForLoadState("networkidle");

  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.fill(EMAIL);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1500);

  const pwOption = page.locator('button:has-text("Password")').first();
  if (await pwOption.isVisible({ timeout: 3000 }).catch(() => false)) {
    await pwOption.click();
  }
  await page.waitForTimeout(500);

  const pwInput = page.locator('input[type="password"]').first();
  await pwInput.fill(PASSWORD);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
}
