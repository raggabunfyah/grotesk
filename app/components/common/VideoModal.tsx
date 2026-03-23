'use client';

import { useMemo } from "react";
import { useMusicStore, useVideoStore } from "@stores";

const toEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  try {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    if (parsed.hostname.includes("youtu.be")) {
      const shortId = parsed.pathname.replace("/", "");
      if (shortId) return `https://www.youtube.com/embed/${shortId}?autoplay=1&rel=0`;
    }
  } catch {
    return url;
  }
  return url;
};

const VideoModal = () => {
  const { isOpen, title, url, sessionId, closeVideo } = useVideoStore();
  const requestResume = useMusicStore((state) => state.requestResume);
  const embedUrl = useMemo(() => toEmbedUrl(url), [url]);

  const closeAndResume = () => {
    closeVideo();
    requestResume();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
      onClick={closeAndResume}
    >
      <div
        className="relative w-[94vw] max-w-[980px] rounded-2xl border border-black/70 bg-black/75 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.8)] backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="absolute right-4 top-3 text-white" onClick={closeAndResume}>
          x
        </button>
        <p className="mb-2 mt-1 text-2xl text-white" style={{ fontFamily: "soria-font, serif", fontWeight: 900 }}>
          {title}
        </p>
        <div className="overflow-hidden rounded-lg">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              key={sessionId}
              title={`${title} video`}
              src={embedUrl}
              className="absolute left-0 top-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
