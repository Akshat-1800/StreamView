"use client"
import React from 'react'
import VideoCard from './VideoCard'
import { useState,useEffect } from 'react'

const Latest = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h2 className="section-title text-2xl md:text-3xl mb-1 md:mb-2">Latest Releases</h2>
            <p className="text-gray-400 text-sm md:text-base">Fresh content added weekly</p>
          </div>
          <a href="/dashboard" className="btn btn-secondary text-sm w-fit">
            View All →
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="space-y-3">
                <div className="skeleton aspect-video"></div>
                <div className="skeleton h-4 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {videos.slice(0, 8).map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Latest