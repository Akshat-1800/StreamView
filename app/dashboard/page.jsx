"use client";

import { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import { useUser,useAuth } from "@clerk/nextjs";

import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  // const {  user } = useUser();
  const {isSignedIn, isLoaded} = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);
  if (!isLoaded) return null;
  if (!isSignedIn) {
    router.push("/sign-in");
  }

  return (
    <>
    <Navbar />  
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Browse</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
    </>
  );
}
