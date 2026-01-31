"use client";

import { useEffect, useRef } from "react";

export default function LocalVideoTile({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative w-48 h-36 bg-black rounded overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <span className="absolute bottom-1 left-1 text-xs bg-black/60 px-2 py-0.5 rounded">
        You
      </span>
    </div>
  );
}
