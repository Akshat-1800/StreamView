import React from 'react'
import Link from 'next/link'

const VideoCard = ({ video }) => {
  return (
    <Link href={`/watch/${video._id}`}>
      <div className="group cursor-pointer">
        <div className={`card relative aspect-video ${video.isPremium ? 'card-premium' : ''}`}>
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Premium badge */}
          {video.isPremium && (
            <span className="badge badge-premium absolute top-3 right-3">
              ⭐ Premium
            </span>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <span className="text-2xl ml-1">▶</span>
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-3 px-1">
          <h3 className="font-semibold text-sm md:text-base truncate group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-xs md:text-sm text-gray-500 truncate mt-0.5 md:mt-1">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default VideoCard