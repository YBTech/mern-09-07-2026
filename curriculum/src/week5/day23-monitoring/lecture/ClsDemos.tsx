// Layout-shift demos. Each demo measures how far its "Buy now" button gets pushed around: that
// movement is exactly what CLS adds up. (The real CLS number is a share of the whole window, so it
// would be tiny for a box this small; pixels are clearer on a projector.)
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Wraps a demo and totals how far its Buy button moves while the page settles. */
function ShiftFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(0);
  useEffect(() => {
    let frame = 0;
    let last: number | null = null;
    const started = performance.now();
    const watch = () => {
      const top = ref.current?.querySelector("button")?.getBoundingClientRect().top;
      if (top !== undefined) {
        if (last !== null && top !== last) setMoved((m) => m + Math.abs(top - last!));
        last = top;
      }
      if (performance.now() - started < 8000) frame = requestAnimationFrame(watch);
    };
    frame = requestAnimationFrame(watch);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div ref={ref}>
      {children}
      <p className={`fe-cls ${moved === 0 ? "ok" : "bad"}`}>
        Buy button moved: {Math.round(moved)}px <small>(this is what CLS measures)</small>
      </p>
    </div>
  );
}

/** true once `ms` have passed: stands in for "the data / image arrived late". */
function useAfter(ms: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return ready;
}

function Products() {
  return (
    <>
      <ul className="fe-products">
        <li>Mechanical keyboard · $89</li>
        <li>USB-C cable · $12</li>
        <li>Monitor stand · $35</li>
      </ul>
      <button>Buy now</button>
    </>
  );
}

// ───────────────────────── a banner that arrives late ─────────────────────────

const BANNER = <div className="fe-banner">Summer sale: 20% off everything</div>;

export function ShiftyBanner() {
  const ready = useAfter(1500);
  return (
    <ShiftFrame>
      {ready && BANNER}
      <Products />
    </ShiftFrame>
  );
}

export function StableBanner() {
  const ready = useAfter(1500);
  return (
    <ShiftFrame>
      <div className="fe-banner-slot">{ready ? BANNER : <div className="fe-skeleton" />}</div>
      <Products />
    </ShiftFrame>
  );
}

// ───────────────────────── an image with no size ─────────────────────────

const HERO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160" viewBox="0 0 400 160"><rect width="400" height="160" fill="#cfe0ff"/><text x="200" y="88" font-size="22" text-anchor="middle" fill="#1c1c1c" font-family="sans-serif">Hero image</text></svg>`,
  );

export function ShiftyImage() {
  const ready = useAfter(1200); // the image takes a moment to download
  return (
    <ShiftFrame>
      <img src={ready ? HERO : undefined} alt="Summer sale" style={{ width: "100%" }} />
      <Products />
    </ShiftFrame>
  );
}

export function StableImage() {
  const ready = useAfter(1200);
  return (
    <ShiftFrame>
      <img src={ready ? HERO : undefined} alt="Summer sale" style={{ width: "100%", aspectRatio: "5 / 2", display: "block" }} />
      <Products />
    </ShiftFrame>
  );
}
