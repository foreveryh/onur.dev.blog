'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import { WritingLink } from '@/components/writing-link'
import { useViewData } from '@/hooks/useViewData'
import { cn } from '@/lib/utils'

export const WritingListLayout = ({ list, isMobile }) => {
  const { viewData, error } = useViewData()
  const pathname = usePathname()

  const memoizedList = useMemo(() => {
    return list.map((post) => {
      const viewCount = viewData?.find((item) => item.slug === post.slug)?.view_count
      const isActive = pathname === `/writing/${post.slug}`

      return <WritingLink key={post.slug} post={post} viewCount={viewCount} isMobile={isMobile} isActive={isActive} />
    })
  }, [list, viewData, pathname, isMobile])

  return (
    <div className={cn(!isMobile && 'flex flex-col gap-1 text-sm')}>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">
          <p>Error loading view counts: {error}</p>
        </div>
      )}
      {memoizedList}
    </div>
  )
}
