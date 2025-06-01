'use client'

import { motion } from 'framer-motion'

export function HardwareList({ items }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'laptop':
        return '💻'
      case 'display':
        return '🖥️'
      case 'input':
        return '⌨️'
      case 'audio':
        return '🎧'
      case 'lighting':
        return '💡'
      default:
        return '⚙️'
    }
  }

  return (
    <div className="space-y-8">
      {/* Desk Image Placeholder */}
      <div className="flex justify-center">
        <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
          {/* Placeholder for desk image */}
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-4xl">🏠</div>
              <p className="text-sm text-gray-500">Desk setup photo</p>
              <p className="text-xs text-gray-400">Coming soon...</p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20" />
          <div className="absolute bottom-4 left-4 h-6 w-6 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Hardware List */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-base">
                {getCategoryIcon(item.category)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                <p className="truncate text-xs text-gray-600">{item.detail}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 