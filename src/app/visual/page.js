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
          <PageTitle title="Visual Explorer" className="lg:hidden" />
          <p className="mb-8 text-gray-600">
            探索精心策划的摄影作品和AI生成的视觉内容集合。发现不同媒介和风格的创意作品。
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
    title: 'Visual - 摄影与AI生成艺术',
    description:
      '探索精心策划的摄影作品和AI生成的视觉内容集合。发现不同媒介和风格的创意作品。',
    openGraph: {
      title: 'Visual - 摄影与AI生成艺术',
      description:
        '探索精心策划的摄影作品和AI生成的视觉内容集合。发现不同媒介和风格的创意作品。',
      url: '/visual',
      type: 'website'
    },
    alternates: {
      canonical: '/visual'
    },
    keywords: ['摄影', 'AI艺术', '视觉内容', '创意作品', '画廊', '数字艺术']
  }

  if (!seoData) {
    return defaultMeta
  }

  const {
    seo: { title, description }
  } = seoData

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