import { decrypt, encrypt } from './crypto'

// 延迟创建 Supabase 客户端，避免构建时错误
let supabase = null

function getSupabaseClient() {
  if (supabase) return supabase

  const { createClient } = require('@supabase/supabase-js')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ANON_KEY')
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}

export class SupabaseTokenManager {
  constructor() {
    // 延迟验证环境变量，避免构建时错误
    this.tableName = 'raindrop_tokens'
    this.tokenId = 'main' // 固定ID，因为只有一个token
  }

  getCredentials() {
    const clientId = process.env.RAINDROP_CLIENT_ID
    const clientSecret = process.env.RAINDROP_CLIENT_SECRET
    if (!clientId || !clientSecret) {
      throw new Error('Missing RAINDROP_CLIENT_ID or RAINDROP_CLIENT_SECRET')
    }
    return { clientId, clientSecret }
  }

  async getStoredTokenInfo() {
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select('encrypted_data')
        .eq('id', this.tokenId)
        .single()

      if (error || !data) {
        console.log('No stored token found:', error?.message || 'No data')
        return null
      }

      const tokenInfo = JSON.parse(decrypt(data.encrypted_data))
      return tokenInfo
    } catch (error) {
      console.error('Failed to get stored token:', error)
      return null
    }
  }

  async storeTokenInfo(tokenInfo) {
    try {
      const supabase = getSupabaseClient()
      const encryptedData = encrypt(JSON.stringify(tokenInfo))

      const { error } = await supabase.from(this.tableName).upsert({
        id: this.tokenId,
        encrypted_data: encryptedData,
        updated_at: new Date().toISOString()
      })

      if (error) {
        console.error('Failed to store token:', error)
        return false
      }

      console.log('Token stored successfully in Supabase')
      return true
    } catch (error) {
      console.error('Failed to store token:', error)
      return false
    }
  }

  async getValidAccessToken() {
    try {
      const tokenInfo = await this.getStoredTokenInfo()
      if (!tokenInfo) {
        throw new Error('No refresh token available. Please complete OAuth setup.')
      }

      // 检查access token是否还有效（提前5分钟刷新）
      const fiveMinutes = 5 * 60 * 1000
      if (tokenInfo.accessToken && tokenInfo.accessExpiresAt > Date.now() + fiveMinutes) {
        return tokenInfo.accessToken
      }

      // 需要刷新access token
      console.log('Access token expired or expiring soon, refreshing...')
      const newTokenInfo = await this.refreshAccessToken(tokenInfo.refreshToken)

      if (!newTokenInfo) {
        throw new Error('Failed to refresh access token')
      }

      await this.storeTokenInfo(newTokenInfo)
      return newTokenInfo.accessToken
    } catch (error) {
      console.error('Failed to get valid access token:', error)
      throw error
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const { clientId, clientSecret } = this.getCredentials()

      const response = await fetch('https://raindrop.io/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Token refresh failed:', response.status, errorText)
        return null
      }

      const data = await response.json()

      const tokenInfo = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        accessExpiresAt: Date.now() + data.expires_in * 1000,
        refreshExpiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000,
        updatedAt: Date.now()
      }

      return tokenInfo
    } catch (error) {
      console.error('Error refreshing access token:', error)
      return null
    }
  }

  async storeInitialTokens(accessToken, refreshToken, expiresIn) {
    const tokenInfo = {
      accessToken,
      refreshToken,
      accessExpiresAt: Date.now() + expiresIn * 1000,
      refreshExpiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now()
    }

    return await this.storeTokenInfo(tokenInfo)
  }
}

// 单例模式
let tokenManagerInstance = null

export function getTokenManager() {
  if (!tokenManagerInstance) {
    tokenManagerInstance = new SupabaseTokenManager()
  }
  return tokenManagerInstance
}
