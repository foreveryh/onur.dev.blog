import Link from 'next/link'

export function TagFilter({ tags, selectedTag }) {
  if (tags.length === 0) return null

  return (
    <div className="mb-4 border-b border-gray-100 pb-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/musings"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            !selectedTag
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          All
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/musings?tag=${encodeURIComponent(tag)}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              selectedTag === tag
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  )
}
