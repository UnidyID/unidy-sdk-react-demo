import { defineConfig } from "@playwright/test";

/** Desktop 16:9 — headless variant for CI/LinkedIn exports */
export default defineConfig({
  testDir: "../specs",
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    video: { mode: "on", size: { width: 1440, height: 900 } },
  },
  outputDir: "../output/linkedin",
});
