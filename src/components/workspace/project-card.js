'use client'

import { motion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'

export function ProjectCard({ title, tagline, status, stack, link, startDate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Building':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Planned':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all duration-200"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{tagline}</p>
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
        {startDate && (
          <span className="text-xs text-gray-500">Started {formatDate(startDate)}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {stack.map((tech, index) => (
          <span
            key={index}
            className="inline-flex rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 transition-colors group-hover:bg-gray-100"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50/0 to-indigo-50/0 opacity-0 transition-opacity duration-200 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 group-hover:opacity-100" />
    </motion.div>
  )
} 