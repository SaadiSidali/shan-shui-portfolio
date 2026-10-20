const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { baseURL, instrumentLandscape } = require("./browser.cjs");

(async () => {
  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL,
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await instrumentLandscape(page);
    await page.addInitScript(() => {
      Math.random = () => 0.5;
    });
    await page.clock.install();
    await page.goto(baseURL, { waitUntil: "load" });
    await page.waitForFunction(() => window.landscapeTest.lastCraneDraw);
    await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
    const first = await page.evaluate(() => window.landscapeTest.lastCraneDraw);
    assert(
      first.top >= 844 * 0.04 && first.top <= 844 * 0.13,
      "Birds stay in the upper sky",
    );
    assert.equal(
      await page.locator(".landscape img").count(),
      0,
      "No stationary flock overlay",
    );
    await page.clock.runFor(500);
    const moved = await page.evaluate(() => window.landscapeTest.lastCraneDraw);
    assert(moved.left < first.left, "Bird travels with the landscape");
    assert(
      Math.abs(
        first.left - moved.left - (first.terrainLeft - moved.terrainLeft),
      ) < 0.5,
      "Bird and terrain share the same scroll distance",
    );
    await page.clock.runFor(9000);
    assert.equal(
      await page.evaluate(() => window.landscapeTest.craneVisible),
      false,
      "Bird exits the viewport",
    );
    await page.clock.runFor(20000);
    assert.equal(
      await page.evaluate(() => window.landscapeTest.craneVisible),
      false,
      "Long quiet gap between birds",
    );
    await page.evaluate(() => {
      Math.random = () => 0.1;
    });
    await page.clock.runFor(12000);
    const next = await page.evaluate(() => ({
      visible: window.landscapeTest.craneVisible,
      ...window.landscapeTest.lastCraneDraw,
    }));
    assert(next.visible, "Another bird arrives after the quiet gap");
    assert.notEqual(
      next.src,
      first.src,
      "Independent cutouts vary between passages",
    );
    assert.notEqual(next.top, first.top, "Sky position is randomized");
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "No mobile overflow",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: individual cranes; upper sky; synchronized scrolling; offscreen exit; quiet intervals; randomized pose and height.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
