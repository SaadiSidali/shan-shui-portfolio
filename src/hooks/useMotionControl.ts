import { useEffect, useState } from "react";

export function useMotionControl() {
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) =>
      setPaused(event.matches);
    preference.addEventListener("change", handleChange);
    return () => preference.removeEventListener("change", handleChange);
  }, []);

  return [paused, setPaused] as const;
}
