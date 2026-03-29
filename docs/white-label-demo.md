# White-Label Demo & Video Production Guide

This guide explains how to add a new club/brand to the demo and how to record promo videos — repeatable on any copy of this repo.

---

## 1. How the Branding System Works

The demo reads a `?brand=<id>` URL parameter on load. When a brand is active:

- CSS variables `--color-accent` and `--color-accent-contrast` are overridden on `<html>`
- All accent-colored elements (hero, login modal, login page, footer, buttons) update automatically
- The club logo appears in: top navigation, profile navigation, login modal, login page header, footer

**No build step required.** The brand config is runtime-only.

---

## 2. Adding a New Brand

### Step 1 — Add the logo

Copy the club's SVG (or PNG) logo to:

```
public/brands/<id>.svg
```

The image should have a transparent background and look good on both dark and light backgrounds.

### Step 2 — Register the brand config

Open `src/lib/brand/brands.ts` and add an entry:

```typescript
export const brands: Record<string, BrandConfig> = {
  mff: {
    id: 'mff',
    name: 'Malmö FF',
    logoSrc: '/brands/mff.svg',
    accentColor: 'oklch(85.93% 0.075 243.95)',   // primary brand color
    accentContrast: '#0d2b4e'                      // text/icon color on top of accentColor
  },

  // Add new brand here:
  newclub: {
    id: 'newclub',
    name: 'Club Name',
    logoSrc: '/brands/newclub.svg',
    accentColor: 'oklch(...)',   // convert hex/RGB at oklch.com
    accentContrast: '#ffffff'
  }
};
```

**Finding the right `oklch` value:**
1. Get the club's primary hex color
2. Convert at [oklch.com](https://oklch.com)
3. Paste the result as `accentColor`

### Step 3 — Test it

Open the demo with `?brand=<id>`:

```
https://react.sdk-demo.unidy.io/?brand=newclub
```

No deployment needed — changes to `brands.ts` are picked up on next deploy.

---

## 3. Where Branding Is Applied

| Location | Component |
|---|---|
| Top navigation logo | `src/modules/homepage/components/sections/top-navigation.tsx` |
| Profile navigation logo | `src/modules/profile/components/profile-navigation.tsx` |
| Login modal (gradient panel) | `src/modules/homepage/components/examples/login-modal-example.tsx` |
| Login page (header + gradient) | `src/modules/authentication/pages/login-page.tsx` |
| Footer logo | `src/modules/homepage/components/sections/footer-section.tsx` |
| Hero section gradient | `src/modules/homepage/components/sections/hero-section.tsx` |
| CSS variable injection | `src/lib/brand/brand-provider.tsx` |

---

## 4. Recording Demo Videos

### Prerequisites

```bash
# Install Playwright in /tmp (avoids SDK package conflicts)
cd /tmp && npm init -y && npm install @playwright/test playwright
npx playwright install chromium
```

### Environment file

Create `/tmp/demo-video.env`:

```env
DEMO_EMAIL=your-test-account@example.com
DEMO_PASSWORD=yourpassword
DEMO_URL=https://react.sdk-demo.unidy.io
DEMO_BRAND=mff
```

Set `DEMO_BRAND` to the brand `id` you want to record, or leave it empty for the default Unidy branding.

### Scripts

All scripts live in `/tmp/`:

| File | Purpose | Config |
|---|---|---|
| `demo-video.spec.ts` | Full walkthrough (~2.5 min), Desktop 16:9 | `playwright.config.ts` |
| `reel-1-login.spec.ts` | "3 ways to integrate login" (~30s) | `playwright.reels.config.ts` |
| `reel-2-profile.spec.ts` | "Profile, Tickets & Wallet" (~30s) | `playwright.reels.config.ts` |
| `reel-3-newsletter.spec.ts` | "SOI vs DOI Newsletter" (~25s) | `playwright.reels.config.ts` |

### Run commands

```bash
# Full demo video (LinkedIn / Desktop 16:9 — 1440x900)
cd /tmp && node_modules/.bin/playwright test demo-video.spec.ts --config=/tmp/playwright.config.ts

# Instagram Reels (9:16 — 390x844)
cd /tmp && node_modules/.bin/playwright test reel-1-login.spec.ts --config=/tmp/playwright.reels.config.ts
cd /tmp && node_modules/.bin/playwright test reel-2-profile.spec.ts --config=/tmp/playwright.reels.config.ts
cd /tmp && node_modules/.bin/playwright test reel-3-newsletter.spec.ts --config=/tmp/playwright.reels.config.ts
```

### Output locations

```
/tmp/test-results/demo-video-Demo-Video-Flow/video.webm     ← full demo
/tmp/reels-results/*/video.webm                              ← reels
```

Open in Finder:
```bash
open /tmp/test-results/
open /tmp/reels-results/
```

### Convert .webm to .mp4 (optional)

```bash
ffmpeg -i /tmp/test-results/demo-video-Demo-Video-Flow/video.webm \
       -c:v libx264 -preset slow -crf 18 \
       ~/Desktop/unidy-demo-mff.mp4
```

---

## 5. Posting the Videos

### LinkedIn
- Upload `.mp4` directly (native video gets more reach than YouTube links)
- Aspect ratio: 16:9 (1440x900)
- Add captions in LinkedIn's editor

### Instagram Reels
- Upload `.mp4` from mobile or Creator Studio
- Aspect ratio: 9:16 (390x844)
- Max length: 90 seconds

---

## 6. Sending the Demo to a Club

Use the following email template (replace placeholders):

**Subject:** Unidy SDK Demo — White-Label Login for [Club Name]

```
Hi [Name],

I'm reaching out on behalf of Ferdinand, who is currently on parental leave.
I'm Björn Maronde, Managing Director at Unidy, and I'm happy to pick up the conversation.

To give you a concrete idea of what a Unidy integration could look like for [Club Name],
I put together a short demo — built in your club's branding:

[Watch the demo video] → [LINK]

Live demo: https://react.sdk-demo.unidy.io/?brand=<id>

What you'll see:
- Login modal and login page in [Club Name] colors with your logo
- Ticket management, newsletter subscriptions, and user profile — all in one flow
- Fully white-label: your branding, your domain, your experience

Would you have 30 minutes for a call this week or next?

Best,
Björn Maronde
Managing Director, Unidy GmbH
```
