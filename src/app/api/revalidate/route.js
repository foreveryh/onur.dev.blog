import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { CONTENT_TYPES } from '@/lib/constants'

export const dynamic = 'auto' // https://www.reddit.com/r/nextjs/comments/14iu6td/revalidatepath_not_updating_generatestaticparams/

const secret = `${process.env.NEXT_REVALIDATE_SECRET}`

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const manualSecret = searchParams.get('secret')
    const path = searchParams.get('path')
    
    // 如果是手动重新验证特定路径（如 /musings）
    if (manualSecret || path) {
      // 验证密钥（可选，增加安全性）
      if (process.env.REVALIDATE_SECRET && manualSecret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
      }
      
      const pathToRevalidate = path || '/musings'
      revalidatePath(pathToRevalidate)
      
      return NextResponse.json({ 
        message: `Path ${pathToRevalidate} revalidated successfully`,
        timestamp: new Date().toISOString()
      })
    }

    // 原有的 Contentful webhook 处理逻辑
    const payload = await request.json()
    const requestHeaders = new Headers(request.headers)
    const revalidateSecret = requestHeaders.get('x-revalidate-secret')
    
    if (revalidateSecret !== secret) {
      return Response.json(
        {
          revalidated: false,
          now: Date.now(),
          message: 'Invalid secret'
        },
        { status: 401 }
      )
    }

    // Handle both manual API calls and Contentful webhook payload
    let contentTypeId, slug

    if (payload.contentTypeId) {
      // Manual API call format
      contentTypeId = payload.contentTypeId
      slug = payload.slug
    } else if (payload.sys && payload.sys.contentType) {
      // Contentful webhook format
      contentTypeId = payload.sys.contentType.sys.id
      slug = payload.fields?.slug?.['en-US'] || payload.fields?.slug
    } else {
      return Response.json(
        {
          revalidated: false,
          now: Date.now(),
          message: 'Invalid payload format'
        },
        { status: 400 }
      )
    }

    switch (contentTypeId) {
      case CONTENT_TYPES.PAGE:
        if (slug) {
          revalidatePath(`/${slug}`)
        } else {
          return Response.json(
            {
              revalidated: false,
              now: Date.now(),
              message: 'Missing page slug to revalidate'
            },
            { status: 400 }
          )
        }
        break
      case CONTENT_TYPES.POST:
        if (slug) {
          revalidatePath(`/writing/${slug}`)
          revalidatePath('/writing')
          revalidatePath('/') // Also revalidate homepage when blog posts change
        } else {
          return Response.json(
            {
              revalidated: false,
              now: Date.now(),
              message: 'Missing writing slug to revalidate'
            },
            { status: 400 }
          )
        }
        break
      case CONTENT_TYPES.LOGBOOK:
        revalidatePath('/journey')
        break
      default:
        return Response.json(
          {
            revalidated: false,
            now: Date.now(),
            message: 'Invalid content type'
          },
          { status: 400 }
        )
    }

    return Response.json({ revalidated: true, now: Date.now() })

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to revalidate',
    examples: [
      'POST /api/revalidate?path=/musings',
      'POST /api/revalidate (with Contentful webhook payload)'
    ]
  })
}
