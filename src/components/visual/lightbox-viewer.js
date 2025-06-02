'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import { CldImage, getCldVideoUrl } from 'next-cloudinary'
import { useEffect } from 'react'

export function LightboxViewer({ isOpen, media, allMedia, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        navigatePrevious()
      } else if (e.key === 'ArrowRight') {
        navigateNext()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose])

  const navigatePrevious = () => {
    if (!media || !allMedia) return
    const currentIndex = allMedia.findIndex((item) => item.id === media.id)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : allMedia.length - 1
    onNavigate({ ...allMedia[previousIndex], index: previousIndex })
  }

  const navigateNext = () => {
    if (!media || !allMedia) return
    const currentIndex = allMedia.findIndex((item) => item.id === media.id)
    const nextIndex = currentIndex < allMedia.length - 1 ? currentIndex + 1 : 0
    onNavigate({ ...allMedia[nextIndex], index: nextIndex })
  }

  if (!isOpen || !media) return null

  const isVideo = media.mediaType === 'video'

  // 为视频生成正确的URL
  const getVideoUrl = () => {
    if (isVideo && media.cloudinaryId) {
      return getCldVideoUrl({
        src: media.cloudinaryId,
        quality: 'auto'
      })
    }
    return media.videoUrl || media.url
  }

  const videoUrl = getVideoUrl()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/95"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg transition-colors hover:bg-white"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* Navigation Buttons */}
        {allMedia && allMedia.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigatePrevious()
              }}
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg transition-colors hover:bg-white"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateNext()
              }}
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg transition-colors hover:bg-white"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Media Content */}
        <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
          {isVideo ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="max-h-full max-w-full rounded-lg"
              onError={(e) => {
                console.error('Video load error:', e)
                console.info('Trying to load video from:', videoUrl)
              }}
            />
          ) : // 支持 Cloudinary 和直接 URL 两种模式
          media.cloudinaryId ? (
            <CldImage
              src={media.cloudinaryId}
              alt={media.title || 'Image'}
              width={1200}
              height={800}
              quality="auto"
              format="auto"
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          ) : (
            <img
              src={media.imageUrl}
              alt={media.title || 'Image'}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          )}
        </div>

        {/* Media Info */}
        <div className="absolute right-4 bottom-4 left-4 rounded-lg bg-white/90 p-4 text-gray-800 shadow-lg">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{media.title || 'Untitled'}</h2>

          {media.description && <p className="mb-3 text-sm text-gray-600">{media.description}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {isVideo && media.duration && <span>Duration: {Math.round(media.duration)}s</span>}
            {media.camera && <span>Camera: {media.camera}</span>}
            {media.location && <span>Location: {media.location}</span>}
            {media.timestamp && (
              <span>
                {new Date(media.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          {media.tags && media.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {media.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
