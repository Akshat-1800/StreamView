"use client";

import { useEffect, useRef } from "react";

export default function LocalVideoTile({ stream, pinned = false, isPresenting = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={`video-tile ${pinned ? 'video-tile-pinned w-full h-full' : 'participant-tile'}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      {isPresenting && (
        <div className="video-tile-presenter">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Presenting
        </div>
      )}
      <div className="video-tile-label">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        You {isPresenting && "(Sharing)"}
      </div>
    </div>
  );
}
