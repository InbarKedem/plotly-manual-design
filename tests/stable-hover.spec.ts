// =============================================================================
// 🧪 STABLE HOVER TESTS - PLAYWRIGHT E2E TESTING
// =============================================================================

import { test, expect } from "@playwright/test";

// =============================================================================
// 🔧 TEST UTILITIES
// =============================================================================

/**
 * Generate smooth movement steps from one point to another
 */
const steps = (
  from: [number, number],
  to: [number, number],
  n = 10
): [number, number][] => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const pts: [number, number][] = [];

  for (let i = 1; i <= n; i++) {
    pts.push([x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n]);
  }

  return pts;
};

// =============================================================================
// 📋 STABLE HOVER TESTS
// =============================================================================

test.describe("Stable Hover Interactions", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the UnifiedPlotter demo
    await page.goto("/");

    // Wait for the application to load
    await page.waitForSelector('[data-testid="plotter-controls-root"]');
  });

  // ==========================================================================
  // 🎯 CORE STABILITY TESTS
  // ==========================================================================

  test("stays open while moving diagonally from trigger to panel", async ({
    page,
  }) => {
    const root = page.getByTestId("settings-hover");
    const trigger = root.getByTestId("hover-trigger");
    const panel = root.getByTestId("hover-panel");

    // Hover over trigger to open panel
    await trigger.hover();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("data-state", "open");

    // Get bounding boxes for diagonal movement
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Unable to get element bounding boxes");
    }

    // Calculate diagonal movement path from bottom-right of trigger to top-left of panel
    const from: [number, number] = [
      triggerBox.x + triggerBox.width - 2,
      triggerBox.y + triggerBox.height - 2,
    ];
    const to: [number, number] = [panelBox.x + 2, panelBox.y + 2];

    // Move along the diagonal path step by step
    for (const [x, y] of steps(from, to, 16)) {
      await page.mouse.move(x, y, { steps: 1 });

      // Panel should remain open during the entire journey
      await expect(panel).toBeVisible();
      await expect(panel).toHaveAttribute("data-state", "open");
    }

    // Linger briefly on the panel and confirm it's still open
    await page.waitForTimeout(200);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("data-state", "open");
  });

  test("no rapid open/close flicker under pointer jitter", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Simulate jittery mouse movement near the trigger
    const triggerBox = await trigger.boundingBox();
    if (!triggerBox) throw new Error("Unable to get trigger bounding box");

    const centerX = triggerBox.x + triggerBox.width / 2;
    const centerY = triggerBox.y + triggerBox.height / 2;

    // Perform several rapid enter/leave movements
    for (let i = 0; i < 5; i++) {
      // Move to trigger
      await page.mouse.move(centerX, centerY);
      await expect(panel).toBeVisible();

      // Move slightly outside trigger (but within close delay)
      await page.mouse.move(centerX - 10, centerY - 10);

      // Wait a bit less than close delay - panel should still be open
      await page.waitForTimeout(100);
      await expect(panel).toHaveAttribute("data-state", /open|closing/);

      // Move back to trigger quickly
      await page.mouse.move(centerX, centerY);
    }
  });

  test("instrumentation counters work correctly during interactions", async ({
    page,
  }) => {
    const root = page.getByTestId("settings-hover");
    const trigger = root.getByTestId("hover-trigger");

    // Initially should have no opens or closes
    await expect(root).toHaveAttribute("data-open-count", "0");
    await expect(root).toHaveAttribute("data-close-count", "0");

    // Hover to open
    await trigger.hover();
    await expect(root).toHaveAttribute("data-open-count", "1");
    await expect(root).toHaveAttribute("data-close-count", "0");

    // Move away to close
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200); // Wait for close delay
    await expect(root).toHaveAttribute("data-close-count", "1");

    // Ensure close count doesn't exceed open count during any interaction
    const openCount = parseInt(
      (await root.getAttribute("data-open-count")) || "0"
    );
    const closeCount = parseInt(
      (await root.getAttribute("data-close-count")) || "0"
    );
    expect(closeCount).toBeLessThanOrEqual(openCount);
  });

  // ==========================================================================
  // ♿ ACCESSIBILITY TESTS
  // ==========================================================================

  test("keyboard navigation works correctly", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Focus trigger with keyboard
    await trigger.focus();
    await expect(trigger).toBeFocused();

    // Enter should open the panel (if implemented)
    await page.keyboard.press("Enter");
    // Note: This depends on implementation - hover components might not respond to Enter

    // Tab should move focus within panel (if it contains focusable elements)
    await page.keyboard.press("Tab");

    // Escape should close the panel and return focus to trigger
    await page.keyboard.press("Escape");
    await expect(panel).toHaveAttribute("data-state", "closed");
    await expect(trigger).toBeFocused();
  });

  test("aria attributes are correctly set", async ({ page }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    // Check initial ARIA attributes
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Hover to open
    await trigger.hover();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveAttribute("role", "menu");
    await expect(panel).toHaveAttribute("aria-hidden", "false");

    // Move away to close
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  // ==========================================================================
  // 🎨 MULTIPLE CONTROLS TESTS
  // ==========================================================================

  test("multiple hover controls can coexist without interference", async ({
    page,
  }) => {
    const settingsHover = page.getByTestId("settings-hover");
    const debugHover = page.getByTestId("debug-hover");

    const settingsTrigger = settingsHover.getByTestId("hover-trigger");
    const settingsPanel = settingsHover.getByTestId("hover-panel");

    const debugTrigger = debugHover.getByTestId("hover-trigger");
    const debugPanel = debugHover.getByTestId("hover-panel");

    // Open first control
    await settingsTrigger.hover();
    await expect(settingsPanel).toBeVisible();
    await expect(debugPanel).toBeHidden();

    // Open second control (first should close)
    await debugTrigger.hover();
    await expect(debugPanel).toBeVisible();

    // Settings panel should eventually close when we move away from it
    await page.waitForTimeout(200);
    await expect(settingsPanel).toHaveAttribute("data-state", "closed");
  });

  // ==========================================================================
  // ⚡ PERFORMANCE TESTS
  // ==========================================================================

  test("no performance regressions during rapid interactions", async ({
    page,
  }) => {
    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");

    // Measure time for rapid interactions
    const startTime = Date.now();

    // Perform many rapid hover interactions
    for (let i = 0; i < 10; i++) {
      await trigger.hover();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(10); // Short delay
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Should complete quickly (adjust threshold based on your requirements)
    expect(totalTime).toBeLessThan(2000); // 2 seconds max for 10 interactions
  });

  test("respects reduced motion preferences", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });

    const trigger = page
      .getByTestId("settings-hover")
      .getByTestId("hover-trigger");
    const panel = page.getByTestId("settings-hover").getByTestId("hover-panel");

    await trigger.hover();

    // Panel should still function but with reduced animations
    await expect(panel).toBeVisible();

    // Check that transition duration is reduced (this depends on your CSS implementation)
    const panelStyles = await panel.evaluate((el) => getComputedStyle(el));
    const transitionDuration = panelStyles.transitionDuration;

    // Should either be 0s or very short
    expect(
      ["0s", "0.1s"].some((duration) => transitionDuration.includes(duration))
    ).toBeTruthy();
  });
});

// =============================================================================
// 🔧 DEMO-SPECIFIC TESTS
// =============================================================================

test.describe("UnifiedPlotter Integration", () => {
  test("controls interact correctly with plot functionality", async ({
    page,
  }) => {
    await page.goto("/");

    const settingsControl = page.getByTestId("settings-hover");
    const settingsTrigger = settingsControl.getByTestId("hover-trigger");
    const settingsPanel = settingsControl.getByTestId("hover-panel");

    // Open settings
    await settingsTrigger.hover();
    await expect(settingsPanel).toBeVisible();

    // Find the hover opacity toggle (this depends on your implementation)
    const opacityToggle = settingsPanel.getByRole("switch", {
      name: /hover opacity/i,
    });

    if (await opacityToggle.isVisible()) {
      await opacityToggle.click();

      // Verify the setting was applied (you might need to check plot state)
      // This is a placeholder - adjust based on your actual implementation
      console.log("Opacity toggle clicked - check plot state");
    }
  });
});
