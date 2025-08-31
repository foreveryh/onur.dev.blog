#!/usr/bin/env node

/**
 * 部署验证脚本 - 检查OAuth2系统是否正确配置
 */

async function verifyEnvironmentVariables() {
  const requiredVars = [
    'RAINDROP_CLIENT_ID',
    'RAINDROP_CLIENT_SECRET',
    'RAINDROP_ENCRYPTION_KEY',
    'NEXT_PUBLIC_BASE_URL'
  ]

  const missing = []
  const present = []

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName)
    } else {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    return false
  }

  return true
}

function detectStorageType() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return 'vercel-kv'
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return 'supabase'
  }

  return 'environment'
}

async function testTokenManager() {
  try {
    let getTokenManager
    const storageType = detectStorageType()

    switch (storageType) {
      case 'vercel-kv':
        ;({ getTokenManager } = await import('../src/lib/auth/token-manager.js'))
        break
      case 'supabase':
        ;({ getTokenManager } = await import('../src/lib/auth/supabase-token-manager.js'))
        break
      default:
        ;({ getTokenManager } = await import('../src/lib/auth/env-token-manager.js'))
    }

    const tokenManager = getTokenManager()

    tokenManager.getCredentials()

    const tokenInfo = await tokenManager.getStoredTokenInfo()
    if (!tokenInfo) {
      return false
    }

    const now = Date.now()
    const refreshExpired = tokenInfo.refreshExpiresAt < now

    if (refreshExpired) {
      return false
    }

    return true
  } catch {
    return false
  }
}

async function testApiEndpoint() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/bookmarks`)

    if (response.ok) {
      await response.json()
    } else {
      return false
    }

    return true
  } catch {
    return false
  }
}

async function main() {
  const checks = [
    { name: '环境变量', test: verifyEnvironmentVariables },
    { name: 'Token Manager', test: testTokenManager },
    { name: 'API 端点', test: testApiEndpoint }
  ]

  let allPassed = true

  for (const check of checks) {
    const passed = await check.test()
    if (!passed) {
      allPassed = false
    }
  }

  if (!allPassed) {
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

