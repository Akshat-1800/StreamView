"use client";

import { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import { useUser,useAuth } from "@clerk/nextjs";

import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const {isSignedIn, isLoaded} = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  
  if (!isLoaded) return null;
  if (!isSignedIn) {
    router.push("/sign-in");
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="section-title text-2xl md:text-3xl mb-1 md:mb-2">Browse</h1>
            <p className="text-gray-400 text-sm md:text-base">Discover movies and series to watch together</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="btn btn-secondary text-xs md:text-sm px-3 md:px-4">
              🎬 Movies
            </button>
            <button className="btn btn-ghost text-xs md:text-sm px-3 md:px-4">
              📺 Series
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="space-y-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="skeleton aspect-video rounded-xl"></div>
                <div className="skeleton h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Videos grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {videos.map((video, index) => (
              <div 
                key={video._id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🎬</span>
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-gray-400">Check back soon for new content!</p>
          </div>
        )}
      </main>
    </div>
  );
}
