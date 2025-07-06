import { useCallback, useEffect, useState } from 'react'

import { SUPABASE_TABLE_NAME } from '@/lib/constants'
import supabase from '@/lib/supabase/public'

// 创建一个单例的 channel
let globalChannel = null

export const useViewData = (slug) => {
  const [viewData, setViewData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // 获取初始数据
  const fetchViewData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabaseQuery = supabase.from(SUPABASE_TABLE_NAME).select('slug, view_count')
      if (slug) supabaseQuery.eq('slug', slug)
      const { data: supabaseData, error: queryError } = await supabaseQuery

      if (queryError) throw queryError
      if (supabaseData) setViewData(supabaseData)
    } catch (error) {
      console.error('Error fetching view data from Supabase:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchViewData()
  }, [fetchViewData])

  // 设置实时订阅
  useEffect(() => {
    // 如果已经有全局 channel，直接使用
    if (globalChannel) {
      return
    }

    try {
      // 创建新的 channel
      globalChannel = supabase
        .channel('supabase_realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: SUPABASE_TABLE_NAME
          },
          (payload) => {
            if (!payload?.new?.slug) return

            setViewData((prev) => {
              if (!prev) return null

              const index = prev.findIndex((item) => item.slug === payload.new.slug)
              if (index === -1) return [...prev, payload.new]

              // 检查数据是否真的变化
              if (prev[index].view_count === payload.new.view_count) {
                return prev
              }

              const newData = [...prev]
              newData[index] = payload.new
              return newData
            })
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.info('Successfully subscribed to realtime updates')
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Failed to subscribe to realtime updates')
            setError('Failed to subscribe to realtime updates')
          }
        })
    } catch (error) {
      console.error('Error setting up realtime subscription:', error)
      setError(error.message)
    }

    // 清理函数
    return () => {
      if (globalChannel) {
        supabase.removeChannel(globalChannel)
        globalChannel = null
      }
    }
  }, []) // 只在组件挂载时执行一次

  return { viewData, error, isLoading, refetch: fetchViewData }
}
