import { Suspense } from 'react'
import RaindropSetupContent from './RaindropSetupContent'

export const metadata = {
  title: 'Raindrop Setup - Admin',
  description: 'Configure Raindrop.io OAuth authentication'
}

export default function RaindropSetupPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <RaindropSetupContent />
      </Suspense>
    </div>
  )
}