import { FloatingHeader } from '@/components/floating-header'
import { GradientBg4 } from '@/components/gradient-bg'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import { VisualExplorer } from '@/components/visual/visual-explorer'
import { getPageSeo } from '@/lib/contentful'

export default async function VisualPage() {
  return (
    <ScrollArea>
      <GradientBg4 />
      <FloatingHeader title="Visual" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Visual Portfolio" className="lg:hidden" />
          <p className="mb-8 text-gray-600">
            Explore a curated collection of visual works including photography and AI-generated art. Discover creative
            expressions across different mediums and styles.
          </p>
          <VisualExplorer />
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('visual')

  const defaultMeta = {
    title: 'Visual Portfolio - Photography & AI Art',
    description:
      'Explore a curated collection of visual works including photography and AI-generated art. Discover creative expressions across different mediums and styles.',
    openGraph: {
      title: 'Visual Portfolio - Photography & AI Art',
      description:
        'Explore a curated collection of visual works including photography and AI-generated art. Discover creative expressions across different mediums and styles.',
      url: '/visual',
      type: 'website'
    },
    alternates: {
      canonical: '/visual'
    },
    keywords: ['photography', 'AI art', 'visual content', 'creative works', 'gallery', 'digital art', 'portfolio']
  }

  if (!seoData) {
    return defaultMeta
  }

  const seo = seoData.seo || {}
  const { title, description } = seo

  return {
    title: title || defaultMeta.title,
    description: description || defaultMeta.description,
    openGraph: {
      title: title || defaultMeta.openGraph.title,
      description: description || defaultMeta.openGraph.description,
      url: defaultMeta.openGraph.url,
      type: defaultMeta.openGraph.type
    },
    alternates: {
      canonical: defaultMeta.alternates.canonical
    },
    keywords: defaultMeta.keywords
  }
}
