'use client'

import { motion } from 'framer-motion'
import { EyeIcon, HeartIcon, PlayIcon, ShareIcon } from 'lucide-react'
import { CldImage } from 'next-cloudinary'

export function MediaCard({ item, isHovered, onClick }) {
  const isVideo = item.mediaType === 'video'

  // 使用 API 返回的真实宽高比，或者从原始资源计算
  const actualAspectRatio = item.originalResource?.aspect_ratio || 
                           item.aspect_ratio || 
                           (item.originalResource?.width && item.originalResource?.height 
                             ? item.originalResource.width / item.originalResource.height 
                             : 1.33)

  // 为瀑布流优化的高度计算
  const baseWidth = 400
  const calculatedHeight = Math.round(baseWidth / actualAspectRatio)

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      {/* Main Image/Video */}
      <div className="relative">
        {/* 支持 Cloudinary 和直接 URL 两种模式 */}
        {item.cloudinaryId ? (
          <CldImage
            src={item.cloudinaryId}
            alt={`${item.sourceType} ${item.mediaType}`}
            width={baseWidth}
            height={calculatedHeight}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            crop="fill"
            quality="auto"
            format="auto"
            className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority={false}
          />
        ) : (
          <img
            src={item.imageUrl}
            alt={`${item.sourceType} ${item.mediaType}`}
            className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ height: `${calculatedHeight}px` }}
            loading="lazy"
          />
        )}

        {/* Video Play Icon */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/70 p-4 backdrop-blur-sm">
              <PlayIcon className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        )}

        {/* Action Buttons - Only show on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 flex gap-2"
        >
          <button className="rounded-full bg-white/90 p-2 text-gray-700 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white">
            <HeartIcon className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-white/90 p-2 text-gray-700 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white">
            <ShareIcon className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-white/90 p-2 text-gray-700 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white">
            <EyeIcon className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Optional: Simple stats overlay at bottom (only if data exists) */}
        {(item.likes || item.views) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 flex items-center gap-3 text-white"
          >
            {item.likes && (
              <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs backdrop-blur-sm">
                <HeartIcon className="h-3 w-3" />
                <span>{item.likes}</span>
              </div>
            )}
            {item.views && (
              <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs backdrop-blur-sm">
                <EyeIcon className="h-3 w-3" />
                <span>{item.views}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
