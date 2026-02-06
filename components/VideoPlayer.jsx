"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function VideoPlayer({
  src,
  quality = "auto",
  roomId,
  roomState,
  socket,
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [skipIndicator, setSkipIndicator] = useState(null);
  const [showControls, setShowControls] = useState(false);
const hideTimeoutRef = useRef(null);

  /* =========================
     LOAD HLS VIDEO
  ========================= */
  useEffect(() => {
    if (!videoRef.current || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(videoRef.current);

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoRef.current.src = src;
    }
  }, [src]);

  /* =========================
     MANUAL QUALITY CONTROL
  ========================= */
  useEffect(() => {
    const hls = hlsRef.current;
    if (!hls) return;

    if (quality === "auto") {
      hls.currentLevel = -1;
    } else {
      const levelIndex = hls.levels.findIndex(
        (l) => l.height === quality
      );

      if (levelIndex !== -1) {
        hls.currentLevel = levelIndex;
      }
    }
  }, [quality]);

  /* =========================
     AUTO SYNC
  ========================= */
  useEffect(() => {
    if (!videoRef.current || !roomState) return;

    const video = videoRef.current;

    video.currentTime = roomState.currentTime;

    if (roomState.isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [roomState]);

  /* =========================
     HOST PLAY / PAUSE
  ========================= */
  useEffect(() => {
    if (!socket || !roomState || !videoRef.current) return;

    const video = videoRef.current;

    const onPlay = () => {
      if (socket.id !== roomState.hostId) {
        video.pause();
        return;
      }

      socket.emit("play-video", {
        roomId,
        time: video.currentTime,
      });
    };

    const onPause = () => {
      if (socket.id !== roomState.hostId) {
        video.play().catch(() => {});
        return;
      }

      socket.emit("pause-video", {
        roomId,
        time: video.currentTime,
      });
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [socket, roomState, roomId]);

  /* =========================
     RECEIVE SYNC EVENTS
  ========================= */
  useEffect(() => {
    if (!socket || !videoRef.current) return;

    const video = videoRef.current;

    socket.on("sync-play", ({ time }) => {
      video.currentTime = time;
      video.play().catch(() => {});
    });

    socket.on("sync-pause", ({ time }) => {
      video.currentTime = time;
      video.pause();
    });

    return () => {
      socket.off("sync-play");
      socket.off("sync-pause");
    };
  }, [socket]);

  /* =========================
     SKIP HELPERS
  ========================= */
  const showSkipIndicator = (text) => {
    setSkipIndicator(text);
    setTimeout(() => setSkipIndicator(null), 600);
  };

  const skipForward = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = Math.min(
      videoRef.current.duration || Infinity,
      videoRef.current.currentTime + 10
    );

    showSkipIndicator("+10s");
  };

  const skipBackward = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = Math.max(
      0,
      videoRef.current.currentTime - 10
    );

    showSkipIndicator("-10s");
  };

  /* =========================
     KEYBOARD CONTROLS
  ========================= */
  useEffect(() => {
    const handleKey = (e) => {
      if (!videoRef.current) return;

      if (e.key === "ArrowRight") skipForward();
      if (e.key === "ArrowLeft") skipBackward();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const handleActivity = () => {
  setShowControls(true);
  
  if (hideTimeoutRef.current) {
    clearTimeout(hideTimeoutRef.current);
  }
  
  hideTimeoutRef.current = setTimeout(() => {
    setShowControls(false);
  }, 3000); // Hide after 3 seconds of inactivity
};

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-2">
      <div 
  className="relative w-full max-w-5xl"
  onMouseMove={handleActivity}
  onMouseEnter={handleActivity}
  onMouseLeave={() => setShowControls(false)}
>
        <video
          ref={videoRef}
          controls
          className="w-full rounded-lg bg-black"
        />

        {/* Skip Buttons */}
        <div className={`absolute inset-0 flex justify-between items-center px-4 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={skipBackward}
            className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm"
          >
            ⏪ 
          </button>

          <button
            onClick={skipForward}

            className="pointer-events-auto bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm"
          >
             ⏩
          </button>
        </div>

        {/* Skip Indicator */}
        {skipIndicator && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white px-6 py-3 rounded-xl text-xl font-semibold animate-pulse">
              {skipIndicator}
            </div>
          </div>
        )}
      </div>

      {/* Host Hint */}
      {socket && roomState && socket.id !== roomState.hostId && (
        <p className="text-sm text-gray-400">
          🎬 Only host controls playback
        </p>
      )}
    </div>
  );
}
