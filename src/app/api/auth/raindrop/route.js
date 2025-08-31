import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.RAINDROP_CLIENT_ID
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  if (!clientId) {
    return NextResponse.json({ error: 'Missing RAINDROP_CLIENT_ID' }, { status: 500 })
  }

  // 构建 OAuth2 授权 URL
  const authUrl = new URL('https://raindrop.io/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/raindrop/callback`)
  authUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(authUrl.toString())
}
