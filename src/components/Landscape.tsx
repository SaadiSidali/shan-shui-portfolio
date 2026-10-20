import { useEffect, useRef } from "react";
import { createLandscape } from "../landscape/renderer";

export function Landscape({ onReady }: { onReady: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const reveal = () => {
      clearTimeout(timeout);
      onReady();
    };
    // A failed or stalled generator must not hide the portfolio indefinitely.
    const timeout = window.setTimeout(reveal, 8000);
    element.addEventListener("landscape-ready", reveal, { once: true });
    element.addEventListener("landscape-error", reveal, { once: true });
    const renderer = createLandscape(element);
    return () => {
      clearTimeout(timeout);
      element.removeEventListener("landscape-ready", reveal);
      element.removeEventListener("landscape-error", reveal);
      renderer.dispose();
    };
  }, [onReady]);

  return (
    <div className="landscape" aria-hidden="true">
      <canvas id="landscape-canvas" ref={canvas} />
    </div>
  );
}
