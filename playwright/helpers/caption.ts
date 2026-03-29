import type { Page } from "@playwright/test";

/** Injects a caption pill overlay at the bottom of the screen — visible in recordings. */
export async function caption(page: Page, text: string, durationMs = 2000) {
  await page.evaluate((msg) => {
    let box = document.getElementById("__demo_caption__");
    if (!box) {
      box = document.createElement("div");
      box.id = "__demo_caption__";
      Object.assign(box.style, {
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.82)",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        fontSize: "15px",
        fontWeight: "600",
        padding: "10px 24px",
        borderRadius: "999px",
        zIndex: "99999",
        maxWidth: "82%",
        textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        pointerEvents: "none",
        whiteSpace: "pre-wrap",
        transition: "opacity 0.25s",
      });
      document.body.appendChild(box);
    }
    box.textContent = msg;
    (box as HTMLElement).style.opacity = "1";
  }, text);
  await page.waitForTimeout(durationMs);
  await page.evaluate(() => {
    const box = document.getElementById("__demo_caption__");
    if (box) (box as HTMLElement).style.opacity = "0";
  });
  await page.waitForTimeout(150);
}
