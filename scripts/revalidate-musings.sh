#!/bin/bash

# 碎碎念页面ISR缓存重新验证脚本
# 当GitHub Issues更新但博客没有显示新内容时使用

DOMAIN=${1:-"https://me.deeptoai.com"}
SECRET=${2:-""}

echo "🔄 重新验证碎碎念页面缓存..."
echo "🌐 域名: $DOMAIN"

# 构建URL
if [ -n "$SECRET" ]; then
    URL="$DOMAIN/api/revalidate?path=/musings&secret=$SECRET"
else
    URL="$DOMAIN/api/revalidate?path=/musings"
fi

# 调用API
RESPONSE=$(curl -s -X POST "$URL")
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL")

echo "📡 API响应状态: $STATUS_CODE"
echo "📄 响应内容: $RESPONSE"

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ 碎碎念页面缓存重新验证成功！"
    echo "🌍 请访问 $DOMAIN/musings 查看最新内容"
else
    echo "❌ 重新验证失败，状态码: $STATUS_CODE"
    exit 1
fi 