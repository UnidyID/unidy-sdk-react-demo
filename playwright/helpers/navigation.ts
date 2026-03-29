import type { Page } from "@playwright/test";

/** Smooth-scroll by `distance` pixels. */
export async function smoothScroll(page: Page, distance: number) {
  await page.evaluate(
    (d) => window.scrollBy({ top: d, behavior: "smooth" }),
    distance
  );
  await page.waitForTimeout(Math.max(600, Math.abs(distance) * 0.8));
}

/** Hover then click a sidebar nav link by its href. */
export async function navTo(page: Page, href: string) {
  const link = page.locator(`a[href="${href}"]`).first();
  await link.scrollIntoViewIfNeeded();
  await link.hover();
  await page.waitForTimeout(500);
  await link.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
}

/** Enable dark mode if the theme toggle button is visible. */
export async function enableDarkMode(page: Page) {
  const toggle = page
    .locator(
      'button:has(svg[data-lucide="moon"]), button:has(svg[data-lucide="sun"])'
    )
    .first();
  if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
    await toggle.click();
    await page.waitForTimeout(400);
  }
}
