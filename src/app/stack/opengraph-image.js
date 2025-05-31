import { OpenGraphImage } from '@/components/og-image'
import { getPageSeo } from '@/lib/contentful'

export const runtime = 'edge'
export const alt = '工具集'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  let title = '工具集'
  let description = '我日常使用的工具集合'

  try {
    const seoData = await getPageSeo('stack')
    if (seoData?.seo) {
      title = seoData.seo.title || title
      description = seoData.seo.description || description
    }
  } catch (error) {
    console.error('Error loading Stack SEO data:', error)
  }

  return OpenGraphImage({ 
    title, 
    description, 
    icon: <span style={{ fontSize: '3rem' }}>🛠️</span>,
    url: 'stack'
  })
} 