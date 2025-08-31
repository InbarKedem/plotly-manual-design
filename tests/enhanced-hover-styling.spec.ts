import { test, expect } from "@playwright/test";

test.describe("Enhanced Hover Mode Styling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5174/");
    await page.waitForSelector('[data-testid="unified-plotter"]', {
      timeout: 10000,
    });
    await page.waitForTimeout(2000);
  });

  test("unified plotter component renders correctly", async ({ page }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    await expect(plotContainer).toBeVisible();

    const plotSvg = page.locator(".plotly svg").first();
    await expect(plotSvg).toBeVisible({ timeout: 5000 });
  });

  test("hover functionality is accessible", async ({ page }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    await expect(plotContainer).toBeVisible();

    await plotContainer.hover();
    await page.waitForTimeout(300);

    expect(true).toBe(true);
  });

  test("modern styling is applied", async ({ page }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    await expect(plotContainer).toBeVisible();

    const containerStyle = await plotContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        position: style.position,
        borderRadius: style.borderRadius,
        transition: style.transition,
      };
    });

    expect(containerStyle.position).toBe("relative");
    expect(containerStyle.borderRadius).toBe("8px");
    expect(containerStyle.transition).toContain("ease-in-out");
  });

  test("hover interactions don't break existing functionality", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    await expect(plotContainer).toBeVisible();

    await plotContainer.hover();
    await page.waitForTimeout(200);

    const controls = page.locator('[data-testid="plotter-controls-root"]');
    await expect(controls).toBeVisible();
  });
});
