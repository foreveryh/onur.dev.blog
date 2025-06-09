import { FloatingHeader } from '@/components/floating-header'
import { GradientBg4 } from '@/components/gradient-bg'
import { PageTitle } from '@/components/page-title'
import { ScrollArea } from '@/components/scroll-area'
import { EasterEgg } from '@/components/workspace/easter-egg'
import { HardwareList } from '@/components/workspace/hardware-list'
import { NowTag } from '@/components/workspace/now-tag'
import { ProjectCard } from '@/components/workspace/project-card'
import { Timeline } from '@/components/workspace/timeline'
import hardwareData from '@/data/workspace/hardware.json'
import logData from '@/data/workspace/log.json'
import nowData from '@/data/workspace/now.json'
import projectsData from '@/data/workspace/projects.json'
import { getPageSeo } from '@/lib/contentful'

export default async function Workspace() {
  return (
    <ScrollArea>
      <GradientBg4 />
      <FloatingHeader title="Workspace" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Workspace" />

          {/* Introduction */}
          <div className="mb-12">
            <p className="mb-4 text-lg leading-relaxed text-gray-600">
              Welcome to my digital workspace. This is where I document my journey as a developer, researcher, and
              builder. Here you'll find insights into my current projects, work philosophy, and the tools that power my
              daily workflow.
            </p>
            <p className="leading-relaxed text-gray-600">
              I believe in transparency, continuous learning, and sharing knowledge. Every project tells a story, every
              tool serves a purpose, and every line of code brings us closer to solving meaningful problems.
            </p>
          </div>

          {/* Current Focus */}
          <section className="mb-20">
            <NowTag projects={nowData} />
          </section>

          {/* Active Projects */}
          <section className="mb-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Active Projects</h2>
            <p className="mb-8 text-gray-600">
              A collection of projects I'm currently working on, from research experiments to production applications.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projectsData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>

          {/* Work Log */}
          <section className="mb-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Work Log</h2>
            <p className="mb-8 text-gray-600">
              A chronological record of my recent work, achievements, and milestones. Click on any entry to see more
              details.
            </p>
            <Timeline entries={logData} />
          </section>

          {/* Desk Setup */}
          <section className="mb-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">My Desk Setup</h2>
            <p className="mb-8 text-gray-600">
              The hardware and tools that make up my daily development environment. Quality tools enable quality work.
            </p>
            <HardwareList items={hardwareData} />
          </section>

          {/* Footer note */}
          <div className="mt-16 rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-gray-600">
              This workspace is constantly evolving. Check back regularly for updates on new projects, tools, and
              insights from my development journey.
            </p>
          </div>
        </div>
      </div>

      {/* Easter Egg */}
      <EasterEgg trigger="work hard" />
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('workspace')

  const defaultMeta = {
    title: 'Workspace - Developer Portfolio & Projects',
    description:
      'Explore my digital workspace featuring current projects, development workflow, tools, and insights from my journey as a developer and researcher.',
    openGraph: {
      title: 'Workspace - Developer Portfolio & Projects',
      description:
        'Explore my digital workspace featuring current projects, development workflow, tools, and insights from my journey as a developer and researcher.',
      url: '/workspace',
      type: 'website'
    },
    alternates: {
      canonical: '/workspace'
    },
    keywords: ['developer workspace', 'projects', 'development workflow', 'coding tools', 'software development']
  }

  if (!seoData) {
    return defaultMeta
  }

  // 安全解构，避免 seo 为 undefined 或 null 时出错
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
