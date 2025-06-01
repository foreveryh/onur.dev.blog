'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Timeline({ entries }) {
  const [expandedItems, setExpandedItems] = useState(new Set())

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'development':
        return 'bg-blue-100 text-blue-800'
      case 'deployment':
        return 'bg-green-100 text-green-800'
      case 'research':
        return 'bg-purple-100 text-purple-800'
      case 'optimization':
        return 'bg-orange-100 text-orange-800'
      case 'bugfix':
        return 'bg-red-100 text-red-800'
      case 'enhancement':
        return 'bg-indigo-100 text-indigo-800'
      case 'content':
        return 'bg-pink-100 text-pink-800'
      case 'documentation':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
      
      <div className="space-y-4">
        {entries.map((entry, index) => {
          const isExpanded = expandedItems.has(index)
          const hasDetails = entry.details && entry.details.trim().length > 0
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-16"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-2 h-4 w-4 rounded-full border-4 border-white bg-blue-500 shadow-sm" />
              
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <time className="text-sm font-medium text-gray-900">
                        {formatDate(entry.date)}
                      </time>
                      {entry.category && (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                  </div>
                  
                  {hasDetails && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                
                <AnimatePresence>
                  {isExpanded && hasDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 overflow-hidden"
                    >
                      <p className="text-sm text-gray-600">{entry.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 