import { useEffect, useRef } from "react";
import { useMotionControl } from "../hooks/useMotionControl";
import { createLandscape } from "../landscape/renderer";

export function Landscape() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createLandscape> | null>(null);
  const [paused, setPaused] = useMotionControl();

  useEffect(() => {
    if (!canvas.current) return;
    renderer.current = createLandscape(canvas.current);
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    renderer.current?.setPaused(paused);
  }, [paused]);

  return (
    <>
      <div className="landscape" aria-hidden="true">
        <canvas id="landscape-canvas" ref={canvas} />
      </div>
      <div className={`landscape-controls${paused ? " is-paused" : ""}`}>
        <span className="landscape-label">
          <span className="motion-dot" /> A LANDSCAPE, NEVER THE SAME
        </span>
        <button
          id="motion-toggle"
          type="button"
          aria-label={
            paused ? "Play landscape animation" : "Pause landscape animation"
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          <span className="motion-icon" aria-hidden="true">
            {paused ? "▷" : "Ⅱ"}
          </span>
          <span className="motion-text">
            {paused ? "Play" : "Pause"} landscape
          </span>
        </button>
      </div>
    </>
  );
}
