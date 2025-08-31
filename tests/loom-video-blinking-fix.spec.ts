// =============================================================================
// 🎯 LOOM VIDEO BLINKING FIX VERIFICATION
// =============================================================================
// This test specifically verifies that the blinking behavior shown in the
// user's Loom video has been eliminated by our recent fixes.

import { test, expect } from "@playwright/test";

test.describe("Loom Video Blinking Fix Verification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/");
    await page.waitForSelector('[data-testid="plotter-controls-root"]', {
      state: "visible",
      timeout: 10000,
    });
  });

  test("🎯 REGRESSION: No blinking during cursor movement (Loom video fix)", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Start hover
    await trigger.hover();
    await expect(panel).toBeVisible({ timeout: 1000 });

    // 🎯 CRITICAL: Monitor for blinking during movement
    let visibilityChanges = 0;
    let lastVisible = true;
    let minOpacity = 1;
    let opacityDrops = 0;

    const stabilityMonitor = setInterval(async () => {
      try {
        const isVisible = await panel.isVisible();
        const opacity = await panel.evaluate((el) =>
          parseFloat(window.getComputedStyle(el).opacity)
        );

        // Track visibility changes
        if (isVisible !== lastVisible) {
          visibilityChanges++;
          lastVisible = isVisible;
        }

        // Track opacity drops
        if (opacity < minOpacity) {
          minOpacity = opacity;
          if (opacity < 0.5) {
            opacityDrops++;
          }
        }
      } catch (e) {
        // Ignore errors during monitoring
      }
    }, 15); // High frequency monitoring

    // Get positions
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounds");
    }

    // 🎯 REPRODUCE THE EXACT MOVEMENT FROM THE VIDEO
    // The video showed blinking during diagonal movement from trigger toward panel

    // Start at trigger center
    await page.mouse.move(
      triggerBox.x + triggerBox.width / 2,
      triggerBox.y + triggerBox.height / 2
    );
    await page.waitForTimeout(100);

    // Move diagonally toward panel (this triggered the original blinking)
    const startX = triggerBox.x + triggerBox.width / 2;
    const startY = triggerBox.y + triggerBox.height / 2;
    const endX = panelBox.x + panelBox.width / 2;
    const endY = panelBox.y + panelBox.height / 2;

    // 15 steps across the gap - slow enough to catch any blinking
    for (let step = 0; step <= 15; step++) {
      const progress = step / 15;
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;

      await page.mouse.move(x, y, { steps: 1 });
      await page.waitForTimeout(50); // Slow deliberate movement
    }

    // Additional movement inside panel
    await page.mouse.move(panelBox.x + 20, panelBox.y + 20);
    await page.waitForTimeout(100);

    // Stop monitoring
    clearInterval(stabilityMonitor);

    // 🎯 ASSERTIONS: The video's blinking should be eliminated

    // 1. Should have minimal visibility changes (0-1 is acceptable for initial show)
    expect(
      visibilityChanges,
      `Too many visibility changes: ${visibilityChanges}`
    ).toBeLessThanOrEqual(1);

    // 2. Should not have opacity drops below 0.5 (blinking threshold)
    expect(
      opacityDrops,
      `Detected ${opacityDrops} opacity drops below 0.5`
    ).toBe(0);

    // 3. Minimum opacity should stay high (no fade-outs)
    expect(
      minOpacity,
      `Minimum opacity during movement: ${minOpacity}`
    ).toBeGreaterThan(0.8);

    // 4. Panel should end in fully visible state
    await expect(panel).toBeVisible();

    // 5. Final opacity should be near maximum
    const finalOpacity = await panel.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(finalOpacity, `Final opacity: ${finalOpacity}`).toBeGreaterThan(
      0.95
    );

    console.log(`✅ Anti-blinking test passed:`);
    console.log(`   - Visibility changes: ${visibilityChanges}`);
    console.log(`   - Opacity range: ${minOpacity.toFixed(3)} - 1.0`);
    console.log(`   - Opacity drops: ${opacityDrops}`);
    console.log(`   - Final opacity: ${finalOpacity.toFixed(3)}`);
  });

  test("🔄 STRESS: Rapid enter-exit patterns (video stress test)", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    const triggerBox = await trigger.boundingBox();
    if (!triggerBox) throw new Error("Could not get trigger bounds");

    // Monitor for unexpected behavior
    let totalBlinkEvents = 0;
    const blinkTracker = setInterval(async () => {
      try {
        const opacity = await panel.evaluate((el) =>
          parseFloat(window.getComputedStyle(el).opacity)
        );
        // Count any mid-transition opacity values as potential blinks
        if (opacity > 0.1 && opacity < 0.9) {
          totalBlinkEvents++;
        }
      } catch (e) {
        // Ignore
      }
    }, 20);

    // Rapid enter-exit cycles (stress test pattern)
    for (let cycle = 0; cycle < 8; cycle++) {
      // Enter trigger
      await page.mouse.move(
        triggerBox.x + triggerBox.width / 2,
        triggerBox.y + triggerBox.height / 2,
        { steps: 1 }
      );
      await page.waitForTimeout(80);

      // Exit to various positions
      const exitPositions = [
        { x: triggerBox.x - 30, y: triggerBox.y - 30 },
        { x: triggerBox.x + triggerBox.width + 30, y: triggerBox.y - 30 },
        { x: triggerBox.x - 30, y: triggerBox.y + triggerBox.height + 30 },
      ];

      const exitPos = exitPositions[cycle % exitPositions.length];
      await page.mouse.move(exitPos.x, exitPos.y, { steps: 1 });
      await page.waitForTimeout(80);
    }

    clearInterval(blinkTracker);

    // Should have minimal intermediate opacity states
    expect(
      totalBlinkEvents,
      `Detected ${totalBlinkEvents} blink events`
    ).toBeLessThan(10);

    // Final test: hover should work normally
    await trigger.hover();
    await expect(panel).toBeVisible({ timeout: 1000 });

    console.log(
      `Stress test completed: ${totalBlinkEvents} blink events detected`
    );
  });
});
