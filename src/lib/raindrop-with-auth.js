import 'server-only'

import { COLLECTION_IDS } from '@/lib/constants'

// 动态选择 token manager 基于可用的存储方案
function getTokenManager() {
  // 优先尝试使用 Vercel KV (如果可用)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { getTokenManager } = require('./auth/token-manager')
    return getTokenManager()
  }
  
  // 其次尝试使用 Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { getTokenManager } = require('./auth/supabase-token-manager')
    return getTokenManager()
  }
  
  // 最后使用环境变量存储方案
  const { getTokenManager } = require('./auth/env-token-manager')
  return getTokenManager()
}

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1'

async function makeAuthenticatedRequest(url, options = {}) {
  try {
    const tokenManager = getTokenManager()
    const accessToken = await tokenManager.getValidAccessToken()
    
    const authOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options.headers
      }
    }

    const response = await fetch(url, authOptions)
    
    // 如果token无效，尝试刷新token并重试一次
    if (response.status === 401) {
      console.log('Access token invalid, attempting refresh...')
      
      // 获取新的access token (这会触发refresh)
      const newAccessToken = await tokenManager.getValidAccessToken()
      
      const retryOptions = {
        ...authOptions,
        headers: {
          ...authOptions.headers,
          Authorization: `Bearer ${newAccessToken}`
        }
      }
      
      const retryResponse = await fetch(url, retryOptions)
      if (!retryResponse.ok) {
        throw new Error(`HTTP error after token refresh! status: ${retryResponse.status}`)
      }
      
      return retryResponse
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    console.error('Authenticated request failed:', error)
    throw error
  }
}

export const getBookmarkItems = async (id, pageIndex = 0) => {
  if (!id) throw new Error('Bookmark ID is required')
  if (typeof pageIndex !== 'number' || pageIndex < 0) {
    throw new Error('Invalid page index')
  }

  try {
    const url = `${RAINDROP_API_URL}/raindrops/${id}?${new URLSearchParams({
      page: pageIndex,
      perpage: 50
    })}`
    
    const response = await makeAuthenticatedRequest(url, {
      cache: 'force-cache',
      method: 'GET',
      next: {
        revalidate: 60 * 60 * 24 * 2 // 2 days
      },
      signal: AbortSignal.timeout(30000)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch bookmark items for collection ${id}: ${error.message}`)
    return null
  }
}

export const getBookmarks = async () => {
  try {
    const response = await makeAuthenticatedRequest(`${RAINDROP_API_URL}/collections`, {
      cache: 'force-cache',
      method: 'GET',
      next: {
        revalidate: 60 * 60 * 24 * 2 // 2 days
      },
      signal: AbortSignal.timeout(30000)
    })

    const bookmarks = await response.json()
    return bookmarks.items.filter((bookmark) => COLLECTION_IDS.includes(bookmark._id))
  } catch (error) {
    console.error(`Failed to fetch bookmarks: ${error.message}`)
    return null
  }
}

export const getBookmark = async (id) => {
  try {
    const response = await makeAuthenticatedRequest(`${RAINDROP_API_URL}/collection/${id}`)
    return await response.json()
  } catch (error) {
    console.info(error)
    return null
  }
}