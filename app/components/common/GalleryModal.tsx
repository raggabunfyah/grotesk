'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useGalleryStore } from "@stores";

const GalleryModal = () => {
  const { isOpen, title, description, images, closeGallery } = useGalleryStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const total = images.length;

  const currentImage = useMemo(() => {
    if (total === 0) return "";
    return images[currentIndex] ?? images[0];
  }, [images, currentIndex, total]);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(0);
  }, [isOpen, images]);

  useEffect(() => {
    if (!isOpen || images.length === 0) return;

    const preloaders = images.map((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().catch(() => undefined);
      }
      return img;
    });

    preloadedImagesRef.current = preloaders;

    return () => {
      preloadedImagesRef.current = [];
    };
  }, [isOpen, images]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (total <= 1) return;
    setSlideDirection("next");
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevImage = () => {
    if (total <= 1) return;
    setSlideDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
      onClick={closeGallery}
    >
      <div
        className="relative w-[92vw] max-w-[920px] rounded-2xl border border-black/65 bg-black/65 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-3 text-white"
          onClick={closeGallery}
        >
          x
        </button>

        <p
          className="mb-2 mt-1 text-2xl text-white"
          style={{ fontFamily: "soria-font, serif", fontWeight: 700 }}
        >
          {title}
        </p>

        <div className="relative overflow-hidden rounded-lg">
          {total > 1 ? (
            <button
              type="button"
              aria-label="Önceki fotoğraf"
              onClick={prevImage}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white px-3 py-2 text-white"
            >
              ←
            </button>
          ) : null}

          {currentImage ? (
            <img
              key={`${currentImage}-${currentIndex}`}
              src={currentImage}
              alt={`${title} ${currentIndex + 1}`}
              className={`block max-h-[58vh] w-full rounded-lg object-contain ${slideDirection === "next" ? "slide-in-next" : "slide-in-prev"
                }`}
            />
          ) : null}

          {total > 1 ? (
            <button
              type="button"
              aria-label="Sonraki fotoğraf"
              onClick={nextImage}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white px-3 py-2 text-white"
            >
              →
            </button>
          ) : null}
        </div>

        {description ? (
          <p className="mt-3 max-w-3xl text-sm text-white/85">{description}</p>
        ) : null}
        {total > 1 ? (
          <p className="mt-1 text-center text-xs text-white/80">
            {currentIndex + 1} / {total}
          </p>
        ) : null}
      </div>
      <style jsx>{`
        .slide-in-next {
          animation: slideInNext 320ms ease;
        }
        .slide-in-prev {
          animation: slideInPrev 320ms ease;
        }
        @keyframes slideInNext {
          from {
            opacity: 0.45;
            transform: translateX(36px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInPrev {
          from {
            opacity: 0.45;
            transform: translateX(-36px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryModal;
