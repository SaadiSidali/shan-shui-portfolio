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
      viewport: { width: 1440, height: 1000 },
    });
    await instrumentLandscape(page);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(baseURL, { waitUntil: "load" });
    await page.evaluate(() =>
      document
        .querySelectorAll("img")
        .forEach((image) => (image.loading = "eager")),
    );
    await page.waitForFunction(() =>
      [...document.images].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((image) => image.decode().catch(() => {})),
      ),
    );
    assert(
      await page
        .locator(".company-logos img, .job-company img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              getComputedStyle(image).filter === "none" &&
              getComputedStyle(image).opacity === "1",
          ),
        ),
      "Team and experience logos show full color",
    );
    assert.equal(
      await page.locator(".project").count(),
      2,
      "Selected work contains the two platforms",
    );
    const catering = page.locator(".project").first();
    assert.equal(
      await catering.locator(".website-preview").getAttribute("href"),
      "https://caterings.com.au/b/Feedwell%20Catering%20Sydney",
    );
    assert.equal(
      await catering
        .locator(".website-preview img")
        .evaluate((image) => image.naturalWidth),
      1440,
    );
    const stores = page.locator(".project").nth(1);
    assert((await stores.innerText()).includes("Scaling is the core purpose"));
    assert.equal(await stores.locator(".theme-shot").count(), 7);
    const freelance = page.locator(".marquee-group").first();
    assert.equal(await freelance.locator(".freelance-card").count(), 6);
    assert.equal(
      await freelance.locator(".freelance-logo").count(),
      6,
      "All projects use logos",
    );
    assert(
      await freelance
        .locator(".freelance-card")
        .evaluateAll((links) =>
          links.every(
            (link) =>
              link.children.length === 1 &&
              link.firstElementChild.tagName === "IMG" &&
              link.firstElementChild.alt,
          ),
        ),
      "Project links contain only accessible logos",
    );
    assert.equal(
      await page
        .locator(
          "#freelance .freelance-preview, #freelance .freelance-card-caption",
        )
        .count(),
      0,
      "Screenshot cards and captions are removed",
    );
    const urls = await freelance
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.href));
    for (const host of [
      "dzsta.com",
      "oranaise.com.au",
      "coolroomhiresa.com.au",
      "iphoneprixalgerie.com",
      "enfes.com.au",
      "aimobilealgerie.com",
    ])
      assert(
        urls.some(
          (url) => new URL(url).hostname.replace(/^www\./, "") === host,
        ),
        host,
      );
    assert(
      await page
        .locator(".marquee-group")
        .nth(1)
        .evaluate(
          (group) =>
            !group.inert &&
            group.getAttribute("aria-hidden") === "true" &&
            [...group.querySelectorAll("a")].every(
              (link) => link.tabIndex === -1,
            ),
        ),
      "Loop duplicates support pointer interaction without duplicate tab stops or announcements",
    );
    await page.locator("#freelance").scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
    const track = page.locator(".marquee-track");
    const before = await track.evaluate(
      (element) => getComputedStyle(element).transform,
    );
    await page.waitForTimeout(250);
    assert.notEqual(
      await track.evaluate((element) => getComputedStyle(element).transform),
      before,
      "Marquee moves",
    );
    await page.getByRole("button", { name: "Pause showcase" }).click();
    const stopped = await track.evaluate(
      (element) => getComputedStyle(element).transform,
    );
    await page.waitForTimeout(200);
    assert.equal(
      await track.evaluate((element) => getComputedStyle(element).transform),
      stopped,
      "Pause stops the marquee",
    );
    await page.getByRole("button", { name: "Play showcase" }).click();
    await page.mouse.move(5, 5);
    await page.waitForTimeout(150);
    assert.notEqual(
      await track.evaluate((element) => getComputedStyle(element).transform),
      stopped,
      "Play resumes the marquee",
    );
    await freelance.locator(".freelance-card").first().hover({ force: true });
    assert.equal(
      await track.evaluate(
        (element) => getComputedStyle(element).animationPlayState,
      ),
      "paused",
      "Hover pauses",
    );
    await page.waitForTimeout(300);
    assert.equal(
      await freelance
        .locator(".freelance-logo")
        .first()
        .evaluate((image) => getComputedStyle(image).filter),
      "none",
      "Hovered freelance logo shows original color",
    );
    assert.notEqual(
      await freelance
        .locator(".freelance-logo")
        .nth(1)
        .evaluate((image) => getComputedStyle(image).filter),
      "none",
      "Other freelance logos stay muted",
    );
    const duplicate = page.locator(".marquee-group").nth(1);
    await page.mouse.move(5, 5);
    await track.evaluate((element) => {
      const animation = element.getAnimations()[0];
      animation.pause();
      animation.currentTime = animation.effect.getTiming().duration / 2;
    });
    for (const logo of await duplicate.locator("a").all()) {
      await logo.hover();
      assert(
        await logo.evaluate((element) => element.matches(":hover")),
        "Visible repeated logo receives pointer hover",
      );
      await page.waitForTimeout(300);
      assert.equal(
        await logo
          .locator("img")
          .evaluate((image) => getComputedStyle(image).filter),
        "none",
        "Repeated logo restores its original colors on hover",
      );
    }
    const link = duplicate.locator("a").nth(4);
    await page
      .context()
      .route("https://www.enfes.com.au/**", (route) =>
        route.fulfill({ status: 200, body: "Link target verified" }),
      );
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(
      new URL(popup.url()).hostname,
      "www.enfes.com.au",
      "Repeated logo opens its project link",
    );
    await popup.close();
    await page.bringToFront();
    await track.evaluate((element) => {
      const animation = element.getAnimations()[0];
      animation.currentTime = 0;
      animation.play();
    });
    await page.locator("#showcase-toggle").focus();
    await page.mouse.move(5, 5);
    await page.keyboard.press("Tab");
    await freelance.locator(".freelance-card").last().focus();
    assert.equal(
      await track.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
      "none",
      "Keyboard focus stops automatic travel",
    );
    await page.waitForTimeout(300);
    assert.equal(
      await freelance
        .locator(".freelance-logo")
        .last()
        .evaluate((image) => getComputedStyle(image).filter),
      "none",
      "Focused freelance logo shows original color",
    );
    await page.locator("#showcase-toggle").focus();
    assert.equal(
      await page
        .locator(".marquee-viewport")
        .evaluate((viewport) => viewport.scrollLeft),
      0,
      "Leaving keyboard navigation restores the continuous loop",
    );
    await catering.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: "qa-catering.png" });
    await stores.scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-themes.png" });
    await page.locator("#freelance").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-freelance.png" });
    await page.locator(".company-strip").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-teams-desktop.png" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".company-strip").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-teams-mobile.png" });
    const teamPositions = await page
      .locator(".company-logos a")
      .evaluateAll((links) =>
        links.map((link) => {
          const rect = link.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width };
        }),
      );
    assert(
      teamPositions.every(
        (team) => Math.abs(team.width - teamPositions[0].width) < 1,
      ),
      "All mobile teams have equal space",
    );
    assert(
      teamPositions
        .slice(0, 3)
        .every((team) => Math.abs(team.y - teamPositions[0].y) < 1) &&
        Math.abs(teamPositions[3].y - teamPositions[4].y) < 1 &&
        teamPositions[3].y > teamPositions[0].y,
      "Mobile teams form balanced rows of three and two",
    );
    for (const width of [320, 600, 768]) {
      await page.setViewportSize({ width, height: 844 });
      assert(
        await page.locator(".company-logos a").evaluateAll((links) =>
          links.every((link) => {
            const r = link.getBoundingClientRect();
            return [...link.children].every((child) => {
              const c = child.getBoundingClientRect();
              return c.left >= r.left - 1 && c.right <= r.right + 1;
            });
          }),
        ),
        `Team logos and names fit at ${width}px`,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `No page overflow at ${width}px`,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => window.landscapeTest.lastDraw !== null);
    await page.locator("#experience").scrollIntoViewIfNeeded();
    const resizeTime = await page.evaluate(() => performance.now());
    await page.waitForFunction(
      (time) => window.landscapeTest.lastDraw?.time > time,
      resizeTime,
    );
    const landscapeBefore = await page.evaluate(
      () => window.landscapeTest.lastDraw.left,
    );
    await page.waitForTimeout(250);
    assert(
      (await page.evaluate(() => window.landscapeTest.lastDraw.left)) <
        landscapeBefore,
      "Landscape keeps moving after the hero on mobile",
    );
    await page.screenshot({ path: "qa-background-content.png" });
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa-background-footer.png" });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Mobile has no horizontal page overflow",
    );
    await page.locator("#showcase-toggle").blur();
    await page.screenshot({ path: "qa-showcase-mobile.png", fullPage: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await track.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
      "none",
      "Reduced motion disables autoplay",
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Play showcase" })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.getByRole("button", { name: "Play showcase" }).click();
    assert.equal(
      await track.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
      "project-drift",
      "Explicit play works with reduced motion",
    );
    await page.getByRole("button", { name: "Pause showcase" }).click();
    assert.equal(
      await track.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
      "none",
      "Pausing restores the static reduced-motion layout",
    );
    const landscapeX = await page.evaluate(
      () => window.landscapeTest.lastDraw.left,
    );
    await page.waitForTimeout(150);
    assert.equal(
      await page.evaluate(() => window.landscapeTest.lastDraw.left),
      landscapeX,
      "Background still respects reduced motion",
    );
    assert.deepEqual(errors, [], "No browser errors or broken images");
    console.log(
      JSON.stringify({
        result: "PASS",
        themes: 7,
        freelanceProjects: 6,
        checks:
          "Feedwell preview and links; scaling copy; actual theme images; all freelance links; loop copy hover and links; clone accessibility; marquee movement, pause, resume, hover, keyboard and reduced motion; equal mobile team placement at 320-768px; background movement below hero",
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
