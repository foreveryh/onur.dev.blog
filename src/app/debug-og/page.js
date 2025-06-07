import { sharedMetadata } from '@/app/shared-metadata'

export default function DebugOG() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://me.deeptoai.com'

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-2xl font-bold">Open Graph Debug Information</h1>

      <div className="grid gap-6">
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Current Configuration</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Site URL:</strong> {siteUrl}
            </p>
            <p>
              <strong>Title:</strong> {sharedMetadata.title}
            </p>
            <p>
              <strong>Description:</strong> {sharedMetadata.description}
            </p>
            <p>
              <strong>OG Image Size:</strong> {sharedMetadata.ogImage.width}x{sharedMetadata.ogImage.height}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Generated URLs</h2>
          <div className="space-y-2 text-sm break-all">
            <p>
              <strong>OG Image URL:</strong> {siteUrl}/opengraph-image
            </p>
            <p>
              <strong>Visual OG Image:</strong> {siteUrl}/visual/opengraph-image
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Test Tools</h2>
          <div className="space-y-2">
            <a
              href={`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(siteUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Test with Twitter Card Validator
            </a>
            <br />
            <a
              href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(siteUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Test with Facebook Debugger
            </a>
          </div>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Preview</h2>
          <img src="/opengraph-image" alt="OG Image Preview" className="max-w-md rounded border" />
        </div>
      </div>
    </div>
  )
}
