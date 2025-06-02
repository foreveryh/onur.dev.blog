import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('resource_type:image AND folder:visual')
      .max_results(20)
      .execute()
    
    const images = result.resources.map((r) => ({
      public_id: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      aspect_ratio: r.width && r.height ? r.width / r.height : 1.5,
      format: r.format,
      created_at: r.created_at,
      folder: r.asset_folder
    }))
    
    return new Response(JSON.stringify({ ok: true, images }), {
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