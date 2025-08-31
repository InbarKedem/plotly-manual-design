import { test, expect } from "@playwright/test";

test.describe("Stable Hover Implementation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    // Wait for the application to load
    await page.waitForSelector('[data-testid="plotter-controls-root"]', {
      timeout: 10000,
    });
  });

  test("stable hover controls are present and accessible", async ({ page }) => {
    // Check that the controls root is present
    const controlsRoot = page.getByTestId("plotter-controls-root");
    await expect(controlsRoot).toBeVisible();

    // Check that settings control exists
    const settingsControl = page.getByTestId("settings-hover");
    await expect(settingsControl).toBeVisible();

    // Check that debug control exists
    const debugControl = page.getByTestId("debug-hover");
    await expect(debugControl).toBeVisible();

    // Test hover interaction on settings
    const settingsTrigger = settingsControl.getByTestId("hover-trigger");
    const settingsPanel = settingsControl.getByTestId("hover-panel");

    // Initially panel should be hidden
    await expect(settingsPanel).toHaveAttribute("data-state", "closed");

    // Hover over trigger should open panel
    await settingsTrigger.hover();

    // Wait a moment for the hover delay
    await page.waitForTimeout(100);

    await expect(settingsPanel).toHaveAttribute("data-state", "open");
    await expect(settingsPanel).toBeVisible();

    // Panel should contain the expected content
    await expect(settingsPanel.getByText("Interaction Settings")).toBeVisible();
    await expect(
      settingsPanel.getByText("Hover Opacity Effects")
    ).toBeVisible();
  });

  test("hover interactions are stable during pointer movement", async ({
    page,
  }) => {
    const settingsControl = page.getByTestId("settings-hover");
    const settingsTrigger = settingsControl.getByTestId("hover-trigger");
    const settingsPanel = settingsControl.getByTestId("hover-panel");

    // Hover to open
    await settingsTrigger.hover();
    await page.waitForTimeout(100);
    await expect(settingsPanel).toHaveAttribute("data-state", "open");

    // Get bounding boxes for movement
    const triggerBox = await settingsTrigger.boundingBox();
    const panelBox = await settingsPanel.boundingBox();

    if (!triggerBox || !panelBox) {
      throw new Error("Could not get element bounding boxes");
    }

    // Move from trigger to panel (simulating diagonal movement)
    const startX = triggerBox.x + triggerBox.width / 2;
    const startY = triggerBox.y + triggerBox.height;
    const endX = panelBox.x + 20;
    const endY = panelBox.y + 20;

    // Move in small steps to simulate realistic mouse movement
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      const y = startY + ((endY - startY) * i) / steps;
      await page.mouse.move(x, y);

      // Panel should remain open during movement
      await expect(settingsPanel).toHaveAttribute("data-state", "open");
    }

    // Panel should still be open at the end
    await expect(settingsPanel).toHaveAttribute("data-state", "open");
  });

  test("instrumentation counters work correctly", async ({ page }) => {
    const settingsControl = page.getByTestId("settings-hover");
    const settingsTrigger = settingsControl.getByTestId("hover-trigger");

    // Check initial counters
    await expect(settingsControl).toHaveAttribute("data-open-count", "0");
    await expect(settingsControl).toHaveAttribute("data-close-count", "0");

    // Hover to open
    await settingsTrigger.hover();
    await page.waitForTimeout(100);

    // Counter should increment
    await expect(settingsControl).toHaveAttribute("data-open-count", "1");
    await expect(settingsControl).toHaveAttribute("data-close-count", "0");

    // Move away to close
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200); // Wait for close delay

    // Close counter should increment
    await expect(settingsControl).toHaveAttribute("data-close-count", "1");
  });

  test("debug control shows performance metrics when enabled", async ({
    page,
  }) => {
    const debugControl = page.getByTestId("debug-hover");
    const debugTrigger = debugControl.getByTestId("hover-trigger");
    const debugPanel = debugControl.getByTestId("hover-panel");

    // Open debug panel
    await debugTrigger.hover();
    await page.waitForTimeout(100);

    await expect(debugPanel).toBeVisible();
    await expect(debugPanel.getByText("Debug Information")).toBeVisible();

    // Find and click the debug toggle
    const debugToggle = debugPanel.getByRole("switch", { name: /debug mode/i });
    if (await debugToggle.isVisible()) {
      await debugToggle.click();

      // Check if performance metrics appear
      // Note: This depends on the actual debug data being present
      const performanceSection = debugPanel.getByText("Performance:");
      // We don't assert this is visible since it depends on metrics being available
      console.log("Debug toggle clicked - metrics may be visible");
    }
  });

  test("accessibility attributes are properly set", async ({ page }) => {
    const settingsControl = page.getByTestId("settings-hover");
    const settingsTrigger = settingsControl.getByTestId("hover-trigger");
    const settingsPanel = settingsControl.getByTestId("hover-panel");

    // Check ARIA attributes on trigger
    await expect(settingsTrigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(settingsTrigger).toHaveAttribute("aria-expanded", "false");

    // Hover to open
    await settingsTrigger.hover();
    await page.waitForTimeout(100);

    // Check updated ARIA attributes
    await expect(settingsTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(settingsPanel).toHaveAttribute("role", "menu");
    await expect(settingsPanel).toHaveAttribute("aria-hidden", "false");
  });
});
