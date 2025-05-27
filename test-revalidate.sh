#!/bin/bash

# Revalidate API测试脚本
SECRET="R5SIkzrbOocVTaBngWP8tRN3ESUljZAUvf/fhk0/rMI="
BASE_URL=${1:-"http://localhost:3000"}

echo "🚀 Testing Revalidate API at: $BASE_URL"
echo "🔑 Using secret: ${SECRET:0:10}..."
echo ""

# 测试1: 错误的密钥
echo "🧪 Test 1: Invalid Secret"
response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
  -X POST "$BASE_URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: wrong-secret" \
  -d '{"contentTypeId": "post", "slug": "test-blog"}')

http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed -E 's/HTTP_STATUS:[0-9]*$//')

echo "📥 Status: $http_status"
echo "📥 Response: $response_body"
if [ "$http_status" = "401" ]; then
  echo "✅ Test 1 PASSED"
else
  echo "❌ Test 1 FAILED (expected 401)"
fi
echo ""

# 测试2: 重新验证博客文章
echo "🧪 Test 2: Valid Post Revalidation"
response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
  -X POST "$BASE_URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $SECRET" \
  -d '{"contentTypeId": "post", "slug": "my-first-test-blog"}')

http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed -E 's/HTTP_STATUS:[0-9]*$//')

echo "📥 Status: $http_status"
echo "📥 Response: $response_body"
if [ "$http_status" = "200" ]; then
  echo "✅ Test 2 PASSED"
else
  echo "❌ Test 2 FAILED (expected 200)"
fi
echo ""

# 测试3: 重新验证页面
echo "🧪 Test 3: Page Revalidation"
response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
  -X POST "$BASE_URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $SECRET" \
  -d '{"contentTypeId": "page", "slug": "stack"}')

http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed -E 's/HTTP_STATUS:[0-9]*$//')

echo "📥 Status: $http_status"
echo "📥 Response: $response_body"
if [ "$http_status" = "200" ]; then
  echo "✅ Test 3 PASSED"
else
  echo "❌ Test 3 FAILED (expected 200)"
fi
echo ""

# 测试4: 重新验证journey页面
echo "🧪 Test 4: Journey Revalidation"
response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
  -X POST "$BASE_URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $SECRET" \
  -d '{"contentTypeId": "logbook"}')

http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo $response | sed -E 's/HTTP_STATUS:[0-9]*$//')

echo "📥 Status: $http_status"
echo "📥 Response: $response_body"
if [ "$http_status" = "200" ]; then
  echo "✅ Test 4 PASSED"
else
  echo "❌ Test 4 FAILED (expected 200)"
fi
echo ""

echo "📊 All tests completed!"
echo ""
echo "💡 Usage examples:"
echo "   Revalidate specific post: curl -X POST $BASE_URL/api/revalidate -H 'x-revalidate-secret: $SECRET' -H 'Content-Type: application/json' -d '{\"contentTypeId\": \"post\", \"slug\": \"your-blog-slug\"}'"
echo "   Revalidate journey page: curl -X POST $BASE_URL/api/revalidate -H 'x-revalidate-secret: $SECRET' -H 'Content-Type: application/json' -d '{\"contentTypeId\": \"logbook\"}'" 