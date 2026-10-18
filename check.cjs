const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    const landscape = page.frames().find(frame => frame.url().includes('/landscape/'));
    const ready = frame => frame.waitForFunction(() => tiles.has(Math.floor(MEM.cursx / TILE)) && tiles.has(Math.ceil((MEM.cursx + MEM.windx) / TILE)));
    await ready(landscape);
    assert.equal(page.workers().length, 1, 'One dedicated worker runs the generator');
    const worker = page.workers()[0];
    assert(await worker.evaluate(() => typeof window === 'undefined' && typeof document === 'undefined' && typeof chunkloader === 'function'), 'Generation is isolated from the page');
    assert(await landscape.evaluate(() => typeof chunkloader === 'undefined' && !document.querySelector('svg,polyline')), 'No SVG geometry is rebuilt in the page');
    const initialSeed = await landscape.evaluate(() => seed);
    const initialAhead = await worker.evaluate(() => new Promise(resolve => {
      function check() {
        const ahead = MEM.xmax - MEM.cursx - MEM.windx;
        if (ahead >= 8192) resolve(ahead); else setTimeout(check, 10);
      }
      check();
    }));
    assert(initialAhead >= 8192, 'A large stretch of terrain is generated ahead');
    const frameTiming = await landscape.evaluate(() => new Promise(resolve => {
      const samples = [];
      let start, previous, x;
      function sample(time) {
        if (!start) { start = time; previous = time; x = MEM.cursx; }
        else { samples.push(time - previous); previous = time; }
        if (time - start < 1500) { requestAnimationFrame(sample); return; }
        samples.sort((a,b) => a-b);
        resolve({ medianMs: samples[Math.floor(samples.length / 2)], p95Ms: samples[Math.floor(samples.length * .95)], fps: samples.length * 1000 / (time - start), pixelsPerSecond: (MEM.cursx - x) * scale / (canvas.width / innerWidth) * 1000 / (time - start) });
      }
      requestAnimationFrame(sample);
    }));
    assert(frameTiming.fps > 45 && frameTiming.medianMs < 25, 'Animation runs at the browser refresh rate');
    assert(frameTiming.pixelsPerSecond > 48 && frameTiming.pixelsPerSecond < 60, 'Travel is visibly faster and independent of frame rate');
    await page.getByRole('button', { name: 'Pause landscape animation' }).click();
    const stopped = await landscape.evaluate(() => MEM.cursx);
    await page.waitForTimeout(200);
    assert.equal(await landscape.evaluate(() => MEM.cursx), stopped, 'Pause stops scrolling');
    await page.getByRole('button', { name: 'Play landscape animation' }).click();
    for (let i = 0; i < 12; i++) {
      await landscape.evaluate(() => { MEM.cursx = (Math.floor(MEM.cursx / TILE) + 1) * TILE + 10; });
      await ready(landscape);
    }
    const terrain = await worker.evaluate(() => ({ cursor: MEM.cursx, xmax: MEM.xmax, chunks: MEM.chunks.length, stale: MEM.chunks.filter(c => c.x <= MEM.cursx - 2048).length }));
    assert(terrain.cursor > 12000 && terrain.xmax > terrain.cursor + 4096, 'Worker refills the terrain buffer');
    assert.equal(terrain.stale, 0, 'Old geometry is discarded');
    assert(await landscape.evaluate(() => tiles.size <= Math.ceil(MEM.windx / TILE) + 3 && [...tiles.keys()].every(index => index >= Math.floor(MEM.cursx / TILE))), 'Bitmap cache stays bounded and old bitmaps are released');
    assert(await landscape.evaluate(() => context.getImageData(0,0,canvas.width,canvas.height).data.some((value,index) => index % 4 === 3 && value > 0)), 'Visible canvas contains terrain');
    await page.reload({ waitUntil: 'networkidle' });
    const reloaded = page.frames().find(frame => frame.url().includes('/landscape/'));
    await ready(reloaded);
    assert.notEqual(await reloaded.evaluate(() => seed), initialSeed, 'Reload uses a fresh seed');
    await page.evaluate(() => document.querySelectorAll('img').forEach(image => image.loading = 'eager'));
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    assert.equal(await page.locator('.company-logos a').count(), 5, 'Five employer brands are present');
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'qa-work.png' });
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'qa-experience.png' });
    const projectWasOpen = await page.locator('.project').nth(1).getAttribute('open') !== null;
    await page.locator('.project').nth(1).locator('summary').click();
    assert.notEqual(await page.locator('.project').nth(1).getAttribute('open') !== null, projectWasOpen, 'Project details toggle');
    const pdf = await page.request.get('http://127.0.0.1:4173/resume.pdf');
    assert.equal(pdf.status(), 200);
    assert((await pdf.body()).subarray(0,4).toString() === '%PDF');
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(reloaded);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile layout has no horizontal overflow');
    await page.evaluate(() => scrollTo(0,0));
    await page.screenshot({ path: 'qa-mobile.png', fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedX = await reloaded.evaluate(() => MEM.cursx);
    await page.waitForTimeout(200);
    assert.equal(await reloaded.evaluate(() => MEM.cursx), reducedX, 'Reduced motion stops travel');
    assert.equal(await page.getByRole('button', { name: 'Play landscape animation' }).getAttribute('aria-pressed'), 'true');
    assert.deepEqual(errors, [], 'No browser errors or broken assets');
    console.log(JSON.stringify({ result: 'PASS', frameTiming, generatedAhead: initialAhead, terrain, checks: 'worker isolation; large pre-generation; faster smooth scrolling; bounded bitmap cache; pause/resume; random reload; resize; reduced motion; company assets; mobile; résumé', errors }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
