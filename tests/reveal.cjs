const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { baseURL, instrumentLandscape } = require("./browser.cjs");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL,
    headless: true,
  });
  try {
    for (const slow of [false, true]) {
      const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
      });
      await instrumentLandscape(page);
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      await page.route("**/landscape/generator.js", async (route) => {
        await gate;
        await route.continue();
      });
      await page.goto(baseURL, { waitUntil: "domcontentloaded" });
      await page.locator(".page-loader").waitFor();
      assert.equal(
        await page.locator('.page-loader svg[aria-hidden="true"]').count(),
        1,
        "The loader uses a decorative ink landscape",
      );
      assert.equal(
        await page.locator(".loading-status").textContent(),
        "Loading landscape…",
        "Loading status remains available to assistive technology",
      );
      if (!slow) {
        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(
          await page
            .locator(".loading-ink path")
            .first()
            .evaluate((path) => getComputedStyle(path).animationName),
          "none",
          "The loading illustration respects reduced motion",
        );
        await page.emulateMedia({ reducedMotion: "no-preference" });
      }
      assert.equal(
        await page
          .locator('link[rel="preload"][as="script"]')
          .evaluate((link) => link.href),
        new URL("landscape/generator.js", baseURL).href,
        "Generator preload uses the same URL as the worker",
      );
      assert(
        await page
          .locator(".site-content")
          .evaluate((element) => element.inert),
        "Content stays inert while terrain loads",
      );
      assert.equal(
        await page.evaluate(() => window.landscapeTest.readyEvents),
        0,
      );
      if (slow) {
        await page.waitForFunction(
          () => !document.querySelector(".site-content").inert,
          null,
          { timeout: 10000 },
        );
        assert.equal(
          await page.evaluate(() => window.landscapeTest.readyEvents),
          0,
          "A stalled worker cannot hide the content indefinitely",
        );
      }
      release();
      await page.waitForFunction(() => window.landscapeTest.readyEvents === 1);
      await page.waitForFunction(
        () => !document.querySelector(".site-content").inert,
      );
      assert.equal(
        await page.locator(".page-loader").count(),
        0,
        "Loading screen is removed",
      );
      assert.equal(
        await page
          .locator(
            ".seal, #motion-toggle, .landscape-controls, .project-kicker, .project-category, .project-number",
          )
          .count(),
        0,
        "Decorative mark, landscape controls, and excess labels are removed",
      );
      assert.equal(
        await page
          .locator(".hero")
          .evaluate((element) => getComputedStyle(element).textAlign),
        "center",
      );
      assert(
        await page
          .locator(".hero")
          .evaluate(
            (element) =>
              element.getBoundingClientRect().bottom -
                element.querySelector(".hero-actions").getBoundingClientRect()
                  .bottom >
              innerHeight * 0.4,
          ),
        "The lower hero leaves space for the artwork",
      );
      await page.close();
    }
    const failed = await browser.newPage();
    await failed.route("**/landscape/generator.js", (route) => route.abort());
    await failed.goto(baseURL, { waitUntil: "load" });
    await failed.waitForFunction(
      () => !document.querySelector(".site-content").inert,
    );
    assert.equal(
      await failed.locator(".page-loader").count(),
      0,
      "Worker failure still reveals the portfolio",
    );
    await failed.close();
    console.log(
      JSON.stringify({
        result: "PASS",
        checks:
          "loading gate; first-frame event; delayed worker timeout and recovery; failed worker fallback; centered mobile hero; open artwork space; reduced labels and controls",
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
