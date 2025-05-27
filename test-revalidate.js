#!/usr/bin/env node

const SECRET = 'R5SIkzrbOocVTaBngWP8tRN3ESUljZAUvf/fhk0/rMI='

// 测试函数
async function testRevalidateAPI(baseUrl, testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`)
  console.log(`📤 Request: ${testCase.method} ${baseUrl}/api/revalidate`)
  console.log(`📋 Payload: ${JSON.stringify(testCase.payload, null, 2)}`)
  
  try {
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': testCase.useSecret ? SECRET : 'wrong-secret'
      },
      body: JSON.stringify(testCase.payload)
    })
    
    const result = await response.json()
    
    console.log(`📥 Response Status: ${response.status}`)
    console.log(`📥 Response Body: ${JSON.stringify(result, null, 2)}`)
    
    if (response.status === testCase.expectedStatus) {
      console.log(`✅ Test PASSED`)
    } else {
      console.log(`❌ Test FAILED (expected status ${testCase.expectedStatus}, got ${response.status})`)
    }
    
    return { success: response.status === testCase.expectedStatus, result }
  } catch (error) {
    console.log(`❌ Test FAILED with error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

// 测试用例
const testCases = [
  {
    name: 'Invalid Secret',
    payload: { contentTypeId: 'post', slug: 'test-blog' },
    useSecret: false,
    expectedStatus: 401
  },
  {
    name: 'Valid Post Revalidation',
    payload: { contentTypeId: 'post', slug: 'my-first-test-blog' },
    useSecret: true,
    expectedStatus: 200
  },
  {
    name: 'Post without Slug (should revalidate /writing)',
    payload: { contentTypeId: 'post' },
    useSecret: true,
    expectedStatus: 400  // API requires slug for posts
  },
  {
    name: 'Page Revalidation',
    payload: { contentTypeId: 'page', slug: 'stack' },
    useSecret: true,
    expectedStatus: 200
  },
  {
    name: 'Journey Revalidation',
    payload: { contentTypeId: 'logbook' },
    useSecret: true,
    expectedStatus: 200
  },
  {
    name: 'Invalid Content Type',
    payload: { contentTypeId: 'invalid' },
    useSecret: true,
    expectedStatus: 400
  }
]

// 主测试函数
async function runTests() {
  const baseUrl = process.argv[2] || 'http://localhost:3000'
  
  console.log(`🚀 Testing Revalidate API at: ${baseUrl}`)
  console.log(`🔑 Using secret: ${SECRET.substring(0, 10)}...`)
  
  let passed = 0
  let total = testCases.length
  
  for (const testCase of testCases) {
    const result = await testRevalidateAPI(baseUrl, testCase)
    if (result.success) passed++
    
    // 等待一下，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log(`🎉 All tests passed! Your revalidate API is working correctly.`)
  } else {
    console.log(`⚠️  Some tests failed. Please check the API implementation.`)
  }
}

// 运行测试
runTests().catch(console.error) 