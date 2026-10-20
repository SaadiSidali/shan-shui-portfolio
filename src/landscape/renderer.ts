import type { LandscapeRequest, LandscapeResponse } from "./messages";
import { assetUrl } from "../paths";

const TILE = 1024;
const WORLD_HEIGHT = 800;
const SPEED = 54;

export function createLandscape(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas rendering is unavailable");
  const tiles = new Map<number, ImageBitmap>();
  const craneImages = ["upper", "raised", "gliding", "lower"].map((pose) => {
    const image = new Image();
    image.decoding = "async";
    image.src = assetUrl(`assets/crane-${pose}.png`);
    return image;
  });
  let crane:
    | { image: HTMLImageElement; x: number; y: number; size: number }
    | undefined;
  let nextCraneX = 0;
  let pixelRatio = 1;
  let x = 0;
  let width = 0;
  let scale = 1;
  let revision = 0;
  let requestedTile = 0;
  let failed = false;
  let ready = false;
  let disposed = false;
  let previousTime = 0;
  let animationFrame = 0;
  let worker: Worker | undefined;

  function sizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    pixelRatio = canvas.width / innerWidth;
    scale = canvas.height / (WORLD_HEIGHT / 1.142);
    width = canvas.width / scale;
  }

  function draw() {
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const first = Math.floor(x / TILE);
    const last = Math.ceil((x + width) / TILE) - 1;
    for (let index = first; index <= last; index++) {
      const bitmap = tiles.get(index);
      if (!bitmap) continue;
      const left = (index * TILE - x) * scale;
      const right = ((index + 1) * TILE - x) * scale;
      context.drawImage(bitmap, left, 0, right - left, WORLD_HEIGHT * scale);
    }
    if (crane) {
      const left = (crane.x - x) * scale;
      const size = crane.size * pixelRatio;
      if (left < canvas.width && left + size > 0) {
        context.save();
        context.globalAlpha = 0.85;
        context.filter = "grayscale(1) brightness(0.72)";
        context.drawImage(
          crane.image,
          left,
          canvas.height * crane.y,
          size,
          (size * crane.image.naturalHeight) / crane.image.naturalWidth,
        );
        context.restore();
      }
    }
    for (const [index, bitmap] of tiles) {
      if (index < first || index > last + 2) {
        bitmap.close();
        tiles.delete(index);
      }
    }
  }

  function stopWorker(error: unknown) {
    if (disposed || failed) return;
    failed = true;
    console.error("Landscape worker failed:", error);
    worker?.terminate();
    canvas.dispatchEvent(new Event("landscape-error"));
  }

  sizeCanvas();
  try {
    worker = new Worker(new URL("./landscape.worker.ts", import.meta.url));
    worker.onmessage = async ({ data }: MessageEvent<LandscapeResponse>) => {
      if (disposed) return;
      if (data.type === "error") {
        stopWorker(data.message);
        return;
      }
      if (data.revision !== revision) return;
      const url = URL.createObjectURL(data.svg);
      try {
        const image = new Image();
        image.src = url;
        await image.decode();
        const bitmap = await createImageBitmap(image);
        if (
          disposed ||
          data.revision !== revision ||
          data.index < Math.floor(x / TILE)
        ) {
          bitmap.close();
          return;
        }
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
    worker.postMessage({
      type: "init",
      seed: crypto.getRandomValues(new Uint32Array(1))[0],
      generatorUrl: assetUrl("landscape/generator.js"),
      width,
      scale,
      revision,
    } satisfies LandscapeRequest);
  } catch (error) {
    stopWorker(error);
  }

  function animate(time: number) {
    if (disposed || failed) return;
    animationFrame = requestAnimationFrame(animate);
    if (document.hidden || !tiles.size) {
      previousTime = 0;
      return;
    }
    if (!previousTime) previousTime = time;
    const delta = Math.min(time - previousTime, 80);
    previousTime = time;
    let end = Math.floor(x / TILE);
    while (tiles.has(end)) end++;
    // A slow decode can pause travel at the buffer edge, never expose a blank tile.
    const available = Math.max(x, end * TILE - width);
    const previousX = x;
    x = Math.min(
      x + (((delta * SPEED) / 1000) * canvas.width) / innerWidth / scale,
      available,
    );
    if (crane && (crane.x - x) * scale + crane.size * pixelRatio < 0) {
      crane = undefined;
      // Leave 18 to 44 seconds of empty sky after each bird passes.
      nextCraneX = x + ((18 + Math.random() * 26) * SPEED * pixelRatio) / scale;
    }
    if (!crane && x >= nextCraneX) {
      const image = craneImages[Math.floor(Math.random() * craneImages.length)];
      if (image.complete && image.naturalWidth) {
        crane = {
          image,
          x: x + width * (nextCraneX === 0 ? 0.65 + Math.random() * 0.25 : 1),
          y: 0.04 + Math.random() * 0.09,
          size: Math.min(160, Math.max(82, innerWidth * 0.1)),
        };
      }
    }
    const first = Math.floor(x / TILE);
    if (first !== requestedTile) {
      requestedTile = first;
      worker?.postMessage({ type: "view", x } satisfies LandscapeRequest);
    }
    draw();
    if (!ready && x > previousX) {
      ready = true;
      canvas.dispatchEvent(new Event("landscape-ready"));
    }
  }

  function resize() {
    sizeCanvas();
    revision++;
    for (const bitmap of tiles.values()) bitmap.close();
    tiles.clear();
    requestedTile = Math.floor(x / TILE);
    worker?.postMessage({
      type: "resize",
      x,
      width,
      scale,
      revision,
    } satisfies LandscapeRequest);
  }

  function resetClock() {
    previousTime = 0;
  }

  animationFrame = requestAnimationFrame(animate);
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", resetClock);

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      worker?.terminate();
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", resetClock);
      for (const bitmap of tiles.values()) bitmap.close();
      tiles.clear();
    },
  };
}
