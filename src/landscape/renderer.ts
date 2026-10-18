import type { LandscapeRequest, LandscapeResponse } from "./messages";
import { assetUrl } from "../paths";

const TILE = 1024;
const WORLD_HEIGHT = 800;
const SPEED = 54;

export function createLandscape(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas rendering is unavailable");
  const tiles = new Map<number, ImageBitmap>();
  let x = 0;
  let width = 0;
  let scale = 1;
  let revision = 0;
  let requestedTile = 0;
  let paused = true;
  let disposed = false;
  let previousTime = 0;
  let animationFrame = 0;
  let worker: Worker | undefined;

  function sizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
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
    for (const [index, bitmap] of tiles) {
      if (index < first || index > last + 2) {
        bitmap.close();
        tiles.delete(index);
      }
    }
  }

  function stopWorker(error: unknown) {
    if (disposed) return;
    console.error("Landscape worker failed:", error);
    worker?.terminate();
    paused = true;
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
    if (disposed) return;
    animationFrame = requestAnimationFrame(animate);
    if (paused || document.hidden || !tiles.size) {
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
    x = Math.min(
      x + (((delta * SPEED) / 1000) * canvas.width) / innerWidth / scale,
      available,
    );
    const first = Math.floor(x / TILE);
    if (first !== requestedTile) {
      requestedTile = first;
      worker?.postMessage({ type: "view", x } satisfies LandscapeRequest);
    }
    draw();
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
    setPaused(value: boolean) {
      paused = value;
      resetClock();
    },
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
