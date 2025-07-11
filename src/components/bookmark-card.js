import { Link2Icon, Tag } from 'lucide-react'
import dynamic from 'next/dynamic'

const TweetCard = dynamic(() => import('@/components/tweet-card/tweet-card').then((mod) => mod.TweetCard))
import { TWEETS_COLLECTION_IDS } from '@/lib/constants'

export const BookmarkCard = ({ bookmark, order }) => {
  if (bookmark.link && TWEETS_COLLECTION_IDS.includes(bookmark.collectionId)) {
    const match = bookmark.link.match(/\/status\/(\d+)/) ?? []
    const tweetId = match[1]
    return <TweetCard id={tweetId} />
  }

  return (
    <a
      key={bookmark._id}
      className="thumbnail-shadow flex aspect-auto min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-xl bg-white p-4 transition-colors duration-300 hover:bg-gray-100"
      href={`${bookmark.link}?ref=me.deeptoai.com`}
      target="_blank"
      rel="noopener noreferrer"
      data-bookmark-order={order}
    >
      <span className="aspect-1200/630 overflow-hidden rounded-lg">
        <img
          src={bookmark.cover || '/assets/fallback.avif'}
          alt={bookmark.title}
          width={1200}
          height={630}
          loading={order < 2 ? 'eager' : 'lazy'}
          className="animate-reveal aspect-1200/630 rounded-lg border bg-cover bg-center bg-no-repeat object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = '/assets/fallback.avif'
          }}
          // eslint-disable-next-line react/no-unknown-property
          nopin="nopin"
        />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="line-clamp-4 text-lg leading-snug">{bookmark.title}</h2>
        <span className="line-clamp-4 inline-flex items-center gap-1 text-sm text-gray-500">
          <Link2Icon size={16} />
          {bookmark.domain}
        </span>
        <span className="line-clamp-6 text-sm">{bookmark.excerpt || bookmark.note}</span>

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bookmark.tags.map((tag) => (
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
    </a>
  )
}
