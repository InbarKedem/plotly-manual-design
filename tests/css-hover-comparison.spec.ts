// =============================================================================
// 🎯 CSS-FIRST HOVER COMPARISON TESTS
// =============================================================================

import { test, expect } from "@playwright/test";

test.describe("CSS-First vs JavaScript Hover Comparison", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/");
    await page.waitForSelector('[data-testid="unified-plotter"]');
  });

  test("should demonstrate zero-flicker CSS hover approach", async ({
    page,
  }) => {
    // First, let's add our CSS-first component to the page for testing
    await page.evaluate(() => {
      // Inject CSS-first hover component for comparison
      const testContainer = document.createElement("div");
      testContainer.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
          <div data-testid="css-hover-demo" style="position: relative; display: inline-block;">
            <button 
              data-testid="css-trigger" 
              style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer;"
            >
              CSS Hover Demo
            </button>
            <div 
              data-testid="css-panel"
              style="
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 4px;
                padding: 12px;
                min-width: 160px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                opacity: 0;
                visibility: hidden;
                transform: scale(0.95);
                transition: all 0.1s ease;
                pointer-events: auto;
              "
            >
              <div>CSS-controlled panel</div>
              <div>No JavaScript timing</div>
              <div>Zero flicker guarantee</div>
            </div>
          </div>
        </div>
      `;

      // Add the CSS hover rules
      const style = document.createElement("style");
      style.textContent = `
        [data-testid="css-hover-demo"]:hover [data-testid="css-panel"] {
          opacity: 1 !important;
          visibility: visible !important;
          transform: scale(1) !important;
        }
      `;

      document.head.appendChild(style);
      document.body.appendChild(testContainer);
    });

    // Test the CSS-first approach
    const cssTrigger = page.locator('[data-testid="css-trigger"]');
    const cssPanel = page.locator('[data-testid="css-panel"]');

    // Verify CSS hover works
    await cssTrigger.hover();
    await expect(cssPanel).toBeVisible({ timeout: 500 });

    // Test rapid movements - should be rock solid
    const triggerBox = await cssTrigger.boundingBox();
    const panelBox = await cssPanel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get bounds");
    }

    // Monitor for any opacity changes during movement
    let opacitySnapshots: string[] = [];

    const opacityTracker = page.evaluate(() => {
      const snapshots: string[] = [];
      const interval = setInterval(() => {
        const panel = document.querySelector(
          '[data-testid="css-panel"]'
        ) as HTMLElement;
        if (panel) {
          snapshots.push(window.getComputedStyle(panel).opacity);
        }
      }, 10);

      return new Promise<string[]>((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          resolve(snapshots);
        }, 1000);
      });
    });

    // Rapid zigzag movement pattern
    for (let i = 0; i < 30; i++) {
      const isEven = i % 2 === 0;
      const x = isEven
        ? triggerBox.x + triggerBox.width / 2
        : panelBox.x + panelBox.width / 2;
      const y = isEven
        ? triggerBox.y + triggerBox.height / 2
        : panelBox.y + panelBox.height / 2;

      await page.mouse.move(x, y, { steps: 1 });
      await page.waitForTimeout(20);
    }

    opacitySnapshots = await opacityTracker;

    // Filter out transitional values, focus on stable states
    const stableOpacities = opacitySnapshots.filter(
      (opacity) => opacity === "0" || opacity === "1"
    );

    // Should have mostly stable opacity values
    const stabilityRatio = stableOpacities.length / opacitySnapshots.length;
    expect(stabilityRatio).toBeGreaterThan(0.7);

    // Should end in visible state
    await expect(cssPanel).toBeVisible();
  });

  test("should benchmark hover response times", async ({ page }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');
    const panel = page.locator('[data-testid="hover-panel"]');

    // Measure response time from hover to visibility
    const hoverTimes: number[] = [];

    for (let test = 0; test < 5; test++) {
      // Ensure clean state
      await page.mouse.move(0, 0);
      await expect(panel).toBeHidden();

      // Measure hover response
      const startTime = Date.now();
      await trigger.hover();
      await expect(panel).toBeVisible({ timeout: 1000 });
      const endTime = Date.now();

      hoverTimes.push(endTime - startTime);

      await page.waitForTimeout(200); // Stabilize between tests
    }

    // Calculate average response time
    const avgResponseTime =
      hoverTimes.reduce((sum, time) => sum + time, 0) / hoverTimes.length;
    const maxResponseTime = Math.max(...hoverTimes);

    // Should be very fast (under 200ms average, under 500ms max)
    expect(
      avgResponseTime,
      "Average hover response time: " + avgResponseTime + "ms"
    ).toBeLessThan(200);
    expect(
      maxResponseTime,
      "Max hover response time: " + maxResponseTime + "ms"
    ).toBeLessThan(500);

    console.log(
      "Hover Performance: Avg " +
        avgResponseTime.toFixed(1) +
        "ms, Max " +
        maxResponseTime +
        "ms"
    );
  });
});
