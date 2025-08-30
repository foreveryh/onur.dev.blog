import { kv } from '@vercel/kv'
import { encrypt, decrypt } from './crypto'

const KV_KEYS = {
  AUTH: 'raindrop:auth',
  REFRESH_LOCK: 'raindrop:refresh_lock'
}

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1'

export class TokenManager {
  constructor() {
    this.clientId = process.env.RAINDROP_CLIENT_ID
    this.clientSecret = process.env.RAINDROP_CLIENT_SECRET
    
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Missing RAINDROP_CLIENT_ID or RAINDROP_CLIENT_SECRET')
    }
  }

  async getValidAccessToken() {
    const tokenData = await kv.get(KV_KEYS.AUTH)
    
    if (!tokenData) {
      throw new Error('No authentication data found. Please complete OAuth setup.')
    }

    // 检查是否需要刷新 (提前5分钟刷新)
    const expiresAt = tokenData.expires_at
    const shouldRefresh = expiresAt < Date.now() + (5 * 60 * 1000)

    if (shouldRefresh) {
      console.log('Token expires soon, attempting refresh...')
      return await this.refreshAccessToken()
    }

    return decrypt(tokenData.access_token)
  }

  async refreshAccessToken() {
    // 防止并发刷新
    const lockKey = KV_KEYS.REFRESH_LOCK
    const hasLock = await kv.set(lockKey, Date.now(), { 
      ex: 30, // 30秒锁定期
      nx: true // only set if not exists
    })

    if (!hasLock) {
      // 等待其他刷新完成
      console.log('Another refresh in progress, waiting...')
      await this.waitForRefresh()
      return await this.getValidAccessToken()
    }

    try {
      const tokenData = await kv.get(KV_KEYS.AUTH)
      if (!tokenData?.refresh_token) {
        throw new Error('No refresh token available')
      }

      const refreshToken = decrypt(tokenData.refresh_token)
      const response = await fetch(`${RAINDROP_API_URL}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Token refresh failed: ${response.status} ${errorData}`)
      }

      const newTokens = await response.json()
      
      // 存储新的token
      const encryptedData = {
        access_token: encrypt(newTokens.access_token),
        refresh_token: encrypt(newTokens.refresh_token || refreshToken), // 有些API不返回新的refresh token
        expires_at: Date.now() + (newTokens.expires_in * 1000),
        last_refreshed: Date.now()
      }

      await kv.set(KV_KEYS.AUTH, encryptedData)
      console.log('Token refreshed successfully')
      
      return newTokens.access_token

    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    } finally {
      // 释放锁
      await kv.del(lockKey)
    }
  }

  async waitForRefresh(maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const hasLock = await kv.get(KV_KEYS.REFRESH_LOCK)
      if (!hasLock) {
        return // 刷新完成
      }
    }
    throw new Error('Refresh timeout')
  }

  async storeInitialTokens(accessToken, refreshToken, expiresIn) {
    const encryptedData = {
      access_token: encrypt(accessToken),
      refresh_token: encrypt(refreshToken),
      expires_at: Date.now() + (expiresIn * 1000),
      last_refreshed: Date.now()
    }

    await kv.set(KV_KEYS.AUTH, encryptedData)
    console.log('Initial tokens stored successfully')
  }

  async clearTokens() {
    await kv.del(KV_KEYS.AUTH)
    await kv.del(KV_KEYS.REFRESH_LOCK)
    console.log('Tokens cleared')
  }

  async getTokenInfo() {
    const tokenData = await kv.get(KV_KEYS.AUTH)
    if (!tokenData) return null

    return {
      hasTokens: true,
      expiresAt: new Date(tokenData.expires_at).toISOString(),
      lastRefreshed: new Date(tokenData.last_refreshed).toISOString(),
      isExpired: tokenData.expires_at < Date.now()
    }
  }
}

// 单例实例
export const tokenManager = new TokenManager()