import { test, expect } from "@playwright/test";

test.describe("Page Debug", () => {
  test("should show what elements are on the page", async ({ page }) => {
    await page.goto("http://localhost:5174/");

    // Wait a moment for page to load
    await page.waitForTimeout(2000);

    // Get the page title
    const title = await page.title();
    console.log("Page title:", title);

    // Get all data-testid elements
    const testIdElements = await page.locator("[data-testid]").all();
    console.log("Found", testIdElements.length, "elements with data-testid");

    for (const element of testIdElements) {
      const testId = await element.getAttribute("data-testid");
      const tagName = await element.evaluate((el) => el.tagName);
      console.log(`- ${testId} (${tagName})`);
    }

    // Check what's in the body
    const bodyContent = await page.locator("body").innerHTML();
    console.log("Body HTML length:", bodyContent.length);
    console.log('Body contains "unified":', bodyContent.includes("unified"));
    console.log('Body contains "hover":', bodyContent.includes("hover"));
    console.log('Body contains "plotly":', bodyContent.includes("plotly"));

    // Take a screenshot for debugging
    await page.screenshot({ path: "debug-page.png", fullPage: true });

    expect(true).toBe(true); // Always pass, just for debugging
  });
});
