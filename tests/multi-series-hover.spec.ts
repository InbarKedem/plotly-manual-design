// =============================================================================
// 🎯 MULTI-SERIES HOVER VISIBILITY TESTS
// =============================================================================
// Tests specifically for the multi-series demo that has enableHoverOpacity
// This will verify the curve visibility improvements work correctly

import { test, expect } from "@playwright/test";

test.describe("Multi-Series Hover Visibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to the multi-series demo tab (4th tab)
    await page.click('button:has-text("📊 Interactive Multi-Series")');
    await page.waitForTimeout(1000);

    // Wait for the multi-series plot to load
    await expect(page.locator('[data-testid="unified-plotter"]')).toBeVisible();
    await page.waitForTimeout(1500);
  });

  test("should maintain non-hovered curves at 0.4-0.6 opacity in multi-series", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Hover over the plot to trigger hover opacity effects
    await plotArea.hover({ position: { x: 300, y: 250 } });
    await page.waitForTimeout(500);

    // Get all trace elements
    const traces = await plotContainer.locator(".plotly .trace").all();

    if (traces.length > 1) {
      let emphasizedCount = 0;
      let fadedCount = 0;
      let totalTraces = 0;

      for (const trace of traces) {
        const opacity = await trace.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.opacity || "1");
        });

        totalTraces++;

        if (opacity >= 0.9) {
          emphasizedCount++;
        } else if (opacity >= 0.4 && opacity <= 0.6) {
          fadedCount++;
        }

        // Critical: no trace should be nearly invisible (< 0.3)
        expect(opacity).toBeGreaterThan(0.3);
      }

      console.log(
        `Multi-series test: ${totalTraces} traces, ${emphasizedCount} emphasized, ${fadedCount} faded`
      );

      // Should have both emphasized and faded traces
      expect(emphasizedCount).toBeGreaterThan(0);
      expect(fadedCount).toBeGreaterThan(0);
    }
  });

  test("should keep legend visible during multi-series hover", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const legend = plotContainer.locator(".plotly .legend");

    // Verify legend is visible initially
    await expect(legend).toBeVisible();

    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Test hover near legend area (right side of plot)
    const rightSidePositions = [
      { x: 500, y: 150 },
      { x: 550, y: 200 },
      { x: 480, y: 250 },
    ];

    for (const position of rightSidePositions) {
      await plotArea.hover({ position });
      await page.waitForTimeout(300);

      // Legend should remain visible
      await expect(legend).toBeVisible();

      // Check legend z-index and positioning
      const legendStyles = await legend.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          zIndex: style.zIndex,
          position: style.position,
          opacity: parseFloat(style.opacity || "1"),
        };
      });

      expect(legendStyles.opacity).toBeGreaterThanOrEqual(0.9);
    }
  });

  test("should handle rapid multi-series hover without performance issues", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Test rapid hover movements across multiple traces
    const rapidPositions = [
      { x: 200, y: 200 },
      { x: 250, y: 220 },
      { x: 300, y: 200 },
      { x: 350, y: 180 },
      { x: 400, y: 220 },
      { x: 450, y: 200 },
    ];

    let allMovementsSuccessful = true;

    for (const position of rapidPositions) {
      const startTime = Date.now();

      await plotArea.hover({ position });
      await page.waitForTimeout(100);

      const endTime = Date.now();
      const hoverTime = endTime - startTime;

      // Each hover should complete within reasonable time (< 500ms)
      if (hoverTime > 500) {
        allMovementsSuccessful = false;
        break;
      }

      // Verify traces maintain visibility
      const traces = await plotContainer.locator(".plotly .trace").all();
      for (const trace of traces) {
        const opacity = await trace.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.opacity || "1");
        });

        if (opacity < 0.3) {
          allMovementsSuccessful = false;
          break;
        }
      }

      if (!allMovementsSuccessful) break;
    }

    expect(allMovementsSuccessful).toBeTruthy();
  });

  test("should reset to full visibility when hover ends", async ({ page }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Hover to trigger opacity changes
    await plotArea.hover({ position: { x: 300, y: 200 } });
    await page.waitForTimeout(300);

    // Move mouse completely away from plot
    await page.mouse.move(50, 50);
    await page.waitForTimeout(300);

    // All traces should return to full visibility
    const traces = await plotContainer.locator(".plotly .trace").all();

    for (const trace of traces) {
      const opacity = await trace.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.opacity || "1");
      });

      // Should return to high visibility (near 1.0)
      expect(opacity).toBeGreaterThanOrEqual(0.8);
    }
  });
});
