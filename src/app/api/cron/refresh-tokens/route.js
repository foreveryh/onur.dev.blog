import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// 动态选择 token manager
function getTokenManager() {
  // 优先尝试使用 Vercel KV (如果可用)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { getTokenManager } = require('@/lib/auth/token-manager')
    return getTokenManager()
  }

  // 其次尝试使用 Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { getTokenManager } = require('@/lib/auth/supabase-token-manager')
    return getTokenManager()
  }

  // 最后使用环境变量存储方案
  const { getTokenManager } = require('@/lib/auth/env-token-manager')
  return getTokenManager()
}

export async function GET() {
  // 验证请求来源 (Vercel Cron 或开发环境)
  const authHeader = headers().get('authorization')
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.info('Starting daily scheduled token refresh check...')

    const tokenManager = getTokenManager()
    const tokenInfo = await tokenManager.getStoredTokenInfo()

    if (!tokenInfo) {
      console.info('No tokens found, skipping refresh')
      return NextResponse.json({
        success: true,
        message: 'No tokens to refresh'
      })
    }

    // 检查是否需要刷新 (提前12小时刷新，因为只有每日检查)
    const shouldRefresh = tokenInfo.accessExpiresAt < Date.now() + 12 * 60 * 60 * 1000

    if (shouldRefresh) {
      console.info('Token expires soon, refreshing...')
      await tokenManager.refreshAccessToken(tokenInfo.refreshToken)

      return NextResponse.json({
        success: true,
        message: 'Token refreshed successfully',
        refreshed: true
      })
    } else {
      console.info('Token still valid, no refresh needed')
      return NextResponse.json({
        success: true,
        message: 'Token still valid',
        refreshed: false,
        expiresAt: tokenInfo.accessExpiresAt
      })
    }
  } catch (error) {
    console.error('Scheduled token refresh failed:', error)

    // 发送错误通知 (可选: 集成邮件或Slack通知)
    return NextResponse.json(
      {
        error: 'Token refresh failed',
        details: error.message
      },
      { status: 500 }
    )
  }
}
