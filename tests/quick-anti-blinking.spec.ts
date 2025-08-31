// =============================================================================
// 🎯 QUICK ANTI-BLINKING TEST - Core functionality verification
// =============================================================================

import { test, expect } from "@playwright/test";

test.describe("Quick Anti-Blinking Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/");

    // Wait for the plotter controls to load
    await page.waitForSelector('[data-testid="plotter-controls-root"]', {
      state: "visible",
      timeout: 10000,
    });

    // Ensure settings hover is present
    await page.waitForSelector('[data-testid="settings-hover"]', {
      state: "visible",
      timeout: 5000,
    });
  });

  test("should show hover panel on trigger hover", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Initial state - panel should be hidden
    await expect(panel).toBeHidden();

    // Hover on trigger - panel should show
    await trigger.hover();
    await expect(panel).toBeVisible({ timeout: 1000 });

    // Move mouse away - panel should hide
    await page.mouse.move(0, 0);
    await expect(panel).toBeHidden({ timeout: 1000 });
  });

  test("should NOT blink during diagonal movement", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Start hover
    await trigger.hover();
    await expect(panel).toBeVisible({ timeout: 1000 });

    // Get positions for diagonal movement
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounds");
    }

    // Track visibility during movement
    let unexpectedHides = 0;
    let wasVisible = true;

    const blinkMonitor = setInterval(async () => {
      try {
        const isVisible = await panel.isVisible();
        if (wasVisible && !isVisible) {
          unexpectedHides++;
        }
        wasVisible = isVisible;
      } catch (e) {
        // Ignore errors during rapid checking
      }
    }, 20); // Check every 20ms

    // Diagonal movement from trigger to panel
    await page.mouse.move(
      triggerBox.x + triggerBox.width / 2,
      triggerBox.y + triggerBox.height / 2
    );

    // Move diagonally towards panel in 10 steps
    for (let step = 0; step <= 10; step++) {
      const progress = step / 10;
      const x =
        triggerBox.x +
        triggerBox.width / 2 +
        (panelBox.x - triggerBox.x) * progress;
      const y =
        triggerBox.y +
        triggerBox.height / 2 +
        (panelBox.y - triggerBox.y) * progress * 0.5; // Diagonal

      await page.mouse.move(x, y, { steps: 2 });
      await page.waitForTimeout(30); // Slow enough to catch blinking
    }

    // Move into panel
    await page.mouse.move(
      panelBox.x + panelBox.width / 2,
      panelBox.y + panelBox.height / 2
    );

    clearInterval(blinkMonitor);

    // Panel should be visible and no blinking should have occurred
    await expect(panel).toBeVisible();
    expect(
      unexpectedHides,
      `Panel blinked ${unexpectedHides} times during diagonal movement`
    ).toBe(0);
  });

  test("should handle rapid hover-exit cycles gracefully", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    const triggerBox = await trigger.boundingBox();
    if (!triggerBox) throw new Error("Could not get trigger bounds");

    // Rapid enter-exit cycles
    for (let cycle = 0; cycle < 5; cycle++) {
      // Enter quickly
      await page.mouse.move(
        triggerBox.x + triggerBox.width / 2,
        triggerBox.y + triggerBox.height / 2,
        { steps: 1 }
      );
      await page.waitForTimeout(50);

      // Exit quickly
      await page.mouse.move(triggerBox.x - 50, triggerBox.y - 50, { steps: 1 });
      await page.waitForTimeout(50);
    }

    // Final hover should work normally
    await trigger.hover();
    await expect(panel).toBeVisible({ timeout: 1000 });
  });

  test("should maintain stability with our recent fixes", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    await trigger.hover();
    await expect(panel).toBeVisible();

    // Check that our fixes are applied - panel should be visible and stable
    const panelStyles = await panel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        opacity: parseFloat(style.opacity),
        visibility: style.visibility,
        transition: style.transition,
      };
    });

    // Panel should be substantially visible (opacity > 0.9) and fully visible state
    expect(panelStyles.opacity).toBeGreaterThan(0.9);
    expect(panelStyles.visibility).toBe("visible");

    console.log("Panel styles during hover:", panelStyles);

    // Most importantly - it should stay visible during movement
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (triggerBox && panelBox) {
      // Move from trigger edge toward panel
      await page.mouse.move(
        triggerBox.x + triggerBox.width,
        triggerBox.y + triggerBox.height / 2
      );
      await page.waitForTimeout(100);

      // Panel should still be visible during movement
      await expect(panel).toBeVisible();

      // Move into panel
      await page.mouse.move(panelBox.x + 20, panelBox.y + 20);

      // Should definitely be visible now
      await expect(panel).toBeVisible();
    }
  });
});
