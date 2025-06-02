'use client'

import { motion } from 'framer-motion'
import { CameraIcon, GridIcon, ImageIcon, SparklesIcon, VideoIcon } from 'lucide-react'

export function TabSelector({ 
  mediaType, 
  sourceType, 
  showAll, 
  onFilterChange 
}) {
  // 合并标签系统，提供更简洁的选项
  const filterOptions = [
    { 
      value: 'all', 
      label: '全部', 
      icon: GridIcon,
      showAll: true
    },
    { 
      value: 'photography-image', 
      label: '摄影', 
      icon: CameraIcon,
      mediaType: 'image',
      sourceType: 'photography'
    },
    { 
      value: 'aigc-image', 
      label: 'AI图片', 
      icon: SparklesIcon,
      mediaType: 'image',
      sourceType: 'aigc'
    },
    { 
      value: 'photography-video', 
      label: '摄影视频', 
      icon: VideoIcon,
      mediaType: 'video',
      sourceType: 'photography'
    },
    { 
      value: 'aigc-video', 
      label: 'AI视频', 
      icon: ImageIcon,
      mediaType: 'video',
      sourceType: 'aigc'
    }
  ]

  // 获取当前选中的过滤器
  const getCurrentFilter = () => {
    if (showAll) return 'all'
    return `${sourceType}-${mediaType}`
  }

  const currentFilter = getCurrentFilter()

  const handleFilterClick = (option) => {
    if (option.showAll) {
      onFilterChange({ showAll: true })
    } else {
      onFilterChange({ 
        showAll: false,
        mediaType: option.mediaType,
        sourceType: option.sourceType
      })
    }
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 p-2">
        {filterOptions.map((option) => {
          const isActive = currentFilter === option.value
          const Icon = option.icon
          
          return (
            <button
              key={option.value}
              onClick={() => handleFilterClick(option)}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-filter-bg"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  initial={false}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 500, 
                    damping: 30,
                    duration: 0.2
                  }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
} 