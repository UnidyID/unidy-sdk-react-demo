import { defineConfig } from "@playwright/test";

/** Mobile 9:16 — for Instagram Reels (390×844 @3x) */
export default defineConfig({
  testDir: "../specs",
  use: {
    headless: false,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    video: { mode: "on", size: { width: 390, height: 844 } },
  },
  outputDir: "../output/reels",
});
