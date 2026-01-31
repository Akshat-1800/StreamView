import React from 'react'
import Link from 'next/link'


const VideoCard = ({ video }) => {
  return (
    <Link href={`/watch/${video._id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />

          {video.isPremium && (
            <span className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded">
              PREMIUM
            </span>
          )}
        </div>

        <h3 className="mt-2 text-sm font-semibold truncate">
          {video.title}
        </h3>
      </div>
    </Link>
  )
}

export default VideoCard