import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

const CACHE_KEY = 'raindrop:bookmarks:cache'

export async function POST() {
  try {
    // 清除缓存
    await kv.del(CACHE_KEY)

    console.log('Bookmarks cache cleared')

    return NextResponse.json({
      success: true,
      message: 'Cache cleared. Next request will fetch fresh data.'
    })
  } catch (error) {
    console.error('Failed to clear bookmarks cache:', error)
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
