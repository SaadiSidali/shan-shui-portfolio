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
      viewport: { width: 1440, height: 960 },
    });
    await instrumentLandscape(page);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(baseURL, { waitUntil: "load" });
    await page.waitForFunction(
      () => window.landscapeTest.decoded >= 2 && window.landscapeTest.lastDraw,
    );
    assert.equal(
      page.workers().length,
      1,
      "Exactly one generation worker remains active",
    );
    const lifecycle = await page.evaluate(() => ({
      created: window.landscapeTest.workers,
      terminated: window.landscapeTest.terminated,
    }));
    assert.equal(
      lifecycle.created - lifecycle.terminated,
      1,
      "Unmounted renderers terminate their workers, including Strict Mode remounts",
    );
    const worker = page.workers()[0];
    assert(
      await worker.evaluate(
        () =>
          typeof window === "undefined" &&
          typeof document === "undefined" &&
          typeof chunkloader === "function",
      ),
      "Generation is isolated from React",
    );
    assert(
      await page.evaluate(
        () =>
          typeof window.chunkloader === "undefined" &&
          !document.querySelector("iframe,svg,polyline"),
      ),
      "React owns the native canvas without an iframe or SVG geometry",
    );
    const initial = await page.evaluate(() =>
      window.landscapeTest.requests.find((message) => message.type === "init"),
    );
    const ahead = await worker.evaluate(
      () =>
        new Promise((resolve) => {
          function check() {
            const ahead = MEM.xmax - MEM.cursx - MEM.windx;
            if (ahead >= 8192) resolve(ahead);
            else setTimeout(check, 10);
          }
          check();
        }),
    );
    assert(ahead >= 8192, "A large stretch of terrain is generated ahead");
    const timing = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const state = window.landscapeTest;
          const start = performance.now();
          const firstDraw = { ...state.lastDraw };
          const startCount = state.drawCount;
          const samples = [];
          let previous = start;
          function sample(time) {
            samples.push(time - previous);
            previous = time;
            if (time - start < 1500) {
              requestAnimationFrame(sample);
              return;
            }
            samples.sort((a, b) => a - b);
            resolve({
              medianMs: samples[Math.floor(samples.length / 2)],
              fps: (samples.length * 1000) / (time - start),
              pixelsPerSecond:
                (((firstDraw.left - state.lastDraw.left) / devicePixelRatio) *
                  1000) /
                (state.lastDraw.time - firstDraw.time),
              draws: state.drawCount - startCount,
              sameTile: firstDraw.id === state.lastDraw.id,
            });
          }
          requestAnimationFrame(sample);
        }),
    );
    assert(
      timing.fps > 45 && timing.medianMs < 25 && timing.draws > 60,
      "Canvas draws at the browser refresh rate",
    );
    assert(
      timing.sameTile &&
        timing.pixelsPerSecond > 48 &&
        timing.pixelsPerSecond < 60,
      "Travel preserves its 54-pixel-per-second speed",
    );
    await page
      .getByRole("button", { name: "Pause landscape animation" })
      .click();
    const stopped = await page.evaluate(() => window.landscapeTest.drawCount);
    await page.waitForTimeout(200);
    assert.equal(
      await page.evaluate(() => window.landscapeTest.drawCount),
      stopped,
      "Pause stops drawing",
    );
    await page
      .getByRole("button", { name: "Play landscape animation" })
      .click();
    await page.waitForTimeout(200);
    assert(
      (await page.evaluate(() => window.landscapeTest.drawCount)) > stopped,
      "Play resumes drawing",
    );

    const workerCreated = page.waitForEvent("worker");
    await page.evaluate((initial) => {
      window.workerProbe = new Worker(window.landscapeTest.workerUrl);
      window.workerProbe.postMessage(initial);
    }, initial);
    const probe = await workerCreated;
    await probe.evaluate(
      () =>
        new Promise((resolve) => {
          function ready() {
            if (typeof MEM !== "undefined" && MEM.xmax >= MEM.windx + 8192)
              resolve();
            else setTimeout(ready, 10);
          }
          ready();
        }),
    );
    for (let i = 1; i <= 12; i++) {
      await probe.evaluate(
        (x) => self.onmessage({ data: { type: "view", x } }),
        i * 1024 + 10,
      );
    }
    const terrain = await probe.evaluate(() => ({
      cursor: MEM.cursx,
      xmax: MEM.xmax,
      stale: MEM.chunks.filter((chunk) => chunk.x <= MEM.cursx - 2048).length,
    }));
    assert(
      terrain.cursor > 12000 && terrain.xmax > terrain.cursor + 4096,
      "Worker refills terrain through twelve tile boundaries",
    );
    assert.equal(terrain.stale, 0, "Old geometry is discarded");
    const invalidRequest = await page.evaluate(
      () =>
        new Promise((resolve) => {
          window.workerProbe.onmessage = (event) => {
            if (event.data.type === "error") resolve(event.data.message);
          };
          window.workerProbe.postMessage({ type: "view", x: -1 });
        }),
    );
    assert.equal(
      invalidRequest,
      "Invalid landscape position",
      "Worker rejects invalid requests",
    );
    const closed = probe.waitForEvent("close");
    await page.evaluate(() => {
      window.workerProbe.terminate();
      delete window.workerProbe;
    });
    await closed;
    assert.equal(
      page.workers().length,
      1,
      "Isolated generation check releases its worker",
    );
    assert(
      await page.locator("#landscape-canvas").evaluate((canvas) =>
        canvas
          .getContext("2d")
          .getImageData(0, 0, canvas.width, canvas.height)
          .data.some((value, index) => index % 4 === 3 && value > 0),
      ),
      "Visible canvas contains terrain",
    );
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => window.landscapeTest.lastDraw);
    assert.notEqual(
      await page.evaluate(
        () =>
          window.landscapeTest.requests.find(
            (message) => message.type === "init",
          ).seed,
      ),
      initial.seed,
      "Reload uses a fresh seed",
    );
    const wasOpen =
      (await page.locator(".project").nth(1).getAttribute("open")) !== null;
    await page.locator(".project").nth(1).locator("summary").click();
    assert.notEqual(
      (await page.locator(".project").nth(1).getAttribute("open")) !== null,
      wasOpen,
      "Project disclosures still toggle",
    );
    const pdf = await page.request.get(new URL("resume.pdf", baseURL).href);
    assert.equal(pdf.status(), 200);
    assert((await pdf.body()).subarray(0, 4).toString() === "%PDF");
    const resizeTime = await page.evaluate(() => performance.now());
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() =>
      window.landscapeTest.requests.some(
        (message) => message.type === "resize",
      ),
    );
    await page.waitForFunction(
      (time) => window.landscapeTest.lastDraw?.time > time,
      resizeTime,
    );
    const cache = await page.evaluate(() => ({
      created: window.landscapeTest.decoded,
      closed: window.landscapeTest.released,
    }));
    assert(
      cache.closed > 0 && cache.created - cache.closed <= 4,
      "Resize releases bitmaps and the nearby cache remains bounded",
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Mobile has no horizontal overflow",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    const reduced = await page.evaluate(
      () => window.landscapeTest.lastDraw.left,
    );
    await page.waitForTimeout(200);
    assert.equal(
      await page.evaluate(() => window.landscapeTest.lastDraw.left),
      reduced,
      "Reduced motion stops landscape travel",
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Play landscape animation" })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.deepEqual(errors, [], "No browser errors");
    console.log(
      JSON.stringify({
        result: "PASS",
        timing,
        lifecycle,
        ahead,
        terrain,
        cache,
        checks:
          "native React canvas; worker isolation; buffered generation; pause/play; random seed; bounded bitmaps; resize; disclosures; résumé; reduced motion",
        errors,
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
