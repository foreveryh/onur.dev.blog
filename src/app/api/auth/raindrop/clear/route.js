import { NextResponse } from 'next/server'

// 动态选择 token manager
function getTokenManager() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { tokenManager } = require('@/lib/auth/token-manager')
    return tokenManager
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { getTokenManager } = require('@/lib/auth/supabase-token-manager')
    return getTokenManager()
  }
  const { getTokenManager } = require('@/lib/auth/env-token-manager')
  return getTokenManager()
}

export async function POST() {
  try {
    const tokenManager = getTokenManager()
    
    // 不同的token manager可能有不同的清除方法
    if (tokenManager.clearTokens) {
      await tokenManager.clearTokens()
    } else {
      console.warn('Token manager does not support clearing tokens')
    }

    return NextResponse.json({
      success: true,
      message: 'Tokens cleared successfully'
    })
  } catch (error) {
    console.error('Failed to clear tokens:', error)
    return NextResponse.json({ error: 'Failed to clear tokens' }, { status: 500 })
  }
}
