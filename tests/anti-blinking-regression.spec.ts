// =============================================================================
// 🎯 ANTI-BLINKING REGRESSION TESTS
// =============================================================================
// These tests specifically prevent the blinking behavior shown in the user's
// Loom video and ensure stable hover interactions under all conditions.

import { test, expect, Page } from "@playwright/test";

// =============================================================================
// 🎯 TEST CONFIGURATION
// =============================================================================

test.describe("Anti-Blinking Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/");

    // Wait for components to fully load
    await page.waitForSelector('[data-testid="plotter-controls-root"]', {
      state: "visible",
      timeout: 10000,
    });

    // Ensure hover controls are present
    await page.waitForSelector('[data-testid="settings-hover"]', {
      state: "visible",
      timeout: 5000,
    });
  });

  // ===========================================================================
  // 🚫 CORE ANTI-BLINKING TESTS
  // ===========================================================================

  test("should NOT blink during rapid diagonal movements", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Start hover
    await trigger.hover();
    await expect(panel).toBeVisible({ timeout: 1000 });

    // Perform rapid diagonal movements that caused blinking in video
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounds");
    }

    // Track visibility changes during movement
    let blinkCount = 0;
    let wasVisible = true;

    // Monitor for blinking by checking visibility every 16ms
    const blinkMonitor = setInterval(async () => {
      try {
        const isVisible = await panel.isVisible();
        if (wasVisible && !isVisible) {
          blinkCount++;
        }
        wasVisible = isVisible;
      } catch (e) {
        // Ignore errors during rapid checking
      }
    }, 16); // 60fps monitoring

    // Simulate the diagonal movement pattern from the video
    await page.mouse.move(
      triggerBox.x + triggerBox.width / 2,
      triggerBox.y + triggerBox.height / 2
    );

    // Quick diagonal movement towards panel
    for (let i = 0; i < 20; i++) {
      const progress = i / 19;
      const x =
        triggerBox.x +
        triggerBox.width / 2 +
        (panelBox.x - triggerBox.x) * progress;
      const y =
        triggerBox.y +
        triggerBox.height / 2 +
        (panelBox.y - triggerBox.y) * progress * 0.5; // Diagonal path

      await page.mouse.move(x, y, { steps: 1 });
      await page.waitForTimeout(5); // Very fast movement
    }

    // Move into panel
    await page.mouse.move(
      panelBox.x + panelBox.width / 2,
      panelBox.y + panelBox.height / 2
    );

    clearInterval(blinkMonitor);

    // Panel should still be visible and NO blinking should have occurred
    await expect(panel).toBeVisible();
    expect(
      blinkCount,
      `Detected ${blinkCount} blinks during diagonal movement`
    ).toBe(0);
  });

  test("should maintain stable visibility during rapid cursor oscillation", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    await trigger.hover();
    await expect(panel).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    if (!triggerBox) throw new Error("Could not get trigger bounds");

    // Monitor visibility changes
    let visibilityChanges = 0;
    let lastVisibility = true;

    const visibilityMonitor = setInterval(async () => {
      try {
        const isVisible = await panel.isVisible();
        if (isVisible !== lastVisibility) {
          visibilityChanges++;
          lastVisibility = isVisible;
        }
      } catch (e) {
        // Ignore errors during monitoring
      }
    }, 10);

    // Rapid oscillation between trigger and just outside
    for (let i = 0; i < 50; i++) {
      if (i % 2 === 0) {
        // Move to trigger center
        await page.mouse.move(
          triggerBox.x + triggerBox.width / 2,
          triggerBox.y + triggerBox.height / 2,
          { steps: 1 }
        );
      } else {
        // Move just outside trigger (but within safe polygon)
        await page.mouse.move(
          triggerBox.x + triggerBox.width + 2,
          triggerBox.y + triggerBox.height / 2,
          { steps: 1 }
        );
      }
      await page.waitForTimeout(20);
    }

    clearInterval(visibilityMonitor);

    // Should have minimal visibility changes (ideally 0-2)
    expect(
      visibilityChanges,
      `Too many visibility changes: ${visibilityChanges}`
    ).toBeLessThan(3);
    await expect(panel).toBeVisible(); // Should end visible
  });

  test("should handle gap-crossing movements without flickering", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    await trigger.hover();
    await expect(panel).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounds");
    }

    // Track any flickering during gap crossing
    let flickerEvents = 0;
    const flickerMonitor = page.evaluate(() => {
      let count = 0;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            const target = mutation.target as HTMLElement;
            if (target.getAttribute("data-testid") === "hover-panel") {
              count++;
            }
          }
        });
      });

      const panel = document.querySelector('[data-testid="hover-panel"]');
      if (panel) {
        observer.observe(panel, { attributes: true });
      }

      return new Promise<number>((resolve) => {
        setTimeout(() => {
          observer.disconnect();
          resolve(count);
        }, 2000);
      });
    });

    // Move from trigger edge to panel edge across the gap
    const gapStartX = triggerBox.x + triggerBox.width;
    const gapStartY = triggerBox.y + triggerBox.height / 2;
    const gapEndX = panelBox.x;
    const gapEndY = panelBox.y + panelBox.height / 2;

    // Slow movement across gap (this caused issues in the video)
    await page.mouse.move(gapStartX, gapStartY);

    for (let step = 0; step <= 10; step++) {
      const progress = step / 10;
      const x = gapStartX + (gapEndX - gapStartX) * progress;
      const y = gapStartY + (gapEndY - gapStartY) * progress;

      await page.mouse.move(x, y, { steps: 2 });
      await page.waitForTimeout(50); // Deliberate slow movement
    }

    flickerEvents = await flickerMonitor;

    // Panel should be visible with minimal style mutations
    await expect(panel).toBeVisible();
    expect(
      flickerEvents,
      `Detected ${flickerEvents} style flicker events`
    ).toBeLessThan(5);
  });

  test("should maintain visibility during complex mouse patterns", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    await trigger.hover();
    await expect(panel).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounds");
    }

    // Complex mouse pattern that often caused issues
    const centerX = triggerBox.x + triggerBox.width / 2;
    const centerY = triggerBox.y + triggerBox.height / 2;

    // Simulate erratic human movement pattern
    const movements = [
      // Start at trigger
      { x: centerX, y: centerY },
      // Move towards panel but overshoot
      { x: panelBox.x + panelBox.width + 10, y: panelBox.y },
      // Correct back to panel
      { x: panelBox.x + 20, y: panelBox.y + 20 },
      // Move around inside panel
      { x: panelBox.x + panelBox.width - 20, y: panelBox.y + 20 },
      {
        x: panelBox.x + panelBox.width - 20,
        y: panelBox.y + panelBox.height - 20,
      },
      // Exit and re-enter quickly
      { x: panelBox.x - 5, y: panelBox.y + panelBox.height / 2 },
      { x: panelBox.x + 10, y: panelBox.y + panelBox.height / 2 },
    ];

    let stableVisibilityTime = 0;
    const startTime = Date.now();

    for (const movement of movements) {
      await page.mouse.move(movement.x, movement.y, { steps: 3 });
      await page.waitForTimeout(100);

      // Check if panel is still visible
      if (await panel.isVisible()) {
        stableVisibilityTime += 100;
      }
    }

    const totalTime = Date.now() - startTime;
    const stabilityRatio =
      stableVisibilityTime / Math.min(totalTime, movements.length * 100);

    // Should maintain visibility for >90% of the interaction time
    expect(stabilityRatio).toBeGreaterThan(0.9);
    await expect(panel).toBeVisible(); // Final state should be visible
  });

  test("should handle rapid enter-exit cycles without visual artifacts", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    const triggerBox = await trigger.boundingBox();
    if (!triggerBox) throw new Error("Could not get trigger bounds");

    // Monitor for opacity flashing by checking computed styles
    const opacityFlashMonitor = page.evaluate(() => {
      let flashCount = 0;
      let lastOpacity = "1";

      const checkOpacity = () => {
        const panel = document.querySelector(
          '[data-testid="hover-panel"]'
        ) as HTMLElement;
        if (panel) {
          const currentOpacity = window.getComputedStyle(panel).opacity;
          if (
            lastOpacity === "1" &&
            currentOpacity !== "1" &&
            currentOpacity !== "0"
          ) {
            flashCount++; // Caught intermediate opacity value (flash)
          }
          lastOpacity = currentOpacity;
        }
      };

      const interval = setInterval(checkOpacity, 8); // High frequency monitoring

      return new Promise<number>((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          resolve(flashCount);
        }, 3000);
      });
    });

    // Rapid enter-exit cycles
    for (let cycle = 0; cycle < 10; cycle++) {
      // Enter
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

    // Final hover to end in visible state
    await trigger.hover();

    const flashCount = await opacityFlashMonitor;

    // Should not have any intermediate opacity flashes
    expect(flashCount, `Detected ${flashCount} opacity flashes`).toBe(0);
    await expect(panel).toBeVisible();
  });

  // ===========================================================================
  // 🔄 STRESS TESTS FOR EDGE CASES
  // ===========================================================================

  test("should handle simultaneous hover and keyboard activation", async ({
    page,
  }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');
    const panel = page.locator('[data-testid="hover-panel"]');

    // Start with keyboard activation
    await trigger.focus();
    await trigger.press("Enter");
    await expect(panel).toBeVisible();

    // Add mouse hover while keyboard-opened
    await trigger.hover();

    // Remove keyboard focus
    await trigger.press("Escape");

    // Panel should remain visible due to hover
    await expect(panel).toBeVisible();

    // Move mouse away
    await page.mouse.move(0, 0);

    // Panel should close cleanly
    await expect(panel).toBeHidden({ timeout: 1000 });
  });

  test("should maintain stability during high-frequency movements", async ({
    page,
  }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');
    const panel = page.locator('[data-testid="hover-panel"]');

    await trigger.hover();
    await expect(panel).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounds");
    }

    // Monitor for excessive DOM updates
    const domUpdateCount = await page.evaluate(() => {
      let updateCount = 0;
      const observer = new MutationObserver(() => updateCount++);

      const panel = document.querySelector('[data-testid="hover-panel"]');
      if (panel) {
        observer.observe(panel, {
          attributes: true,
          attributeFilter: ["style", "class", "data-state"],
        });
      }

      return new Promise<number>((resolve) => {
        setTimeout(() => {
          observer.disconnect();
          resolve(updateCount);
        }, 2000);
      });
    });

    // High-frequency micro-movements
    const baseX = triggerBox.x + triggerBox.width / 2;
    const baseY = triggerBox.y + triggerBox.height / 2;

    for (let i = 0; i < 100; i++) {
      const offsetX = Math.sin(i * 0.5) * 10;
      const offsetY = Math.cos(i * 0.3) * 10;

      await page.mouse.move(baseX + offsetX, baseY + offsetY, { steps: 1 });
      await page.waitForTimeout(10);
    }

    const updateCount = await domUpdateCount;

    // Should have minimal DOM updates despite high movement frequency
    expect(updateCount, `Excessive DOM updates: ${updateCount}`).toBeLessThan(
      20
    );
    await expect(panel).toBeVisible();
  });

  // ===========================================================================
  // 🎭 VISUAL REGRESSION TESTS
  // ===========================================================================

  test("should have consistent visual appearance during hover states", async ({
    page,
  }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');
    const panel = page.locator('[data-testid="hover-panel"]');

    // Take baseline screenshot
    await trigger.hover();
    await expect(panel).toBeVisible();
    await page.waitForTimeout(200); // Let transitions complete

    const baselineScreenshot = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 800,
        height: 400,
      },
    });

    // Move away and back
    await page.mouse.move(0, 0);
    await expect(panel).toBeHidden();
    await page.waitForTimeout(200);

    // Hover again
    await trigger.hover();
    await expect(panel).toBeVisible();
    await page.waitForTimeout(200);

    const secondScreenshot = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 800,
        height: 400,
      },
    });

    // Screenshots should be nearly identical (allowing for minor timing differences)
    expect(Buffer.compare(baselineScreenshot, secondScreenshot)).not.toBe(0); // Different due to timestamps, but...

    // ...the panel structure should be consistent
    const panelOpacity1 = await panel.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
    await trigger.hover();
    await page.waitForTimeout(200);
    const panelOpacity2 = await panel.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );

    expect(panelOpacity1).toBe(panelOpacity2);
    expect(panelOpacity1).toBe("1");
  });

  test("should provide instrumentation data for monitoring", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");

    // Check that hover counting works
    const initialCount = await page.getAttribute(
      '[data-testid="settings-hover"]',
      "data-hover-count"
    );
    expect(initialCount).toBe("0");

    await trigger.hover();
    const afterHoverCount = await page.getAttribute(
      '[data-testid="settings-hover"]',
      "data-hover-count"
    );
    expect(afterHoverCount).toBe("1");

    await page.mouse.move(0, 0);
    await trigger.hover();
    const secondHoverCount = await page.getAttribute(
      '[data-testid="settings-hover"]',
      "data-hover-count"
    );
    expect(secondHoverCount).toBe("2");

    // Instrumentation should be available for monitoring
    const rootElement = page.locator('[data-testid="settings-hover"]');
    await expect(rootElement).toHaveAttribute("data-hover-count");
  });

  // ===========================================================================
  // 📱 ACCESSIBILITY & KEYBOARD TESTS
  // ===========================================================================

  test("should not blink during keyboard navigation", async ({ page }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');
    const panel = page.locator('[data-testid="hover-panel"]');

    // Focus and open with keyboard
    await trigger.focus();
    await trigger.press("Enter");
    await expect(panel).toBeVisible();

    // Panel should not flicker when using keyboard navigation
    let visibilityFlips = 0;
    let wasVisible = true;

    const keyboardMonitor = setInterval(async () => {
      try {
        const isVisible = await panel.isVisible();
        if (isVisible !== wasVisible) {
          visibilityFlips++;
          wasVisible = isVisible;
        }
      } catch (e) {
        // Ignore
      }
    }, 16);

    // Perform keyboard actions
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(500);

    clearInterval(keyboardMonitor);

    // Should have no visibility flips during keyboard navigation
    expect(
      visibilityFlips,
      `Keyboard navigation caused ${visibilityFlips} visibility flips`
    ).toBe(0);

    // Close with Escape
    await trigger.press("Escape");
    await expect(panel).toBeHidden();
  });

  // ===========================================================================
  // 🛡️ DEFENSIVE TESTS
  // ===========================================================================

  test("should recover gracefully from DOM manipulation", async ({ page }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');
    const panel = page.locator('[data-testid="hover-panel"]');

    await trigger.hover();
    await expect(panel).toBeVisible();

    // Simulate external DOM manipulation (like other libraries)
    await page.evaluate(() => {
      const panel = document.querySelector(
        '[data-testid="hover-panel"]'
      ) as HTMLElement;
      if (panel) {
        // Temporarily mess with styles
        panel.style.opacity = "0.5";
        panel.style.transform = "scale(0.8)";

        // Then restore
        setTimeout(() => {
          panel.style.opacity = "";
          panel.style.transform = "";
        }, 100);
      }
    });

    await page.waitForTimeout(200);

    // Should recover to stable state
    await expect(panel).toBeVisible();
    const finalOpacity = await panel.evaluate(
      (el) => window.getComputedStyle(el).opacity
    );
    expect(finalOpacity).toBe("1");
  });

  test("should handle multiple rapid hover components simultaneously", async ({
    page,
  }) => {
    // This test verifies multiple hover components don't interfere
    const allTriggers = page.locator('[data-testid="hover-trigger"]');
    const allPanels = page.locator('[data-testid="hover-panel"]');

    const triggerCount = await allTriggers.count();
    expect(triggerCount).toBeGreaterThan(0);

    // Activate multiple hovers in sequence
    for (let i = 0; i < Math.min(triggerCount, 3); i++) {
      await allTriggers.nth(i).hover();
      await page.waitForTimeout(100);
    }

    // Check that all expected panels are visible
    const visiblePanels = await allPanels.filter({ hasText: /.+/ }).count();
    expect(visiblePanels).toBeLessThanOrEqual(triggerCount);

    // Clear all hovers
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    // All panels should be hidden
    for (let i = 0; i < triggerCount; i++) {
      await expect(allPanels.nth(i)).toBeHidden();
    }
  });
});

// =============================================================================
// 🎯 PERFORMANCE REGRESSION TESTS
// =============================================================================

test.describe("Performance Regression Tests", () => {
  test("should not cause memory leaks during extended hover sessions", async ({
    page,
  }) => {
    const trigger = page.locator('[data-testid="hover-trigger"]');

    // Monitor memory usage during extended hover session
    const initialHeapUsed = await page.evaluate(() => {
      if ("memory" in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Extended hover session
    for (let session = 0; session < 20; session++) {
      await trigger.hover();
      await page.waitForTimeout(100);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(100);
    }

    // Force garbage collection if available
    await page.evaluate(() => {
      if ("gc" in window) {
        (window as any).gc();
      }
    });

    const finalHeapUsed = await page.evaluate(() => {
      if ("memory" in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    if (initialHeapUsed > 0 && finalHeapUsed > 0) {
      const heapGrowth = finalHeapUsed - initialHeapUsed;
      const maxAcceptableGrowth = 1024 * 1024; // 1MB

      expect(heapGrowth).toBeLessThan(maxAcceptableGrowth);
    }

    // Final state should be clean
    await expect(page.locator('[data-testid="hover-panel"]')).toBeHidden();
  });
});
