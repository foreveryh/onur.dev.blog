#!/usr/bin/env node

/**
 * 部署验证脚本 - 检查OAuth2系统是否正确配置
 */

async function verifyEnvironmentVariables() {
  console.log('🔍 检查环境变量配置...\n')
  
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
  
  console.log('✅ 已配置的环境变量:')
  present.forEach(name => console.log(`   ${name}`))
  
  if (missing.length > 0) {
    console.log('\n❌ 缺失的环境变量:')
    missing.forEach(name => console.log(`   ${name}`))
    return false
  }
  
  console.log('\n✅ 所有必需的环境变量都已配置')
  return true
}

function detectStorageType() {
  console.log('\n🔍 检查存储配置...\n')
  
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    console.log('✅ 检测到 Vercel KV 存储配置')
    return 'vercel-kv'
  }
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('✅ 检测到 Supabase 存储配置')
    return 'supabase'
  }
  
  console.log('ℹ️  使用环境变量存储方案 (备用)')
  if (process.env.RAINDROP_ENCRYPTED_REFRESH_TOKEN) {
    console.log('✅ 检测到已加密的 refresh token')
  } else {
    console.log('⚠️  未检测到加密的 refresh token，需要先完成 OAuth 认证')
  }
  
  return 'environment'
}

async function testTokenManager() {
  console.log('\n🔍 测试 Token Manager...\n')
  
  try {
    // 动态导入对应的 token manager
    let getTokenManager
    const storageType = detectStorageType()
    
    switch (storageType) {
      case 'vercel-kv':
        ({ getTokenManager } = await import('../src/lib/auth/token-manager.js'))
        break
      case 'supabase':
        ({ getTokenManager } = await import('../src/lib/auth/supabase-token-manager.js'))
        break
      default:
        ({ getTokenManager } = await import('../src/lib/auth/env-token-manager.js'))
    }
    
    const tokenManager = getTokenManager()
    
    // 测试获取凭据
    const credentials = tokenManager.getCredentials()
    console.log('✅ OAuth 凭据配置正确')
    console.log(`   Client ID: ${credentials.clientId?.slice(0, 8)}...`)
    
    // 测试获取存储的 token 信息
    const tokenInfo = await tokenManager.getStoredTokenInfo()
    if (tokenInfo) {
      console.log('✅ 检测到存储的 token 信息')
      console.log(`   Access Token 过期时间: ${new Date(tokenInfo.accessExpiresAt).toLocaleString()}`)
      console.log(`   Refresh Token 过期时间: ${new Date(tokenInfo.refreshExpiresAt).toLocaleString()}`)
      
      const now = Date.now()
      const accessExpired = tokenInfo.accessExpiresAt < now
      const refreshExpired = tokenInfo.refreshExpiresAt < now
      
      if (accessExpired && !refreshExpired) {
        console.log('⚠️  Access token 已过期，但 refresh token 仍有效')
      } else if (refreshExpired) {
        console.log('❌ Refresh token 已过期，需要重新进行 OAuth 认证')
        return false
      } else {
        console.log('✅ 所有 tokens 都在有效期内')
      }
    } else {
      console.log('⚠️  未检测到存储的 token 信息，需要先完成 OAuth 认证')
      return false
    }
    
    return true
  } catch (error) {
    console.error('❌ Token Manager 测试失败:', error.message)
    return false
  }
}

async function testApiEndpoint() {
  console.log('\n🔍 测试 API 端点...\n')
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/bookmarks`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Bookmarks API 响应正常')
      console.log(`   返回 ${data.length || 0} 个书签`)
    } else {
      console.log(`❌ Bookmarks API 返回错误: ${response.status}`)
      return false
    }
    
    return true
  } catch (error) {
    console.error('❌ API 端点测试失败:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 开始验证 Raindrop.io OAuth2 系统部署...\n')
  
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
  
  console.log('\n' + '='.repeat(50))
  
  if (allPassed) {
    console.log('🎉 所有检查都通过了！系统已准备就绪。')
    console.log('\n📝 下一步操作:')
    console.log('   1. 如果是首次部署，访问 /admin/oauth-setup 完成 OAuth 认证')
    console.log('   2. 验证书签页面正常工作')
    console.log('   3. 检查 Cron job 是否正确配置')
  } else {
    console.log('❌ 部分检查失败，请根据上述信息修复问题。')
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}