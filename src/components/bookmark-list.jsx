'use client'

import { ArrowDownIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { getBookmarkItemsByPageIndex } from '@/app/actions'
import { BookmarkCard } from '@/components/bookmark-card'
import { Button } from '@/components/ui/button'
import { TWEETS_COLLECTION_ID } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const BookmarkList = ({ initialData, id }) => {
  const [data, setData] = useState(initialData?.result ? initialData?.items : [])
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = () => {
    if (!isReachingEnd && !isLoading) setPageIndex((prevPageIndex) => prevPageIndex + 1)
  }

  const fetchInfiniteData = useCallback(async () => {
    setIsLoading(true)
    const newData = await getBookmarkItemsByPageIndex(id, pageIndex)
    if (newData.result) setData((prevData) => [...prevData, ...newData.items])
    setIsLoading(false)
  }, [id, pageIndex])

  useEffect(() => {
    if (pageIndex > 0) fetchInfiniteData()
  }, [pageIndex, fetchInfiniteData])

  const getChunks = useCallback(() => {
    const firstChunk = []
    const lastChunk = []
    data.forEach((element, index) => {
      if (index % 2 === 0) {
        firstChunk.push(element)
      } else {
        lastChunk.push(element)
      }
    })
    return [[...firstChunk], [...lastChunk]]
  }, [data])

  const chunks = useMemo(() => getChunks(), [getChunks])
  const isReachingEnd = data.length >= (initialData?.count ?? 0)
  const isTweetCollection = id === TWEETS_COLLECTION_ID

  const memoizedBookmarks = useMemo(() => {
    return data.map((bookmark, bookmarkIndex) => (
      <div
        key={`bookmark_${bookmarkIndex}`}
        className={cn('grid gap-4', isTweetCollection ? 'h-fit' : 'place-content-start')}
        data-oid="_ac5zr9"
      >
        <BookmarkCard key={bookmark._id} bookmark={bookmark} order={bookmarkIndex} data-oid="a_dbf0w" />
      </div>
    ))
  }, [data, isTweetCollection])

  const memoizedChunks = useMemo(() => {
    return chunks.map((chunk, chunkIndex) => (
      <div
        key={`chunk_${chunkIndex}`}
        className={cn('grid gap-4', isTweetCollection ? 'h-fit' : 'place-content-start')}
        data-oid=".ziw:pz"
      >
        {chunk.map((bookmark, bookmarkIndex) => (
          <BookmarkCard key={bookmark._id} bookmark={bookmark} order={bookmarkIndex} data-oid="id5qgbd" />
        ))}
      </div>
    ))
  }, [chunks, isTweetCollection])

  return (
    <div data-oid="by35:gv">
      <div className="flex flex-col gap-4 @lg:hidden" data-oid="_8hk2vb">
        {memoizedBookmarks}
      </div>
      <div className="hidden @lg:grid @lg:grid-cols-2 @lg:gap-4" data-oid="x-gszvo">
        {memoizedChunks}
      </div>
      {data.length > 0 ? (
        <div className="mt-8 flex min-h-16 items-center justify-center text-sm lg:mt-12" data-oid="9aeljtt">
          {!isReachingEnd ? (
            <>
              {isLoading ? (
                <div
                  className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent text-black"
                  role="status"
                  aria-label="loading"
                  data-oid="xdu1x5t"
                >
                  <span className="sr-only" data-oid="ym1.98w">
                    Loading...
                  </span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full justify-center bg-white"
                  data-oid="6:4ugol"
                >
                  Load more
                  <ArrowDownIcon size={16} data-oid="8a661-e" />
                </Button>
              )}
            </>
          ) : (
            <span data-oid="u5.o:zp">That's all for now. Come back later for more.</span>
          )}
        </div>
      ) : (
        <div className="mt-8 flex min-h-16 flex-col items-center justify-center lg:mt-12" data-oid="2-uromr">
          <span data-oid="h_8_v5a">No bookmarks found.</span>
        </div>
      )}
    </div>
  )
}
