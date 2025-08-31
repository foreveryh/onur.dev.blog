import { decrypt, encrypt } from './crypto'

export class EnvTokenManager {
  constructor() {
    // 延迟验证环境变量，避免构建时错误
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
      const encryptedToken = process.env.RAINDROP_ENCRYPTED_REFRESH_TOKEN
      if (!encryptedToken) {
        return null
      }

      const tokenInfo = JSON.parse(decrypt(encryptedToken))
      return tokenInfo
    } catch (error) {
      console.error('Failed to decrypt stored token:', error)
      return null
    }
  }

  async storeTokenInfo(tokenInfo) {
    try {
      encrypt(JSON.stringify(tokenInfo))

      // 在这种实现中，我们只能输出加密后的token，需要手动添加到环境变量
      // 注意：在生产环境中，应该通过其他方式传递这个信息

      return true
    } catch (error) {
      console.error('Failed to encrypt token for storage:', error)
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
      const newTokenInfo = await this.refreshAccessToken(tokenInfo.refreshToken)

      if (!newTokenInfo) {
        throw new Error('Failed to refresh access token')
      }

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
        refreshToken: data.refresh_token || refreshToken, // 如果没有新的refresh token，保持原有的
        accessExpiresAt: Date.now() + data.expires_in * 1000,
        refreshExpiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180天
        updatedAt: Date.now()
      }

      // 输出新的加密token供手动更新
      await this.storeTokenInfo(tokenInfo)

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
      refreshExpiresAt: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180天
      updatedAt: Date.now()
    }

    return await this.storeTokenInfo(tokenInfo)
  }
}

// 单例模式
let tokenManagerInstance = null

export function getTokenManager() {
  if (!tokenManagerInstance) {
    tokenManagerInstance = new EnvTokenManager()
  }
  return tokenManagerInstance
}
