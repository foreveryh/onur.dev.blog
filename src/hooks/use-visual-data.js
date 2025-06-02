'use client'

import { useEffect, useState } from 'react'

/**
 * Visual 数据获取 Hook - 只使用 Cloudinary 真实数据
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

      console.info('正在从 Cloudinary 获取您的图片...')

      const response = await fetch('/api/visual/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.info('📡 API 响应状态:', response.status, response.statusText)

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (result.ok && result.images && result.images.length > 0) {
        // 转换为前端组件期望的格式
        const visualData = result.images.map((img, index) => ({
          id: `cloudinary-${index + 1}`,
          cloudinaryId: img.public_id,
          imageUrl: img.url, // 添加这个字段以支持直接 URL 显示
          mediaType: 'image',
          sourceType: 'photography',
          aspectRatio: img.aspect_ratio,
          title: `摄影作品 ${index + 1}`,
          description: '来自您的 Cloudinary 账户的精美摄影作品',
          tags: ['摄影', '个人作品', 'Cloudinary'],
          timestamp: img.created_at,
          // 保存原始资源信息
          originalResource: img
        }))

        console.info('✅ 成功加载您的 Cloudinary 图片:', visualData.length, '张')
        setData(visualData)
      } else {
        console.error('⚠️ 未获取到 Cloudinary 图片')
        setError('未获取到 Cloudinary 图片')
        setData([])
      }
    } catch (err) {
      console.error('获取 Cloudinary 数据失败:', err)
      setError(`无法连接到 Cloudinary: ${err.message}`)
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

