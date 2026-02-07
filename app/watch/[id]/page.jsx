"use client";
//http://localhost:8080/watch/6973a716de14691c1f7805ce
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
// import { getSocket } from "@/lib/socketClient";
import { toast } from "react-toastify";

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();

  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState("auto");

  // const socket = getSocket(); // ✅ global socket

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
      .catch((err) => {
        setError(err.message);
        toast.error(err.message);
      });
  }, [id]);

  /* ======================
     ROOM CREATED LISTENER
     ====================== */
  // useEffect(() => {
  //   socket.on("room-created", ({ roomId }) => {
  //     router.push(`/party/${roomId}`);
  //   });

  //   return () => {
  //     socket.off("room-created");
  //   };
  // }, [router, socket]);

  // /* ======================
  //    CREATE PARTY
  //    ====================== */
  // const createParty = () => {
  //   if (!video) return;
  //   socket.emit("create-room", { videoId: video._id });
  // };

  // /* ======================
  //    ERROR UI
  //    ====================== */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh p-6">
        <div className="card p-8 max-w-md text-center animate-fade-in">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-xl font-semibold mb-2">Oops!</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="text-center animate-fade-in">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="btn btn-ghost text-sm px-0 hover:bg-transparent hover:text-red-400"
        >
          ← Back
        </button>

        {/* Video Player */}
        <div className="card overflow-hidden">
          <VideoPlayer src={video.videoUrl} quality={quality} />
        </div>

        {/* Video Info */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {video.isPremium && (
                <span className="badge badge-premium">⭐ Premium</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{video.title}</h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">{video.description}</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <div className="card p-4">
              <p className="text-sm text-gray-400 mb-3">Quality</p>
              <div className="flex gap-2 flex-wrap">
                {["auto", 240, 480].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`btn text-sm px-4 py-2 ${
                      quality === q ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {q === "auto" ? "Auto" : `${q}p`}
                  </button>
                ))}
              </div>
            </div>

            {/* <a href="/party" className="btn btn-secondary">
              🎉 Start Watch Party
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
