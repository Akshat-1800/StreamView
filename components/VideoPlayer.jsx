"use client";

import { useEffect, useRef } from "react";
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
      hls.currentLevel = -1; // auto ABR
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
     AUTO SYNC (LATE JOINERS)
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
     HOST-ONLY PLAY / PAUSE
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

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        controls
        className="w-full max-w-5xl rounded-lg bg-black"
      />

      {/* UI hint */}
      {socket && roomState && socket.id !== roomState.hostId && (
        <p className="text-sm text-gray-400">
          🎬 Only host controls playback
        </p>
      )}
    </div>
  );
}
