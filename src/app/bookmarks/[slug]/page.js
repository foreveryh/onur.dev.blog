import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { BookmarkList } from '@/components/bookmark-list'
import { FloatingHeader } from '@/components/floating-header'
import { PageTitle } from '@/components/page-title'
import { ScreenLoadingSpinner } from '@/components/screen-loading-spinner'
import { ScrollArea } from '@/components/scroll-area'
import { getBookmarkItems, getBookmarks } from '@/lib/raindrop'
import { sortByProperty } from '@/lib/utils'

// 禁用静态生成，使用动态渲染
export const dynamic = 'force-dynamic'

// 注释掉静态生成，因为需要 OAuth2 认证
// export async function generateStaticParams() {
//   try {
//     const bookmarks = await getBookmarks()
//     return bookmarks?.map((bookmark) => ({ slug: bookmark.slug })) || []
//   } catch (error) {
//     console.warn('Unable to generate static params for bookmarks during build:', error.message)
//     return []
//   }
// }

async function fetchData(slug) {
  const bookmarks = await getBookmarks()
  const currentBookmark = bookmarks.find((bookmark) => bookmark.slug === slug)
  if (!currentBookmark) notFound()

  const sortedBookmarks = sortByProperty(bookmarks, 'title')

  try {
    const bookmarkItems = await getBookmarkItems(currentBookmark._id)

    // 验证返回的数据
    if (!bookmarkItems || !bookmarkItems.result) {
      console.error(`Failed to fetch items for collection ${currentBookmark._id}`)
      return {
        bookmarks: sortedBookmarks,
        currentBookmark,
        bookmarkItems: { result: false, items: [], count: 0 }
      }
    }

    return {
      bookmarks: sortedBookmarks,
      currentBookmark,
      bookmarkItems
    }
  } catch (error) {
    console.error(`Error fetching bookmark items: ${error.message}`)
    return {
      bookmarks: sortedBookmarks,
      currentBookmark,
      bookmarkItems: { result: false, items: [], count: 0 }
    }
  }
}

export default async function CollectionPage(props) {
  const params = await props.params
  const { slug } = params
  const { bookmarks, currentBookmark, bookmarkItems } = await fetchData(slug)

  return (
    <ScrollArea className="bg-grid" useScrollAreaId>
      <FloatingHeader
        scrollTitle={currentBookmark.title}
        goBackLink="/bookmarks"
        bookmarks={bookmarks}
        currentBookmark={currentBookmark}
      />
      <div className="content-wrapper">
        <div className="content @container">
          <PageTitle title={currentBookmark.title} />
          <Suspense fallback={<ScreenLoadingSpinner />}>
            <BookmarkList id={currentBookmark._id} initialData={bookmarkItems} collectionSlug={slug} />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata(props) {
  const params = await props.params
  const { slug } = params
  const bookmarks = await getBookmarks()
  const currentBookmark = bookmarks.find((bookmark) => bookmark.slug === slug)
  if (!currentBookmark) return null

  const siteUrl = `/bookmarks/${currentBookmark.slug}`
  const seoTitle = `${currentBookmark.title} | Bookmarks`
  const seoDescription = `A curated selection of various handpicked ${currentBookmark.title.toLowerCase()} bookmarks by 熊布朗 (Peng.G)`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      currentBookmark.title,
      'bookmarks',
      `${currentBookmark.title} bookmarks`,
      'collection',
      `${currentBookmark.title} collection`
    ],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: siteUrl,
      images: siteUrl + '/og.png'
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
