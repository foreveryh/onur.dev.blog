import { FloatingHeader } from '@/components/floating-header'
import { GradientBg5 } from '@/components/gradient-bg'
import { MusingsList } from '@/components/musings-list'
import { PageTitle } from '@/components/page-title'
import { QuickPostButton } from '@/components/quick-post-button'
import { ScrollArea } from '@/components/scroll-area'

async function getMusings() {
  try {
    // 首先尝试从GitHub获取真实数据
    const response = await fetch('https://raw.githubusercontent.com/foreveryh/git-thoughts/main/public/issues.json', {
      next: { revalidate: 86400 } // 24小时重新验证 (86400秒)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const musings = await response.json()
    return musings
  } catch (error) {
    console.error('Failed to fetch musings from GitHub:', error)

    // 如果GitHub数据获取失败，在开发环境中使用测试数据作为fallback
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const testDataPath = path.join(process.cwd(), 'public', 'test-musings.json')
        const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'))
        console.info('Using test data as fallback')
        return testData
      } catch (testError) {
        console.error('Failed to load test data:', testError)
      }
    }
    
    return null
  }
}

export default async function MusingsPage({ searchParams }) {
  const musings = await getMusings()
  const params = await searchParams
  const selectedTag = params?.tag

  if (musings === null) {
    return (
      <ScrollArea useScrollAreaId>
        <GradientBg5 />
        <FloatingHeader scrollTitle="Musings" />
        <div className="content-wrapper">
          <div className="content">
            <PageTitle title="Musings" className="lg:hidden" />
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-gray-600">Thoughts and reflections powered by GitHub Issues</p>
                <p className="text-xs text-gray-500 mt-1">
                  Learn more about this implementation: <a href="https://github.com/foreveryh/git-thoughts" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">git-thoughts</a>
                </p>
              </div>
              <QuickPostButton />
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h2 className="font-semibold text-red-800">Unable to Load Content</h2>
              <p className="mt-1 text-sm text-red-700">Sorry, unable to fetch the latest musings. Please try again later.</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea useScrollAreaId>
      <GradientBg5 />
      <FloatingHeader scrollTitle="Musings" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Musings" className="lg:hidden" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600">Thoughts and reflections powered by GitHub Issues</p>
              <p className="mt-1 text-xs text-gray-500">
                Learn more about this implementation:{' '}
                <a
                  href="https://github.com/foreveryh/git-thoughts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  git-thoughts
                </a>
              </p>
            </div>
            <QuickPostButton />
          </div>

          <MusingsList musings={musings} selectedTag={selectedTag} />
        </div>
      </div>
    </ScrollArea>
  )
}

export const metadata = {
  title: 'Musings',
  description: 'Thoughts and reflections powered by GitHub Issues'
}

// 确保页面使用 ISR
export const revalidate = 86400 // 24小时
