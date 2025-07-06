'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { useMemo, useState, useEffect, useRef } from 'react'
import { Clock, ExternalLink, Tag } from 'lucide-react'

import { TagFilter } from './tag-filter'

function MusingCard({ musing }) {
  const [expanded, setExpanded] = useState(false)
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

  // 判断内容是否超出最大高度（用于显示遮罩和按钮），如有图片则强制折叠
  const hasImage = /!\[.*?\]\(.*?\)/.test(processedBody)
  const contentRef = useRef(null)
  const [isOverflow, setIsOverflow] = useState(false)
  useEffect(() => {
    if (hasImage && !expanded) {
      setIsOverflow(true)
    } else if (contentRef.current && !expanded) {
      setIsOverflow(contentRef.current.scrollHeight > 500)
    } else {
      setIsOverflow(false)
    }
  }, [expanded, processedBody, hasImage])

  return (
    <article className="group relative border-b border-gray-100 py-4 transition-colors hover:bg-gray-50/50">
      {/* Content container */}
      <div className="relative">
        {/* Header with date and source link */}
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
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
            className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <ExternalLink size={12} />
            <span>Source</span>
          </Link>
        </div>

        {/* Main content with fold/expand */}
        <div
          className="prose prose-gray prose-sm relative max-w-none leading-relaxed"
          style={!expanded ? { maxHeight: 500, overflow: 'hidden', transition: 'max-height 0.3s' } : {}}
          ref={contentRef}
        >
          <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{processedBody}</ReactMarkdown>
          {/* 渐变遮罩 */}
          {!expanded && isOverflow && (
            <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        {/* 展开/收起按钮 */}
        {isOverflow && (
          <div className="mt-2 flex justify-center">
            <button
              className="z-10 rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-xs font-medium text-gray-600 shadow transition hover:bg-gray-100 hover:text-blue-600"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? '收起' : '展开全部'}
            </button>
          </div>
        )}

        {/* Tags */}
        {musing.tags && musing.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {musing.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                <Tag size={10} className="text-gray-400" />
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

      <div className="mt-4">
        {filteredMusings.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No musings found matching the selected criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMusings.map((musing) => (
              <MusingCard key={musing.id} musing={musing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
