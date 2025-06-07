'use client'

import { useEffect, useState } from 'react'

/**
 * Visual 数据获取 Hook - 支持图片和视频，使用新的分类系统
 * @returns {Object} { data, isLoading, error, refetch }
 */
export function useVisualData() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.info('Loading your visual works from Cloudinary...')

      const response = await fetch('/api/visual/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.info('📡 API Response Status:', response.status, response.statusText)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (result.ok && result.media && result.media.length > 0) {
        // 转换为前端组件期望的格式
        const visualData = result.media.map((item, index) => ({
          id: `cloudinary-${item.public_id}`,
          cloudinaryId: item.public_id,
          imageUrl: item.url, // 图片URL
          videoUrl: item.mediaType === 'video' ? item.url : null, // 视频URL
          mediaType: item.mediaType, // 'image' 或 'video'
          sourceType: item.sourceType, // 'photography' 或 'aigc'
          aspectRatio: item.aspect_ratio,
          // 优先使用用户设置的元数据，fallback到默认值
          title: item.title || `${getMediaTypeLabel(item.mediaType, item.sourceType)} ${index + 1}`,
          description: item.description || `${getMediaTypeDescription(item.mediaType, item.sourceType)}`,
          location: item.location || '',
          camera: item.camera || '',
          capturedAt: item.capturedAt || null, // 拍摄时间
          tags: item.tags && item.tags.length > 0 ? item.tags : generateTags(item.sourceType, item.mediaType),
          timestamp: item.created_at,
          duration: item.duration, // 视频时长
          category: item.category, // 原始分类：photograph、video、ai_photo、ai_video
          // 保存原始资源信息
          originalResource: item
        }))

        console.info('✅ Successfully loaded your Cloudinary media:', visualData.length, 'items')
        console.info('📊 Media breakdown:', {
          images: visualData.filter((item) => item.mediaType === 'image').length,
          videos: visualData.filter((item) => item.mediaType === 'video').length,
          photography: visualData.filter((item) => item.sourceType === 'photography').length,
          ai_generated: visualData.filter((item) => item.sourceType === 'aigc').length
        })
        setData(visualData)
      } else {
        console.error('⚠️ No Cloudinary media found')
        setError('No visual works found in your Cloudinary account')
        setData([])
      }
    } catch (err) {
      console.error('Failed to fetch Cloudinary data:', err)
      setError(`Unable to connect to Cloudinary: ${err.message}`)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  }
}

// 辅助函数：获取媒体类型标签
function getMediaTypeLabel(mediaType, sourceType) {
  if (mediaType === 'image') {
    return sourceType === 'aigc' ? 'AI Image' : 'Photography'
  } else {
    return sourceType === 'aigc' ? 'AI Video' : 'Video'
  }
}

// 辅助函数：获取媒体类型描述
function getMediaTypeDescription(mediaType, sourceType) {
  if (mediaType === 'image') {
    return sourceType === 'aigc'
      ? 'AI-generated visual artwork from your creative collection'
      : 'Beautiful photography from your personal collection'
  } else {
    return sourceType === 'aigc'
      ? 'AI-generated video content from your creative collection'
      : 'Video content from your personal collection'
  }
}

// 辅助函数：生成标签
function generateTags(sourceType, mediaType) {
  const tags = []

  if (sourceType === 'photography') {
    tags.push('Photography')
  } else {
    tags.push('AI Generated')
  }

  if (mediaType === 'image') {
    tags.push('Image')
  } else {
    tags.push('Video')
  }

  tags.push('Personal Collection', 'Cloudinary')

  return tags
}
