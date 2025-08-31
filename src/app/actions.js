'use server'

export async function getBookmarkItemsByPageIndex(id, pageIndex) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bookmarks?collection=${id}&page=${pageIndex}`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch bookmarks:', response.status)
      return { result: false, items: [] }
    }

    const data = await response.json()

    // 兼容原有数据格式
    return {
      result: true,
      items: data || [],
      count: data.length || 0
    }
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return { result: false, items: [] }
  }
}
