const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  "http://127.0.0.1:4173/shan-shui-portfolio/";

async function instrumentLandscape(page) {
  await page.addInitScript(() => {
    const state = (window.landscapeTest = {
      workers: 0,
      terminated: 0,
      workerUrl: "",
      requests: [],
      decoded: 0,
      released: 0,
      drawCount: 0,
      lastDraw: null,
      lastCraneDraw: null,
      craneVisible: false,
      readyEvents: 0,
      readyAt: 0,
    });
    document.addEventListener(
      "landscape-ready",
      () => {
        state.readyEvents++;
        state.readyAt = performance.now();
      },
      true,
    );
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url, options) {
        super(url, options);
        state.workers++;
        state.workerUrl = String(url);
      }
      postMessage(message, ...args) {
        state.requests.push(message);
        super.postMessage(message, ...args);
      }
      terminate() {
        state.terminated++;
        super.terminate();
      }
    };
    const createBitmap = window.createImageBitmap;
    window.createImageBitmap = async (...args) => {
      const bitmap = await createBitmap(...args);
      state.decoded++;
      return bitmap;
    };
    const close = ImageBitmap.prototype.close;
    ImageBitmap.prototype.close = function () {
      state.released++;
      return close.call(this);
    };
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    const ids = new WeakMap();
    let nextId = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      state.craneVisible = false;
      return clear.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.drawImage = function (
      image,
      left,
      ...args
    ) {
      if (!ids.has(image)) ids.set(image, nextId++);
      if (image instanceof ImageBitmap) {
        state.drawCount++;
        state.lastDraw = { id: ids.get(image), left, time: performance.now() };
      } else if (
        image instanceof HTMLImageElement &&
        image.src.includes("/crane-")
      ) {
        state.craneVisible = true;
        state.lastCraneDraw = {
          src: image.src,
          left,
          top: args[0],
          width: args[1],
          height: args[2],
          terrainLeft: state.lastDraw?.left,
          time: performance.now(),
        };
      }
      return draw.call(this, image, left, ...args);
    };
  });
}

module.exports = { baseURL, instrumentLandscape };
