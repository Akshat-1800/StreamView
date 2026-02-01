"use client"
import React from 'react'
import VideoCard from './VideoCard'
import { useState,useEffect } from 'react'


// const videos = [
//   {
//     _id: '1',
//     title: 'Inception',
//     thumbnailUrl: '/public/next.svg',
//     isPremium: true,
//   },
//   {
//     _id: '2',
//     title: 'The Matrix',
//     thumbnailUrl: '/public/next.svg',
//     isPremium: false,
//   },
//   {
//     _id: '3',
//     title: 'Interstellar',
//     thumbnailUrl: '/public/next.svg',
//     isPremium: true,
//   },
//   {
//     _id: '4',
//     title: 'The Dark Knight',
//     thumbnailUrl: '/public/next.svg',
//     isPremium: false,
//   },
// ]

const Latest = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Latest Releases
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  )
}

export default Latest