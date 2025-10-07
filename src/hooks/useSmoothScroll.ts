"use client";

import { useEffect, useRef } from "react";

// Type definition for Lenis
interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

interface Lenis {
  raf(time: number): void;
  scrollTo(target: string | number | HTMLElement, options?: any): void;
  destroy(): void;
}

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamic import to avoid SSR issues
    import("lenis").then(({ default: Lenis }) => {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      } as LenisOptions);

      // Expose Lenis instance globally
      window.lenis = lenisRef.current;

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    });

    return () => {
      lenisRef.current?.destroy();
      window.lenis = undefined;
    };
  }, []);

  return lenisRef;
}
