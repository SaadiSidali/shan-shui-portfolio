// Generate terrain in the worker; draw only visible, already-rasterized tiles.
const TILE = 1024;
const MEM = { cursx: 0, windx: 0, windy: 800 };
const seed = crypto.getRandomValues(new Uint32Array(1))[0];
const canvas = document.querySelector('#landscape-canvas');
const context = canvas.getContext('2d');
const tiles = new Map();
let scale;
let revision = 0;
let requestedTile = 0;
let landscapePaused = matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden || parent.document.hidden;
let previousTime = 0;
let worker;
window.setLandscapePaused = value => { landscapePaused = value; previousTime = 0; };

function sizeCanvas() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  scale = canvas.height / (MEM.windy / 1.142);
  MEM.windx = canvas.width / scale;
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const first = Math.floor(MEM.cursx / TILE);
  const last = Math.ceil((MEM.cursx + MEM.windx) / TILE) - 1;
  for (let index = first; index <= last; index++) {
    const bitmap = tiles.get(index);
    if (!bitmap) continue;
    const left = (index * TILE - MEM.cursx) * scale;
    const right = ((index + 1) * TILE - MEM.cursx) * scale;
    context.drawImage(bitmap, left, 0, right - left, MEM.windy * scale);
  }
  for (const [index, bitmap] of tiles) {
    if (index < first || index > last + 2) { bitmap.close(); tiles.delete(index); }
  }
}

function stopWorker(error) {
  console.error('Landscape worker failed:', error);
  worker?.terminate();
  landscapePaused = true;
}

sizeCanvas();
try {
  worker = new Worker('landscape-worker.js');
  worker.onmessage = async ({ data }) => {
    if (data.type === 'error') { stopWorker(data.message); return; }
    if (data.type !== 'tile' || data.revision !== revision) return;
    const url = URL.createObjectURL(data.svg);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const bitmap = await createImageBitmap(image);
      if (data.revision !== revision || data.index < Math.floor(MEM.cursx / TILE)) { bitmap.close(); return; }
      tiles.get(data.index)?.close();
      tiles.set(data.index, bitmap);
      draw();
    } catch (error) {
      stopWorker(error);
    } finally {
      URL.revokeObjectURL(url);
    }
  };
  worker.onerror = stopWorker;
  worker.onmessageerror = stopWorker;
  worker.postMessage({ type: 'init', seed, width: MEM.windx, scale, revision });
} catch (error) {
  stopWorker(error);
}

function animate(time) {
  requestAnimationFrame(animate);
  if (landscapePaused || document.hidden || !tiles.size) { previousTime = 0; return; }
  if (!previousTime) previousTime = time;
  const delta = Math.min(time - previousTime, 80);
  previousTime = time;
  let end = Math.floor(MEM.cursx / TILE);
  while (tiles.has(end)) end++;
  // A slow decode can pause travel at the buffer edge, never expose a blank tile.
  const available = Math.max(MEM.cursx, end * TILE - MEM.windx);
  MEM.cursx = Math.min(MEM.cursx + delta * 0.054 * canvas.width / innerWidth / scale, available);
  const first = Math.floor(MEM.cursx / TILE);
  if (first !== requestedTile) {
    requestedTile = first;
    worker.postMessage({ type: 'view', x: MEM.cursx });
  }
  draw();
}

requestAnimationFrame(animate);
addEventListener('resize', () => {
  sizeCanvas();
  revision++;
  for (const bitmap of tiles.values()) bitmap.close();
  tiles.clear();
  requestedTile = Math.floor(MEM.cursx / TILE);
  worker?.postMessage({ type: 'resize', x: MEM.cursx, width: MEM.windx, scale, revision });
});
