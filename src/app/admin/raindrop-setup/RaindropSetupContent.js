'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RaindropSetupContent() {
  const searchParams = useSearchParams()
  const [tokenInfo, setTokenInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const success = searchParams.get('success')

  useEffect(() => {
    fetchTokenInfo()
  }, [])

  const fetchTokenInfo = async () => {
    try {
      const response = await fetch('/api/auth/raindrop/status')
      if (response.ok) {
        const info = await response.json()
        setTokenInfo(info)
      }
    } catch (error) {
      console.error('Failed to fetch token info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearTokens = async () => {
    if (!confirm('确定要清除所有认证信息吗？这将需要重新授权。')) return

    try {
      const response = await fetch('/api/auth/raindrop/clear', { method: 'POST' })
      if (response.ok) {
        setTokenInfo(null)
        alert('认证信息已清除')
      }
    } catch (error) {
      console.error('Failed to clear tokens:', error)
      alert('清除失败')
    }
  }

  if (loading) {
    return <div className="text-center">加载中...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Raindrop.io 设置</h1>
        <p className="mt-2 text-gray-600">配置 Raindrop.io OAuth 认证以启用自动同步书签功能</p>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">OAuth 设置成功！</h3>
              <p className="mt-1 text-sm text-green-700">Raindrop.io 认证已完成，书签同步功能现已启用。</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium">认证状态</h2>

        {tokenInfo?.hasTokens ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="font-medium text-green-700">已认证</span>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Token 过期时间:</strong> {new Date(tokenInfo.expiresAt).toLocaleString()}
              </p>
              <p>
                <strong>上次刷新:</strong> {new Date(tokenInfo.lastRefreshed).toLocaleString()}
              </p>
              <p>
                <strong>状态:</strong>
                <span className={`ml-1 ${tokenInfo.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {tokenInfo.isExpired ? '已过期 (将自动刷新)' : '有效'}
                </span>
              </p>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={handleClearTokens}
                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                清除认证信息
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="font-medium text-red-700">未认证</span>
            </div>

            <p className="text-gray-600">需要完成 Raindrop.io OAuth 认证才能启用书签自动同步功能。</p>

            <Link
              href="/api/auth/raindrop"
              className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              开始 OAuth 认证
            </Link>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-blue-800">设置说明</h3>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• 首次设置需要到 Raindrop.io 完成 OAuth 授权</li>
          <li>• Token 将自动刷新，无需手动维护</li>
          <li>• 所有认证信息都经过加密存储</li>
          <li>• 如遇问题可清除认证信息后重新设置</li>
        </ul>
      </div>
    </div>
  )
}
