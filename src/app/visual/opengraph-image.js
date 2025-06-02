import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Visual - Photography & AI Generated Art'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              margin: '0 0 24px 0',
              background: 'linear-gradient(45deg, #ffffff, #888888)',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Visual Explorer
          </h1>
          <p
            style={{
              fontSize: '32px',
              margin: '0',
              color: '#cccccc',
              maxWidth: '800px'
            }}
          >
            Photography & AI Generated Art Collection
          </p>
        </div>
      </div>
    ),
    {
      ...size
    }
  )
} 