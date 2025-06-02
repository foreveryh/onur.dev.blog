import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET() {
  try {
    // 搜索图片和视频内容
    const [imageResult, videoResult] = await Promise.all([
      cloudinary.search
        .expression('resource_type:image AND folder:visual')
        .with_field('context')
        .with_field('metadata')
        .max_results(50)
        .execute(),
      cloudinary.search
        .expression('resource_type:video AND folder:visual')
        .with_field('context')
        .with_field('metadata')
        .max_results(50)
        .execute()
    ])

    // 处理图片
    const images = imageResult.resources.map((r) => {
      // 从元数据或context中获取分类信息
      const categoryData = r.metadata?.category || r.context?.category || ['photograph']
      const category = Array.isArray(categoryData) ? categoryData[0] : categoryData
      
      // 根据用户的分类系统映射到前端分类
      let sourceType = 'photography'
      let mediaType = 'image'
      
      if (category === 'ai_photo') {
        sourceType = 'aigc'
        mediaType = 'image'
      } else if (category === 'photograph') {
        sourceType = 'photography'
        mediaType = 'image'
      }

      return {
        public_id: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        aspect_ratio: r.width && r.height ? r.width / r.height : 1.5,
        format: r.format,
        created_at: r.created_at,
        folder: r.asset_folder,
        mediaType,
        sourceType,
        category,
        title: r.metadata?.title || r.context?.title || '',
        description: r.metadata?.description || r.context?.description || ''
      }
    })

    // 处理视频
    const videos = videoResult.resources.map((r) => {
      // 从元数据或context中获取分类信息
      const categoryData = r.metadata?.category || r.context?.category || ['video']
      const category = Array.isArray(categoryData) ? categoryData[0] : categoryData
      
      // 根据用户的分类系统映射到前端分类
      let sourceType = 'photography'
      let mediaType = 'video'
      
      if (category === 'ai_video') {
        sourceType = 'aigc'
        mediaType = 'video'
      } else if (category === 'video' || category === 'photograph') {
        sourceType = 'photography'
        mediaType = 'video'
      }

      return {
        public_id: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        aspect_ratio: r.width && r.height ? r.width / r.height : 16 / 9,
        format: r.format,
        created_at: r.created_at,
        folder: r.asset_folder,
        mediaType,
        sourceType,
        category,
        duration: r.duration,
        title: r.metadata?.title || r.context?.title || '',
        description: r.metadata?.description || r.context?.description || ''
      }
    })

    // 合并所有媒体内容
    const allMedia = [...images, ...videos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return new Response(JSON.stringify({ ok: true, media: allMedia }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message, stack: e.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
