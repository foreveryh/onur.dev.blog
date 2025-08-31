import { NextResponse } from 'next/server'

import { COLLECTION_IDS } from '@/lib/constants'

// 动态获取存储方案
function getStorageAndTokenManager() {
  // 优先尝试使用 Vercel KV (如果可用)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = require('@vercel/kv')
    const { getTokenManager } = require('@/lib/auth/token-manager')
    return { storage: kv, tokenManager: getTokenManager() }
  }

  // 其次尝试使用 Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { getTokenManager } = require('@/lib/auth/supabase-token-manager')
    return { storage: null, tokenManager: getTokenManager() }
  }

  // 最后使用环境变量存储方案
  const { getTokenManager } = require('@/lib/auth/env-token-manager')
  return { storage: null, tokenManager: getTokenManager() }
}

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1'
const CACHE_KEY = 'raindrop:bookmarks:cache'
const CACHE_TTL = 2 * 24 * 60 * 60 * 1000 // 2天缓存

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collection')
    const page = parseInt(searchParams.get('page') || '0')

    // 如果指定了收藏夹ID，返回该收藏夹的分页数据
    if (collectionId) {
      return await getCollectionBookmarks(collectionId, page)
    }

    // 否则返回所有书签 (保持兼容性)
    const { storage, tokenManager } = getStorageAndTokenManager()

    // 如果有存储可用，使用缓存
    if (storage) {
      const cachedData = await storage.get(CACHE_KEY)
      if (cachedData && cachedData.cached_at + CACHE_TTL > Date.now()) {
        console.log('Returning cached bookmarks')
        return NextResponse.json(cachedData.data)
      }
    }

    // 获取有效的访问令牌
    const accessToken = await tokenManager.getValidAccessToken()

    // 获取所有收藏夹的书签
    const allBookmarks = await fetchAllBookmarks(accessToken)

    // 如果有存储可用，缓存结果
    if (storage) {
      await storage.set(CACHE_KEY, {
        data: allBookmarks,
        cached_at: Date.now()
      })
    }

    console.log(`Fetched ${allBookmarks.length} bookmarks`)
    return NextResponse.json(allBookmarks)
  } catch (error) {
    console.error('Bookmarks API error:', error)

    // 尝试返回缓存的数据作为降级方案
    const { storage } = getStorageAndTokenManager()
    if (storage) {
      const cachedData = await storage.get(CACHE_KEY)
      if (cachedData) {
        console.log('Returning stale cached data due to error')
        return NextResponse.json(cachedData.data)
      }
    }

    return NextResponse.json({ error: 'Failed to fetch bookmarks', details: error.message }, { status: 500 })
  }
}

async function getCollectionBookmarks(collectionId, page = 0) {
  const cacheKey = `raindrop:collection:${collectionId}:page:${page}`
  const { storage, tokenManager } = getStorageAndTokenManager()

  try {
    // 如果有存储可用，检查分页缓存
    if (storage) {
      const cachedData = await storage.get(cacheKey)
      if (cachedData && cachedData.cached_at + CACHE_TTL > Date.now()) {
        return NextResponse.json(cachedData.data)
      }
    }

    const accessToken = await tokenManager.getValidAccessToken()
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }

    const url = `${RAINDROP_API_URL}/raindrops/${collectionId}?page=${page}&perpage=50`
    const response = await fetch(url, options)

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - token may be expired')
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const items = data.items || []

    // 如果有存储可用，缓存分页结果
    if (storage) {
      await storage.set(cacheKey, {
        data: items,
        cached_at: Date.now()
      })
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error(`Error fetching collection ${collectionId} page ${page}:`, error)

    // 尝试返回缓存数据
    if (storage) {
      const cachedData = await storage.get(cacheKey)
      if (cachedData) {
        return NextResponse.json(cachedData.data)
      }
    }

    return NextResponse.json({ error: 'Failed to fetch collection bookmarks' }, { status: 500 })
  }
}

async function fetchAllBookmarks(accessToken) {
  const allBookmarks = []
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }

  for (const collectionId of COLLECTION_IDS) {
    try {
      let page = 0
      let hasMore = true

      while (hasMore) {
        const url = `${RAINDROP_API_URL}/raindrops/${collectionId}?page=${page}&perpage=50`
        const response = await fetch(url, options)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - token may be expired')
          }
          console.warn(`Failed to fetch collection ${collectionId}:`, response.status)
          break
        }

        const data = await response.json()

        if (data.items && data.items.length > 0) {
          // 添加收藏夹信息到每个书签
          const itemsWithCollection = data.items.map((item) => ({
            ...item,
            collectionId: collectionId
          }))
          allBookmarks.push(...itemsWithCollection)
          page++
        } else {
          hasMore = false
        }

        // 避免API限制
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`Error fetching collection ${collectionId}:`, error)
      // 继续处理其他收藏夹
    }
  }

  return allBookmarks
}
