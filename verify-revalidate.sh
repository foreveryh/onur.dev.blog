#!/bin/bash

# 简化的Revalidate API验证脚本
# 使用方法: ./verify-revalidate.sh https://yoursite.vercel.app

SECRET="R5SIkzrbOocVTaBngWP8tRN3ESUljZAUvf/fhk0/rMI="
SITE_URL=${1:-"https://me.deeptoai.com"}

echo "🔄 Verifying Revalidate API at: $SITE_URL"
echo ""

# 测试1: 重新验证特定博客文章
echo "🧪 Testing: Revalidate specific blog post"
response=$(curl -s -o /tmp/response.json -w "%{http_code}" \
  -X POST "$SITE_URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $SECRET" \
  -d '{"contentTypeId": "post", "slug": "my-first-test-blog"}')

echo "📥 HTTP Status: $response"
echo "📥 Response Body:"
cat /tmp/response.json
echo ""

if [ "$response" = "200" ]; then
  echo "✅ API is working correctly!"
else
  echo "❌ API test failed. Status: $response"
fi

echo ""
echo "💡 Manual test commands:"
echo ""
echo "Revalidate a specific post:"
echo "curl -X POST '$SITE_URL/api/revalidate' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-revalidate-secret: $SECRET' \\"
echo "  -d '{\"contentTypeId\": \"post\", \"slug\": \"your-post-slug\"}'"
echo ""
echo "Revalidate journey page:"
echo "curl -X POST '$SITE_URL/api/revalidate' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-revalidate-secret: $SECRET' \\"
echo "  -d '{\"contentTypeId\": \"logbook\"}'"

# 清理临时文件
rm -f /tmp/response.json 