'use client'

import { ClockIcon } from 'lucide-react'

export function NowTag({ projects }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <ClockIcon className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">Currently Working On</span>
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className={index > 0 ? 'border-t border-blue-100 pt-4' : ''}>
              <h2 className="mb-2 text-xl font-bold text-gray-900">{project.project}</h2>

              {project.description && <p className="mb-3 max-w-2xl text-gray-600">{project.description}</p>}

              <div className="flex items-center text-sm text-gray-500">
                <span>Since {formatDate(project.since)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 translate-x-4 -translate-y-4 rounded-full bg-blue-100 opacity-30" />
      <div className="absolute right-8 bottom-0 h-20 w-20 translate-y-4 rounded-full bg-indigo-100 opacity-40" />
    </div>
  )
}
