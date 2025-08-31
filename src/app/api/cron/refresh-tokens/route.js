import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { tokenManager } from '@/lib/auth/token-manager'

export async function GET() {
  // 验证请求来源 (Vercel Cron 或开发环境)
  const authHeader = headers().get('authorization')
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('Starting daily scheduled token refresh check...')
    
    const tokenInfo = await tokenManager.getTokenInfo()
    
    if (!tokenInfo?.hasTokens) {
      console.log('No tokens found, skipping refresh')
      return NextResponse.json({ 
        success: true, 
        message: 'No tokens to refresh' 
      })
    }

    // 检查是否需要刷新 (提前12小时刷新，因为只有每日检查)
    const shouldRefresh = tokenInfo.expiresAt < Date.now() + (12 * 60 * 60 * 1000)
    
    if (shouldRefresh) {
      console.log('Token expires soon, refreshing...')
      await tokenManager.refreshAccessToken()
      
      return NextResponse.json({ 
        success: true, 
        message: 'Token refreshed successfully',
        refreshed: true
      })
    } else {
      console.log('Token still valid, no refresh needed')
      return NextResponse.json({ 
        success: true, 
        message: 'Token still valid',
        refreshed: false,
        expiresAt: tokenInfo.expiresAt
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