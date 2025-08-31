import { Feed } from 'feed'

import { getBookmarkItems, getBookmarks } from '@/lib/raindrop-with-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const bookmarks = await getBookmarks()
    if (!bookmarks || bookmarks.length === 0) {
      return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Bookmarks unavailable</title></channel></rss>', {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
      })
    }
  const date = new Date()
  const siteURL = 'https://me.deeptoai.com'
  const author = {
    name: 'Onur Şuyalçınkaya',
    link: 'https://onur.dev'
  }

  const feed = new Feed({
    title: `Bookmarks RSS feed by ${author.name}`,
    description: 'Stay up to date with my latest selection of various handpicked bookmarks',
    id: siteURL,
    link: `${siteURL}/bookmarks`,
    language: 'en',
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    author,
    feedLinks: {
      rss2: `${siteURL}/bookmarks/rss.xml`
    }
  })

  const bookmarkList = []
  for (const bookmark of bookmarks) {
    const bookmarkItems = await getBookmarkItems(bookmark._id)
    const { items = [] } = bookmarkItems ?? {}

    items?.slice(0, 10).forEach((bookmark) => {
      bookmarkList.push({
        id: bookmark._id,
        guid: bookmark._id,
        title: bookmark.title,
        link: bookmark.link,
        description: bookmark.excerpt,
        content: bookmark.excerpt,
        image: bookmark.cover,
        date: new Date(bookmark.created),
        updated: new Date(bookmark.lastUpdate),
        author: [author],
        contributor: [author]
      })
    })
  }

  const sortedBookmarks = bookmarkList.sort(
    (a, b) => new Date(b.updated || b.created) - new Date(a.updated || a.created)
  )
  sortedBookmarks.forEach((bookmark) => {
    feed.addItem({ ...bookmark })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  })
  } catch (error) {
    console.error('Bookmarks RSS generation failed:', error)
    return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Bookmarks RSS Error</title></channel></rss>', {
      status: 500,
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
    })
  }
}
