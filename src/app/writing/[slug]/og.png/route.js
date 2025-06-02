import { draftMode } from 'next/headers'
import { ImageResponse } from 'next/og'

import { sharedMetadata } from '@/app/shared-metadata'
import { OpenGraphImage } from '@/components/og-image'
import { getAllPostSlugs, getWritingSeo } from '@/lib/contentful'
import { getBoldFont, getRegularFont } from '@/lib/fonts'
import { isDevelopment } from '@/lib/utils'

export const dynamic = 'force-static'

export const size = {
  width: sharedMetadata.ogImage.width,
  height: sharedMetadata.ogImage.height
}

export async function generateStaticParams() {
  const allPosts = await getAllPostSlugs()
  return allPosts.map((post) => ({ slug: post.slug }))
}

export async function GET(_, props) {
  const params = await props.params
  const { isEnabled } = await draftMode()
  const { slug } = params

  try {
    const [seoData, regularFontData, boldFontData] = await Promise.all([
      getWritingSeo(slug, isDevelopment ? true : isEnabled),
      getRegularFont(),
      getBoldFont()
    ])

    if (!seoData || !seoData.seo) {
      // Return a default OG image for posts that don't have SEO data
      return new ImageResponse(<OpenGraphImage title="Blog Post" description="by 熊布朗 (Peng.G)" url="writing" />, {
        ...size,
        fonts: [
          {
            name: 'Geist Sans',
            data: regularFontData,
            style: 'normal',
            weight: 400
          },
          {
            name: 'Geist Sans',
            data: boldFontData,
            style: 'normal',
            weight: 500
          }
        ]
      })
    }

    const {
      seo: { title, ogImageTitle, ogImageSubtitle }
    } = seoData

    return new ImageResponse(
      (
        <OpenGraphImage
          title={ogImageTitle || title}
          description={ogImageSubtitle || 'by 熊布朗 (Peng.G)'}
          url="writing"
        />
      ),
      {
        ...size,
        fonts: [
          {
            name: 'Geist Sans',
            data: regularFontData,
            style: 'normal',
            weight: 400
          },
          {
            name: 'Geist Sans',
            data: boldFontData,
            style: 'normal',
            weight: 500
          }
        ]
      }
    )
  } catch (error) {
    console.error('Error generating OG image for slug:', slug, error)

    // Return a simple fallback OG image if everything fails
    const [regularFontData, boldFontData] = await Promise.all([getRegularFont(), getBoldFont()])

    return new ImageResponse(<OpenGraphImage title="Blog Post" description="by 熊布朗 (Peng.G)" url="writing" />, {
      ...size,
      fonts: [
        {
          name: 'Geist Sans',
          data: regularFontData,
          style: 'normal',
          weight: 400
        },
        {
          name: 'Geist Sans',
          data: boldFontData,
          style: 'normal',
          weight: 500
        }
      ]
    })
  }
}
