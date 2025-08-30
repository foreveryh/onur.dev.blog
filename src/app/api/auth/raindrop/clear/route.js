import { NextResponse } from 'next/server'
import { tokenManager } from '@/lib/auth/token-manager'

export async function POST() {
  try {
    await tokenManager.clearTokens()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tokens cleared successfully' 
    })
  } catch (error) {
    console.error('Failed to clear tokens:', error)
    return NextResponse.json(
      { error: 'Failed to clear tokens' }, 
      { status: 500 }
    )
  }
}