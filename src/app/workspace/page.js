import { FloatingHeader } from '@/components/floating-header'
import { GradientBg4 } from '@/components/gradient-bg'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import { PERSONAL_SPACE_SECTIONS } from '@/lib/constants'
import { getPageSeo } from '@/lib/contentful'

export default async function Workspace() {
  return (
    <ScrollArea>
      <GradientBg4 />
      <FloatingHeader title="我的空间" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="我的空间" />

          <div className="mb-8">
            <p className="leading-relaxed text-gray-600">
              这里是我的个人空间，记录着我的阅读、观影、旅行和工具使用体验。
              每一个推荐都经过深思熟虑，希望能给你带来一些启发。
            </p>
          </div>

          {Object.entries(PERSONAL_SPACE_SECTIONS).map(([sectionKey, section]) => (
            <div key={sectionKey} className="mb-12">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {section.items.map((item, index) => (
                  <div key={index} className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="text-sm text-gray-500">{item.year}</span>
                    </div>

                    <div className="mb-2">
                      {item.author && <p className="text-sm text-gray-600">作者: {item.author}</p>}
                      {item.director && <p className="text-sm text-gray-600">导演: {item.director}</p>}
                      {item.country && <p className="text-sm text-gray-600">国家: {item.country}</p>}
                      {item.category && <p className="text-sm text-gray-600">分类: {item.category}</p>}
                    </div>

                    <div className="mb-2">
                      <span className="text-sm">{item.rating}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-700">{item.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 rounded-lg bg-gray-50 p-6">
            <p className="text-center text-gray-600">
              这些推荐会持续更新，如果你有好的建议，欢迎{' '}
              <a href="mailto:your-email@example.com" className="text-blue-600 hover:underline">
                联系我
              </a>{' '}
              分享！
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('workspace')
  if (!seoData) {
    return {
      title: '我的空间',
      description: '我的个人空间，记录着阅读、观影、旅行和工具使用体验',
      openGraph: {
        title: '我的空间',
        description: '我的个人空间，记录着阅读、观影、旅行和工具使用体验',
        url: '/workspace'
      },
      alternates: {
        canonical: '/workspace'
      }
    }
  }

  const {
    seo: { title, description }
  } = seoData
  const siteUrl = '/workspace'

  return {
    title: title || '我的空间',
    description: description || '我的个人空间，记录着阅读、观影、旅行和工具使用体验',
    openGraph: {
      title: title || '我的空间',
      description: description || '我的个人空间，记录着阅读、观影、旅行和工具使用体验',
      url: siteUrl
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
