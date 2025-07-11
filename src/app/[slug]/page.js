import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { RichText } from '@/components/contentful/rich-text'
import { FloatingHeader } from '@/components/floating-header'
import { GradientBg } from '@/components/gradient-bg'
import { PageTitle } from '@/components/page-title'
import { ScreenLoadingSpinner } from '@/components/screen-loading-spinner'
import { ScrollArea } from '@/components/scroll-area'
import { getAllPageSlugs, getPage, getPageSeo } from '@/lib/contentful'
import { isDevelopment } from '@/lib/utils'

export async function generateStaticParams() {
  const allPages = await getAllPageSlugs()

  // 排除已有静态页面的路径，防止路由冲突
  const excludedPaths = ['stack', 'workspace', 'journey', 'writing', 'bookmarks', 'visual', 'musings']

  return allPages
    .filter((page) => !page.hasCustomPage) // filter out pages that have custom pages, e.g. /journey
    .filter((page) => !excludedPaths.includes(page.slug)) // 排除静态路径，防止冲突
    .map((page) => ({
      slug: page.slug
    }))
}

async function fetchData(slug) {
  const { isEnabled } = await draftMode()
  const page = await getPage(slug, isDevelopment || isEnabled)
  if (!page) notFound()
  return { page }
}

export default async function PageSlug(props) {
  const params = await props.params
  const { slug } = params
  const {
    page: { title, content }
  } = await fetchData(slug)

  return (
    <ScrollArea useScrollAreaId>
      <GradientBg />
      <FloatingHeader scrollTitle={title} />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title={title} />
          <Suspense fallback={<ScreenLoadingSpinner />}>
            <RichText content={content} />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata(props) {
  const params = await props.params
  const { slug } = params
  const seoData = await getPageSeo(slug)
  if (!seoData) return null

  const seo = seoData.seo || {}
  const { title, description, keywords } = seo
  const siteUrl = `/${slug}`

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: siteUrl,
      images: siteUrl + '/og.png'
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
