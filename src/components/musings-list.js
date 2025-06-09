'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import Link from 'next/link'
import { Clock, ExternalLink, Tag } from 'lucide-react'

import { TagFilter } from './tag-filter'

function MusingCard({ musing }) {
  const date = new Date(musing.created_at)
  const formattedDate = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // 处理换行符，将单个\n转换为markdown的强制换行
  const processedBody = useMemo(() => {
    if (!musing.body) return ''
    return musing.body
      .replace(/\n/g, '  \n') // 在每个\n前添加两个空格，创建markdown强制换行
      .trim()
  }, [musing.body])

  return (
    <article className="group relative mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md hover:shadow-orange-50">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-pink-50/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content container */}
      <div className="relative z-10">
        {/* Header with date and source link */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <time dateTime={musing.created_at} className="font-medium">
              {formattedDate}
            </time>
          </div>
          <Link
            href={musing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-orange-100 hover:text-orange-700"
          >
            <ExternalLink size={12} />
            <span>Source</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="prose prose-gray prose-sm max-w-none leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>{processedBody}</ReactMarkdown>
        </div>

        {/* Tags */}
        {musing.tags && musing.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {musing.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:from-orange-100 hover:to-pink-100 hover:text-gray-800"
              >
                <Tag size={10} className="text-gray-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function MusingsList({ musings, selectedTag }) {
  // 提取所有唯一标签
  const allTags = useMemo(() => {
    const tags = new Set()
    musings.forEach((musing) => {
      if (musing.tags) {
        musing.tags.forEach((tag) => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [musings])

  // Filter musings based on selected tag
  const filteredMusings = useMemo(() => {
    if (!selectedTag) return musings
    return musings.filter((musing) => musing.tags && musing.tags.includes(selectedTag))
  }, [musings, selectedTag])

  return (
    <div>
      <TagFilter tags={allTags} selectedTag={selectedTag} />

      <div className="mt-6">
        {filteredMusings.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No musings found matching the selected criteria</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredMusings.map((musing) => (
              <MusingCard key={musing.id} musing={musing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
