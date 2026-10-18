importScripts('generator.js');

const TILE = 1024;
const AHEAD = 8192;
let initialized = false;
let revision = 0;
let pixelScale = 1;
const sent = new Set();

function generateAhead(x) {
  if (x === 0 || MEM.xmax < x + MEM.windx + AHEAD / 2) chunkloader(x, x + MEM.windx + AHEAD + 2048);
}

function sendView(x) {
  MEM.cursx = x;
  const first = Math.floor(x / TILE);
  const last = Math.ceil((x + MEM.windx) / TILE);
  chunkloader(x, (last + 1) * TILE + 2048);
  for (let index = first; index <= last; index++) {
    if (sent.has(index)) continue;
    const start = index * TILE;
    // Distant mountains extend up to 1,500 units beyond their origin.
    const markup = MEM.chunks.filter(chunk => chunk.x > start - 2048 && chunk.x < start + TILE + 2048).map(chunk => chunk.canv).join('');
    const svg = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="' + Math.ceil(TILE * pixelScale) + '" height="' + Math.ceil(800 * pixelScale) + '" viewBox="' + start + ' 0 ' + TILE + ' 800">', markup, '</svg>'], { type: 'image/svg+xml' });
    postMessage({ type: 'tile', index, revision, svg });
    sent.add(index);
  }
  MEM.chunks = MEM.chunks.filter(chunk => chunk.x > x - 2048);
  for (const key of Object.keys(MEM.planmtx)) {
    if (Number(key) * 5 < x - 2048) delete MEM.planmtx[key];
  }
  for (const index of sent) if (index < first) sent.delete(index);
  setTimeout(() => {
    try { generateAhead(x); } catch (error) { postMessage({ type: 'error', message: error.message }); }
  }, 0);
}

onmessage = ({ data }) => {
  try {
    if (data.type === 'init' || data.type === 'resize') {
      if (!Number.isFinite(data.width) || data.width <= 0 || data.width > 6000 || !Number.isFinite(data.scale) || data.scale <= 0 || data.scale > 8 || !Number.isInteger(data.revision)) throw new Error('Invalid landscape dimensions');
      if (data.type === 'init') {
        if (initialized || !Number.isInteger(data.seed) || data.seed < 0 || data.seed > 0xffffffff) throw new Error('Invalid landscape initialization');
        Math.seed(data.seed);
        initialized = true;
      } else if (!initialized) throw new Error('Landscape not initialized');
      MEM.windx = data.width;
      pixelScale = data.scale;
      revision = data.revision;
      sent.clear();
    } else if (data.type !== 'view' || !initialized) throw new Error('Invalid landscape request');
    const x = data.type === 'init' ? 0 : data.x;
    if (!Number.isFinite(x) || x < MEM.cursx || x > MEM.xmax) throw new Error('Invalid landscape position');
    sendView(x);
  } catch (error) {
    postMessage({ type: 'error', message: error.message });
  }
};
