import { CategorySection } from '@/components/category-section'
import { EasterEgg } from '@/components/easter-egg'
import { FloatingHeader } from '@/components/floating-header'
import { GradientBg4 } from '@/components/gradient-bg'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import toolsData from '@/data/tools.json'
import { getPageSeo } from '@/lib/contentful'

export default async function StackPage() {
  return (
    <ScrollArea>
      <GradientBg4 />
      <FloatingHeader title="Stack" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Stack" />

          <div className="mb-8">
            <p className="leading-relaxed text-gray-600">
              Here's my curated collection of daily tools, from development essentials to productivity boosters. Each
              tool has been battle-tested in real workflows and genuinely improves my output.
            </p>
            <p className="mt-2 text-sm text-gray-500">💡 Pro tip: Try the ↑ ↑ ↓ ↓ ← → ← → sequence...</p>
          </div>

          {toolsData.categories.map((category) => (
            <CategorySection key={category.id} id={category.id} name={category.name} tools={category.tools} />
          ))}

          <EasterEgg tools={toolsData.categories} />
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('stack')
  if (!seoData) {
    return {
      title: 'Stack',
      description: 'My curated collection of daily tools and productivity boosters',
      openGraph: {
        title: 'Stack',
        description: 'My curated collection of daily tools and productivity boosters',
        url: '/stack'
      },
      alternates: {
        canonical: '/stack'
      }
    }
  }

  const {
    seo: { title, description }
  } = seoData
  const siteUrl = '/stack'

  return {
    title: title || 'Stack',
    description: description || 'My curated collection of daily tools and productivity boosters',
    openGraph: {
      title: title || 'Stack',
      description: description || 'My curated collection of daily tools and productivity boosters',
      url: siteUrl
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
