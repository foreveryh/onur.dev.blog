import { NextResponse } from 'next/server'
import { tokenManager } from '@/lib/auth/token-manager'

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ error: 'OAuth authorization failed' }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 })
  }

  try {
    const clientId = process.env.RAINDROP_CLIENT_ID
    const clientSecret = process.env.RAINDROP_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    if (!clientId || !clientSecret) {
      throw new Error('Missing RAINDROP_CLIENT_ID or RAINDROP_CLIENT_SECRET')
    }

    // 交换授权码获取访问令牌
    const tokenResponse = await fetch(`${RAINDROP_API_URL}/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${baseUrl}/api/auth/raindrop/callback`
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      throw new Error(`Token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token || !tokenData.refresh_token) {
      throw new Error('Invalid token response')
    }

    // 存储令牌到 KV
    await tokenManager.storeInitialTokens(
      tokenData.access_token,
      tokenData.refresh_token,
      tokenData.expires_in || 1209600 // 默认14天
    )

    // 验证令牌是否工作
    const testResponse = await fetch(`${RAINDROP_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })

    if (!testResponse.ok) {
      throw new Error('Token validation failed')
    }

    const userInfo = await testResponse.json()
    console.log('OAuth setup completed for user:', userInfo.user?.fullName)

    // 重定向到成功页面
    return NextResponse.redirect(`${baseUrl}/admin/raindrop-setup?success=true`)

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: 'Failed to complete OAuth setup', details: error.message }, 
      { status: 500 }
    )
  }
}