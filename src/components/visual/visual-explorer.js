'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useVisualData } from '@/hooks/use-visual-data'
import { Gallery } from './gallery'
import { LightboxViewer } from './lightbox-viewer'
import { TabSelector } from './tab-selector'

export function VisualExplorer() {
  const [mediaType, setMediaType] = useState('image')
  const [sourceType, setSourceType] = useState('photography')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const { data: visualData, isLoading, error } = useVisualData()

  const filteredData = showAll
    ? visualData || []
    : visualData?.filter((item) => item.mediaType === mediaType && item.sourceType === sourceType) || []

  const handleMediaClick = (media, index) => {
    setSelectedMedia({ ...media, index })
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedMedia(null)
  }

  const handleFilterChange = (filterState) => {
    setShowAll(filterState.showAll)
    if (!filterState.showAll) {
      setMediaType(filterState.mediaType)
      setSourceType(filterState.sourceType)
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">出现了一些问题</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <TabSelector
        mediaType={mediaType}
        sourceType={sourceType}
        showAll={showAll}
        onFilterChange={handleFilterChange}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={showAll ? 'all' : `${mediaType}-${sourceType}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-gray-500">加载您的摄影作品中...</div>
            </div>
          ) : filteredData.length > 0 ? (
            <Gallery items={filteredData} onItemClick={handleMediaClick} />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium text-gray-700">暂无内容</h3>
                <p className="text-gray-500">
                  {showAll
                    ? '暂无任何内容'
                    : `目前没有 ${sourceType === 'photography' ? '摄影' : 'AI生成'} ${mediaType === 'image' ? '图片' : '视频'} 内容。`}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <LightboxViewer
        isOpen={isLightboxOpen}
        media={selectedMedia}
        allMedia={filteredData}
        onClose={closeLightbox}
        onNavigate={setSelectedMedia}
      />
    </div>
  )
} 