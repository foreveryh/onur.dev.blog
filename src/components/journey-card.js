import dynamic from 'next/dynamic'
import { memo } from 'react'

const MarkdownRenderer = dynamic(() => import('@/components/markdown-renderer').then((mod) => mod.MarkdownRenderer))

export const JourneyCard = memo(({ title, description, image, index }) => {
  // Convert backslash line breaks to markdown line breaks
  const processedDescription = description?.replace(/\\\s*/g, '  \n')

  return (
    <div className="word-break-word flex flex-col">
      <span className="mb-px font-semibold tracking-tight">{title}</span>
      {processedDescription && <MarkdownRenderer className="text-sm">{processedDescription}</MarkdownRenderer>}
      {image?.url && (
        <div className="mt-2.5 overflow-hidden rounded-xl bg-white">
          <img
            src={image.url}
            alt={image.title || image.description}
            width={image.width}
            height={image.height}
            loading={index < 1 ? 'eager' : 'lazy'}
            className="animate-reveal"
            // eslint-disable-next-line react/no-unknown-property
            nopin="nopin"
          />
        </div>
      )}
    </div>
  )
})
JourneyCard.displayName = 'JourneyCard'
