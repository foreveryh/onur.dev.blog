import '@/globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { EyeIcon } from 'lucide-react'
import { draftMode } from 'next/headers'
import Script from 'next/script'

import { sharedMetadata } from '@/app/shared-metadata'
import { MenuContent } from '@/components/menu-content'
import { SideMenu } from '@/components/side-menu'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { PROFILES } from '@/lib/constants'
import { preloadGetAllPosts } from '@/lib/contentful'

export const fetchCache = 'default-cache'

export default async function RootLayout({ children }) {
  const { isEnabled } = await draftMode()
  preloadGetAllPosts(isEnabled)

  return (
    <html
      lang="en"
      data-theme="light"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <main vaul-drawer-wrapper="" className="min-h-screen bg-white">
          {isEnabled && (
            <div className="absolute inset-x-0 bottom-0 z-50 flex h-12 w-full items-center justify-center bg-green-500 text-center text-sm font-medium text-white">
              <div className="flex items-center gap-2">
                <EyeIcon size={16} />
                <span>Draft mode is enabled</span>
              </div>
            </div>
          )}
          <div className="lg:flex">
            <SideMenu className="relative hidden lg:flex">
              <MenuContent />
            </SideMenu>
            <div className="flex flex-1">{children}</div>
          </div>
        </main>
        <TailwindIndicator />
        <SpeedInsights />
        <Script
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host={process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_HOST}
          data-token={process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://me.deeptoai.com'),
  robots: {
    index: true,
    follow: true
  },
  title: {
    default: sharedMetadata.title,
    template: `%s — ${sharedMetadata.title}`
  },
  description: sharedMetadata.description,
  keywords: ['熊布朗', 'Peng.G', 'me.deeptoai.com'],
  openGraph: {
    title: {
      default: sharedMetadata.title,
      template: `%s — ${sharedMetadata.title}`
    },
    description: sharedMetadata.description,
    alt: sharedMetadata.title,
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://me.deeptoai.com',
    siteName: sharedMetadata.title,
    locale: 'en_IE',
    images: [
      {
        url: '/opengraph-image',
        width: sharedMetadata.ogImage.width,
        height: sharedMetadata.ogImage.height,
        alt: sharedMetadata.title
      }
    ]
  },
  alternates: {
    canonical: '/'
  },
  twitter: {
    card: 'summary_large_image',
    site: `@${PROFILES.twitter.username}`,
    creator: `@${PROFILES.twitter.username}`,
    images: ['/opengraph-image']
  },
  other: {
    pinterest: 'nopin'
  }
}

export const viewport = {
  themeColor: 'white',
  colorScheme: 'only light',
  width: 'device-width',
  initialScale: 1
}
