// Debug test to inspect the actual DOM structure for crosshair lines
import { test, expect } from "@playwright/test";

test.describe("Debug Crosshair DOM Structure", () => {
  test("inspect crosshair DOM after hover", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");

    const plotContainer = page
      .locator('[data-testid="unified-plotter"]')
      .first();
    await expect(plotContainer).toBeVisible();
    await page.waitForTimeout(1000);

    const plotArea = plotContainer.locator("svg").first();
    await expect(plotArea).toBeVisible();

    // Hover to trigger crosshair
    await plotArea.hover({ position: { x: 300, y: 200 } });
    await page.waitForTimeout(1000); // Give time for crosshair to appear

    // Take a screenshot to see what's happening
    await page.screenshot({ path: "crosshair-debug.png", fullPage: true });

    // Try different selectors to find crosshair lines
    const possibleSelectors = [
      ".plotly .xlines-above line",
      ".plotly .ylines-above line",
      ".plotly .xlines line",
      ".plotly .ylines line",
      ".plotly svg line[stroke-dasharray]",
      ".plotly g.xlines line",
      ".plotly g.ylines line",
      ".plotly .plot .xlines line",
      ".plotly .plot .ylines line",
    ];

    console.log("=== Checking crosshair selectors ===");
    for (const selector of possibleSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      console.log(`${selector}: ${count} elements found`);

      if (count > 0) {
        const first = elements.first();
        const strokeDash = await first.getAttribute("stroke-dasharray");
        const strokeWidth = await first.getAttribute("stroke-width");
        const stroke = await first.getAttribute("stroke");
        console.log(
          `  First element attrs: dasharray="${strokeDash}", width="${strokeWidth}", stroke="${stroke}"`
        );
      }
    }

    // Get the full HTML content of the plot container for inspection
    const plotHTML = await plotContainer.innerHTML();
    console.log("Plot container HTML structure:");
    console.log(plotHTML.substring(0, 2000)); // First 2000 chars
  });
});
