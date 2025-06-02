import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { ClientOnly } from '@/components/client-only'
import { RichText } from '@/components/contentful/rich-text'
import { FloatingHeader } from '@/components/floating-header'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import { WritingViews } from '@/components/writing-views'
import { getAllPostSlugs, getPost, getWritingSeo } from '@/lib/contentful'
import { getDateTimeFormat, isDevelopment } from '@/lib/utils'

export async function generateStaticParams() {
  const allPosts = await getAllPostSlugs()
  if (!allPosts || allPosts.length === 0) {
    return []
  }

  return allPosts.filter((post) => post && post.slug).map((post) => ({ slug: post.slug }))
}

async function fetchData(slug) {
  const { isEnabled } = await draftMode()
  const data = await getPost(slug, isDevelopment ? true : isEnabled)
  if (!data) notFound()

  // Ensure required data structure exists with comprehensive fallbacks
  const title = data.title || 'Untitled'
  const safeData = {
    title,
    date: data.date || null,
    seo: data.seo || { title, description: '', ogImageTitle: title, ogImageSubtitle: '' },
    content: data.content || { json: null },
    sys: data.sys || {
      firstPublishedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }
  }

  return {
    data: safeData
  }
}

export default async function WritingSlug(props) {
  const params = await props.params
  const { slug } = params
  const { data } = await fetchData(slug)

  const { title, date, seo = {}, content, sys = {} } = data

  const { firstPublishedAt, publishedAt: updatedAt } = sys
  const { title: seoTitle, description: seoDescription } = seo

  const postDate = date || firstPublishedAt
  const dateString = getDateTimeFormat(postDate)
  const datePublished = new Date(postDate).toISOString()
  const dateModified = new Date(updatedAt).toISOString()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seoTitle,
    description: seoDescription,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: '熊布朗 (Peng.G)'
    },
    url: `https://me.deeptoai.com/writing/${slug}`
  }

  return (
    <>
      <ScrollArea className="bg-white" useScrollAreaId>
        <FloatingHeader scrollTitle={title} goBackLink="/writing">
          <WritingViews slug={slug} />
        </FloatingHeader>
        <div className="content-wrapper @container/writing">
          <article className="content">
            <PageTitle
              title={title}
              subtitle={
                <time dateTime={postDate} className="text-gray-400">
                  {dateString}
                </time>
              }
              className="mb-6 flex flex-col gap-3"
            />
            <RichText content={content} />
          </article>
        </div>
      </ScrollArea>
      <ClientOnly>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />
      </ClientOnly>
    </>
  )
}

export async function generateMetadata(props) {
  const params = await props.params
  const { slug } = params
  const seoData = await getWritingSeo(slug)
  if (!seoData) {
    return {
      title: 'Blog Post',
      description: 'A blog post by 熊布朗 (Peng.G)'
    }
  }

  const { date, seo = {}, sys = {} } = seoData

  const { firstPublishedAt, publishedAt: updatedAt } = sys
  const { title, description, keywords } = seo

  const siteUrl = `/writing/${slug}`
  const postDate = date || firstPublishedAt
  const publishedTime = new Date(postDate).toISOString()
  const modifiedTime = new Date(updatedAt).toISOString()

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      ...(updatedAt && {
        modifiedTime
      }),
      url: siteUrl,
      images: siteUrl + '/og.png'
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
