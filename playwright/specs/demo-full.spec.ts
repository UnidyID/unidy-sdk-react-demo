/**
 * Full Unidy SDK Demo — ~2.5 min walkthrough
 * Run: cd playwright && npm run video:full
 */

import { test } from "@playwright/test";
import { BASE_URL, EMAIL, PASSWORD, brandSuffix } from "../helpers/env";
import { caption } from "../helpers/caption";
import { smoothScroll, navTo, enableDarkMode } from "../helpers/navigation";

test("Demo Video Flow", async ({ page }) => {
  test.setTimeout(10 * 60 * 1000);

  // ── 1. HOMEPAGE ────────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}${brandSuffix}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);

  await caption(page, "Welcome to the Unidy SDK React Demo", 2000);
  await enableDarkMode(page);
  await caption(page, "One Login. Infinite Possibilities.", 1800);

  // ── 2. OPTIONS SECTION ─────────────────────────────────────────────────────
  const optionsSection = page
    .locator("#options, section")
    .filter({ hasText: /Implementation Options/i })
    .first();
  if (await optionsSection.isVisible({ timeout: 3000 }).catch(() => false)) {
    await optionsSection.scrollIntoViewIfNeeded();
  } else {
    await smoothScroll(page, 700);
  }
  await page.waitForTimeout(1000);
  await caption(page, "Each feature can be integrated in three different ways", 2200);

  const inlineBtn = page.locator('button:has-text("Inline Demo")').first();
  const dedicatedBtn = page.locator('button:has-text("Dedicated Page Demo")').first();
  const modalDemoBtn = page.locator('button:has-text("Modal Demo")').first();

  if (await inlineBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await inlineBtn.hover();
    await caption(page, "Option 1: Inline — form embedded directly in your page", 2200);
  }
  if (await dedicatedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dedicatedBtn.hover();
    await caption(page, "Option 2: Dedicated Page — /login as its own full-page route", 2200);
  }
  if (await modalDemoBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await modalDemoBtn.hover();
    await caption(page, "Option 3: Modal — login dialog layered over existing content", 2200);
  }

  // ── Option 1: Inline ───────────────────────────────────────────────────────
  await caption(page, "Let's see all three in action — starting with Inline", 1800);
  await inlineBtn.click();
  await page.waitForTimeout(1000);

  const authSection = page.locator("#authentication").first();
  if (await authSection.isVisible({ timeout: 3000 }).catch(() => false)) {
    await authSection.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(800);
  await caption(page, "Inline: the login form lives directly inside your page layout", 2500);

  // ── Option 2: Dedicated Page ───────────────────────────────────────────────
  await caption(page, "Now the Dedicated Page option", 1600);
  if (await optionsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
    await optionsSection.scrollIntoViewIfNeeded();
  } else {
    await smoothScroll(page, -600);
  }
  await page.waitForTimeout(600);

  if (await dedicatedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dedicatedBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    await caption(page, "Dedicated Page: a full standalone login route — fully customizable", 2500);
    await page.goBack();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
  }

  // ── Option 3: Modal login ──────────────────────────────────────────────────
  await caption(page, "And now the Modal — we'll use this for the actual login", 2000);

  const optionsAgain = page
    .locator("#options, section")
    .filter({ hasText: /Implementation Options/i })
    .first();
  if (await optionsAgain.isVisible({ timeout: 2000 }).catch(() => false)) {
    await optionsAgain.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(600);

  const modalBtnAgain = page.locator('button:has-text("Modal Demo")').first();
  if (await modalBtnAgain.isVisible({ timeout: 3000 }).catch(() => false)) {
    await modalBtnAgain.click();
    await page.waitForTimeout(1200);
  }

  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ timeout: 5000 });

  await caption(page, "Login flow: enter your email address", 1600);
  const emailInput = dialog.locator('input[type="email"], input[placeholder*="mail" i]').first();
  await emailInput.click();
  await emailInput.type(EMAIL, { delay: 70 });
  await page.waitForTimeout(500);

  await caption(page, "The SDK analyzes the account and returns available login methods", 2200);
  await dialog.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(1800);

  await caption(page, "Password, Magic Code, Passkey, or Social Login — user chooses freely", 2500);

  const passwordOption = dialog.locator('button:has-text("Password")').first();
  if (await passwordOption.isVisible({ timeout: 5000 }).catch(() => false)) {
    await passwordOption.click();
    await page.waitForTimeout(600);
  }

  await caption(page, "Enter password", 1200);
  const passwordInput = dialog.locator('input[type="password"]').first();
  await passwordInput.click();
  await passwordInput.type(PASSWORD, { delay: 50 });
  await page.waitForTimeout(500);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1800);

  await caption(page, "Logged in ✓ — session is available across the entire SDK", 2000);

  // ── 4. PROFILE DETAILS ─────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/profile/details${brandSuffix}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  await caption(page, "Profile management: edit all user data in one place", 2000);
  await smoothScroll(page, 250);

  const streetInput = page.getByLabel(/street address/i).first();
  if (await streetInput.isVisible({ timeout: 4000 }).catch(() => false)) {
    await streetInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await caption(page, "Filling in address details", 1200);
    await streetInput.click({ clickCount: 3 });
    await streetInput.fill("Musterstraße 12");
    await page.waitForTimeout(350);

    const cityInput = page.getByLabel(/^city$/i).first();
    if (await cityInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cityInput.click({ clickCount: 3 });
      await cityInput.fill("Hamburg");
      await page.waitForTimeout(350);
    }
  }

  const dobInput = page.locator('input[type="date"]').first();
  if (await dobInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dobInput.scrollIntoViewIfNeeded();
    await dobInput.fill("1990-06-15");
    await page.waitForTimeout(400);
    await caption(page, "Date of birth — stored securely via the SDK", 1600);
  }

  const saveBtn = page.locator('button:has-text("Save changes")').first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();
    await page.waitForTimeout(1200);
    await caption(page, "Changes saved ✓", 1400);
  }

  await caption(page, "The design adapts to your branding — no visual breaks anywhere", 2000);

  // ── 5. TICKETS ─────────────────────────────────────────────────────────────
  await caption(page, "Navigating to Tickets via the sidebar", 1400);
  await navTo(page, "/profile/tickets");
  await caption(page, "Tickets: event tickets directly in the user profile", 2000);

  const createDummyBtn = page
    .locator('button:has-text("Create"), button:has-text("Dummy"), button:has-text("Generate")')
    .first();
  if (await createDummyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await caption(page, "Creating demo tickets for the presentation", 1600);
    await createDummyBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  }

  await caption(page, "Ticket details: status, date, venue, and seat number", 2000);
  await smoothScroll(page, 300);
  await page.waitForTimeout(800);

  const pdfBtn = page
    .locator('button:has-text("PDF"), a:has-text("PDF"), button[aria-label*="PDF" i]')
    .first();
  if (await pdfBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await pdfBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await pdfBtn.hover();
    await caption(page, "Tickets can be exported as PDF", 2000);
  }

  const walletBtn = page
    .locator('button:has-text("Wallet"), button:has-text("Apple"), a:has-text("Wallet"), img[alt*="wallet" i]')
    .first();
  if (await walletBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await walletBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await walletBtn.hover();
    await caption(page, "Or added directly to Apple Wallet as a .pkpass file", 2500);
    await page.waitForTimeout(800);
  }

  // ── 6. SUBSCRIPTIONS ───────────────────────────────────────────────────────
  await caption(page, "Navigating to Subscriptions via the sidebar", 1400);
  await navTo(page, "/profile/subscriptions");
  await caption(page, "Manage memberships & subscriptions", 2000);

  const createSubBtn = page
    .locator('button:has-text("Create"), button:has-text("Dummy"), button:has-text("Generate")')
    .first();
  if (await createSubBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await caption(page, "Creating demo subscriptions", 1400);
    await createSubBtn.click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1800);
  }

  await caption(page, "Duration, status, and membership details at a glance", 1800);
  await smoothScroll(page, 250);

  // ── 7. NEWSLETTER ──────────────────────────────────────────────────────────
  await caption(page, "Navigating to Newsletter preferences via the sidebar", 1400);
  await navTo(page, "/profile/newsletter");
  await caption(page, "Newsletter preferences: two different opt-in flows", 2200);

  const eventsTicketsBtn = page.locator('button:has-text("Events & Tickets")').first();
  if (await eventsTicketsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await eventsTicketsBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await caption(page, "SOI — Single Opt-In: preference saved immediately (user already logged in)", 2800);
    await eventsTicketsBtn.click();
    await page.waitForTimeout(1300);
    await caption(page, "Selection active immediately ✓ — no email confirmation needed", 2000);
  }

  await smoothScroll(page, 400);

  const weatherSection = page.locator("div").filter({ hasText: /Weather Forecast/i }).last();
  if (await weatherSection.isVisible({ timeout: 3000 }).catch(() => false)) {
    await weatherSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
  }

  const resendBtn = page.locator('button:has-text("Resend confirmation email")').first();
  const weatherPreferenceBtn = page
    .locator('button:has-text("Temperature"), button:has-text("Wind"), button:has-text("Snow")')
    .first();

  if (await resendBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await resendBtn.scrollIntoViewIfNeeded();
    await caption(page, "DOI — Double Opt-In: preferences locked until email is confirmed", 2800);
    await resendBtn.hover();
    await caption(page, "'Resend confirmation email' — user can trigger a new confirmation at any time", 2800);
  } else if (await weatherPreferenceBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await weatherPreferenceBtn.scrollIntoViewIfNeeded();
    await caption(page, "DOI — Double Opt-In: selecting a preference triggers an email confirmation", 2500);
    await weatherPreferenceBtn.click({ force: true });
    await page.waitForTimeout(1500);
    const resendAfterClick = page.locator('button:has-text("Resend confirmation email")').first();
    if (await resendAfterClick.isVisible({ timeout: 3000 }).catch(() => false)) {
      await resendAfterClick.scrollIntoViewIfNeeded();
      await caption(page, "Preferences locked until confirmed — 'Resend confirmation email' available", 2800);
    }
  }

  // ── 8. HOMEPAGE — View Integration Code ────────────────────────────────────
  await page.goto(`${BASE_URL}${brandSuffix}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await caption(page, "Integration takes just a few lines of code", 1800);

  const authSectionFinal = page
    .locator("#authentication, section")
    .filter({ hasText: /Authentication SDK/i })
    .first();
  if (await authSectionFinal.isVisible({ timeout: 4000 }).catch(() => false)) {
    await authSectionFinal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }

  await caption(page, "useLogin() Hook — the entire multi-step auth flow in a single import", 2800);

  const viewCodeBtn = page.locator('button:has-text("View Integration Code")').first();
  if (await viewCodeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await viewCodeBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await viewCodeBtn.hover();
    await page.waitForTimeout(500);
    await caption(page, "Let's look at the integration code", 1400);
    await viewCodeBtn.click();
    await page.waitForTimeout(800);
    await caption(page, "This is all it takes to add multi-step authentication to your app", 3000);
    await smoothScroll(page, 300);
    await page.waitForTimeout(1000);
  }

  // ── OUTRO ──────────────────────────────────────────────────────────────────
  await caption(page, "Unidy SDK — One Login. Infinite Possibilities.", 3000);
  await page.waitForTimeout(1200);
});
