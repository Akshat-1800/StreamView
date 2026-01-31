"use client";
//http://localhost:8080/watch/6973a716de14691c1f7805ce
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { getSocket } from "@/lib/socketClient";

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();

  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState("auto");

  const socket = getSocket(); // ✅ global socket

  /* ======================
     FETCH VIDEO
     ====================== */
  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        return res.json();
      })
      .then(setVideo)
      .catch((err) => setError(err.message));
  }, [id]);

  /* ======================
     ROOM CREATED LISTENER
     ====================== */
  useEffect(() => {
    socket.on("room-created", ({ roomId }) => {
      router.push(`/party/${roomId}`);
    });

    return () => {
      socket.off("room-created");
    };
  }, [router, socket]);

  /* ======================
     CREATE PARTY
     ====================== */
  const createParty = () => {
    if (!video) return;
    socket.emit("create-room", { videoId: video._id });
  };

  /* ======================
     ERROR UI
     ====================== */
  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!video) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-gray-400">{video.description}</p>
      </div>

      <VideoPlayer src={video.videoUrl} quality={quality} />

      <div className="flex items-center justify-between gap-4">
        {/* 🎚 Quality */}
        <div className="flex gap-2">
          {["auto", 240, 480].map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`px-3 py-1 rounded ${
                quality === q ? "bg-red-600" : "bg-zinc-800"
              }`}
            >
              {q === "auto" ? "Auto" : `${q}p`}
            </button>
          ))}
        </div>

        {/* 🎉 Party */}
        
      </div>
    </div>
  );
}
