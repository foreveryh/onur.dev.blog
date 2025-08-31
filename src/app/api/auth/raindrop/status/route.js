import { NextResponse } from 'next/server'

import { tokenManager } from '@/lib/auth/token-manager'

export async function GET() {
  try {
    const tokenInfo = await tokenManager.getTokenInfo()

    if (!tokenInfo) {
      return NextResponse.json({ hasTokens: false })
    }

    return NextResponse.json(tokenInfo)
  } catch (error) {
    console.error('Failed to get token status:', error)
    return NextResponse.json({ error: 'Failed to get token status' }, { status: 500 })
  }
}
