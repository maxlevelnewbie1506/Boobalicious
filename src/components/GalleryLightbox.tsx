"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export function GalleryLightbox({
  images,
  altBase,
}: {
  images: GalleryImage[];
  altBase: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback(
    (delta: number) => {
      if (openIndex === null) return;
      const next = (openIndex + delta + images.length) % images.length;
      setOpenIndex(next);
      resetView();
    },
    [openIndex, images.length, resetView]
  );

  useEffect(() => {
    if (openIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowLeft") goTo(-1);
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, goTo]);

  function toggleZoom() {
    setZoom((z) => (z === 1 ? 2.2 : 1));
    setPan({ x: 0, y: 0 });
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.0025;
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    });
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (zoom === 1) return;
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  const active = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => {
              setOpenIndex(i);
              resetView();
            }}
            className="group relative aspect-square overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--surface)] focus:outline-none focus-visible:border-[var(--tape)]"
          >
            <Image
              src={img.image_url}
              alt={img.caption ?? altBase}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-left font-mono text-[10px] text-[var(--paper)]">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 font-mono text-2xl leading-none text-[var(--paper)] transition-colors hover:text-[var(--tape)]"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 font-mono text-xl text-[var(--paper)] transition-colors hover:text-[var(--tape)] sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 font-mono text-xl text-[var(--paper)] transition-colors hover:text-[var(--tape)] sm:right-6"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-[90vw] max-w-4xl overflow-hidden"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div
              onClick={toggleZoom}
              className="relative h-full w-full"
              style={{
                cursor: zoom === 1 ? "zoom-in" : isDragging ? "grabbing" : "grab",
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              <Image
                src={active.image_url}
                alt={active.caption ?? altBase}
                fill
                className="object-contain select-none"
                draggable={false}
                sizes="90vw"
                priority
              />
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
            {active.caption && (
              <p className="font-mono text-xs text-[var(--paper)]">{active.caption}</p>
            )}
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
              {images.length > 1 && `${(openIndex ?? 0) + 1} / ${images.length} — `}
              Click to zoom, scroll to fine-tune, drag to pan
            </p>
          </div>
        </div>
      )}
    </>
  );
}
