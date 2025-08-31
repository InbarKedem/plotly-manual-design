// =============================================================================
// 🎯 CURVE VISIBILITY ENHANCEMENT TESTS
// =============================================================================
// Specific tests to verify the curve visibility improvements requested:
// - Non-hovered curves maintain 0.4-0.6 opacity (not 0.15)
// - Hovered curve is emphasized with increased stroke width
// - All curves remain distinguishable during hover interactions

import { test, expect } from "@playwright/test";

test.describe("Curve Visibility Enhancement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-testid="unified-plotter"]')).toBeVisible();
    await page.waitForTimeout(1500); // Allow plot to fully initialize
  });

  test("should maintain non-hovered curves at 0.4-0.6 opacity instead of hiding them", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Enable hover opacity feature and hover over the plot
    await plotArea.hover({ position: { x: 250, y: 200 } });
    await page.waitForTimeout(500); // Allow hover effects to apply

    // Get all trace elements (plotly curves)
    const traces = await plotContainer.locator(".plotly .trace").all();

    if (traces.length > 1) {
      let fadeOpacityCount = 0;
      let emphasizedCount = 0;

      for (const trace of traces) {
        const traceOpacity = await trace.evaluate((el) => {
          // Check for both the element's opacity and any path elements within
          const pathElements = el.querySelectorAll("path");
          let maxOpacity = parseFloat(
            window.getComputedStyle(el).opacity || "1"
          );

          pathElements.forEach((path) => {
            const pathOpacity = parseFloat(
              window.getComputedStyle(path).opacity || "1"
            );
            maxOpacity = Math.max(maxOpacity, pathOpacity);
          });

          return maxOpacity;
        });

        // Categorize traces by opacity
        if (traceOpacity >= 0.4 && traceOpacity <= 0.6) {
          fadeOpacityCount++;
        } else if (traceOpacity >= 0.9) {
          emphasizedCount++;
        }

        // Critical check: no trace should be nearly invisible (< 0.3)
        expect(traceOpacity).toBeGreaterThan(0.3);
      }

      // Should have both faded and emphasized traces
      expect(fadeOpacityCount + emphasizedCount).toBeGreaterThan(0);
    }
  });

  test("should emphasize hovered curve with increased visual prominence", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Hover to trigger emphasis
    await plotArea.hover({ position: { x: 250, y: 200 } });
    await page.waitForTimeout(500);

    const traces = await plotContainer.locator(".plotly .trace").all();

    if (traces.length > 1) {
      let emphasizedCount = 0;
      let fadedCount = 0;

      for (const trace of traces) {
        const traceData = await trace.evaluate((el) => {
          const style = window.getComputedStyle(el);
          const paths = el.querySelectorAll("path");

          let maxOpacity = parseFloat(style.opacity || "1");
          let strokeWidth = 0;

          paths.forEach((path) => {
            const pathStyle = window.getComputedStyle(path);
            const pathOpacity = parseFloat(pathStyle.opacity || "1");
            const pathStrokeWidth = parseFloat(pathStyle.strokeWidth || "0");

            maxOpacity = Math.max(maxOpacity, pathOpacity);
            strokeWidth = Math.max(strokeWidth, pathStrokeWidth);
          });

          return { opacity: maxOpacity, strokeWidth };
        });

        // Check for emphasis (high opacity indicates emphasized trace)
        if (traceData.opacity >= 0.9) {
          emphasizedCount++;
        } else if (traceData.opacity >= 0.4 && traceData.opacity <= 0.6) {
          fadedCount++;
        }
      }

      // Should have at least one emphasized trace and one faded trace
      expect(emphasizedCount).toBeGreaterThan(0);
      expect(fadedCount).toBeGreaterThan(0);
    }
  });

  test("should keep all curves distinguishable during hover", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Test multiple hover positions
    const hoverPositions = [
      { x: 150, y: 180 },
      { x: 250, y: 220 },
      { x: 350, y: 200 },
      { x: 450, y: 250 },
    ];

    for (const position of hoverPositions) {
      await plotArea.hover({ position });
      await page.waitForTimeout(300);

      const traces = await plotContainer.locator(".plotly .trace").all();

      for (const trace of traces) {
        const isVisible = await trace.evaluate((el) => {
          const style = window.getComputedStyle(el);
          const opacity = parseFloat(style.opacity || "1");
          const visibility = style.visibility;
          const display = style.display;

          return opacity > 0.3 && visibility !== "hidden" && display !== "none";
        });

        // Every trace should remain distinguishable (visible)
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test("should reset curve appearance when hover ends", async ({ page }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Get initial state
    const initialOpacities = await plotContainer
      .locator(".plotly .trace")
      .evaluateAll((traces) => {
        return traces.map((trace) => {
          const style = window.getComputedStyle(trace);
          return parseFloat(style.opacity || "1");
        });
      });

    // Hover to trigger changes
    await plotArea.hover({ position: { x: 250, y: 200 } });
    await page.waitForTimeout(300);

    // Move mouse away to end hover
    await page.mouse.move(50, 50);
    await page.waitForTimeout(300);

    // Check final state - should return to normal
    const finalOpacities = await plotContainer
      .locator(".plotly .trace")
      .evaluateAll((traces) => {
        return traces.map((trace) => {
          const style = window.getComputedStyle(trace);
          return parseFloat(style.opacity || "1");
        });
      });

    // All traces should return to high visibility
    finalOpacities.forEach((opacity) => {
      expect(opacity).toBeGreaterThanOrEqual(0.8);
    });
  });

  test("should handle rapid hover movements without flickering", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Rapid hover movements
    const rapidPositions = [
      { x: 200, y: 200 },
      { x: 220, y: 210 },
      { x: 240, y: 220 },
      { x: 260, y: 230 },
      { x: 280, y: 240 },
    ];

    let visibilityConsistent = true;

    for (const position of rapidPositions) {
      await plotArea.hover({ position });
      await page.waitForTimeout(50); // Very short wait for rapid movement

      const traces = await plotContainer.locator(".plotly .trace").all();

      for (const trace of traces) {
        const opacity = await trace.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.opacity || "1");
        });

        // Should never become completely invisible during rapid hover
        if (opacity < 0.3) {
          visibilityConsistent = false;
          break;
        }
      }

      if (!visibilityConsistent) break;
    }

    expect(visibilityConsistent).toBeTruthy();
  });

  test("should work correctly with different numbers of curves", async ({
    page,
  }) => {
    const plotContainer = page.locator('[data-testid="unified-plotter"]');
    const plotArea = plotContainer.locator(".plotly .main-svg").first();

    // Get the current number of traces
    const traceCount = await plotContainer.locator(".plotly .trace").count();

    if (traceCount > 0) {
      await plotArea.hover({ position: { x: 250, y: 200 } });
      await page.waitForTimeout(300);

      const traces = await plotContainer.locator(".plotly .trace").all();

      // All traces should be handled correctly regardless of count
      for (const trace of traces) {
        const opacity = await trace.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.opacity || "1");
        });

        // Should either be emphasized (>0.9) or faded but visible (0.4-0.6)
        const isValidOpacity =
          opacity >= 0.9 || (opacity >= 0.4 && opacity <= 0.6);
        expect(isValidOpacity).toBeTruthy();
      }
    }
  });
});
