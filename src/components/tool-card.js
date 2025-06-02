'use client'

import { motion } from 'framer-motion'
import { ArrowUpRightIcon } from 'lucide-react'
import Image from 'next/image'

export const ToolCard = ({ tool, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    }
  }

  const getToolIcon = (slug) => {
    return `/tools/${slug}.svg`
  }

  const getTagColor = (tag) => {
    const colors = {
      AI: 'bg-purple-100 text-purple-700',
      Prod: 'bg-blue-100 text-blue-700',
      Dev: 'bg-green-100 text-green-700',
      Notes: 'bg-orange-100 text-orange-700',
      Deploy: 'bg-cyan-100 text-cyan-700',
      Infra: 'bg-gray-100 text-gray-700',
      Framework: 'bg-indigo-100 text-indigo-700',
      CSS: 'bg-pink-100 text-pink-700',
      LLM: 'bg-violet-100 text-violet-700',
      Image: 'bg-teal-100 text-teal-700',
      Design: 'bg-rose-100 text-rose-700',
      Proto: 'bg-amber-100 text-amber-700',
      Productivity: 'bg-emerald-100 text-emerald-700',
      Launcher: 'bg-sky-100 text-sky-700',
      Music: 'bg-red-100 text-red-700',
      Security: 'bg-slate-100 text-slate-700'
    }
    return colors[tag] || 'bg-gray-100 text-gray-700'
  }

  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.05,
        boxShadow: '0 8px 24px rgba(0,0,0,.12)',
        height: 'auto'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div className="thumbnail-shadow relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/90">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <motion.div
              className="relative size-10 flex-shrink-0"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={getToolIcon(tool.slug)}
                alt={`${tool.name} icon`}
                width={40}
                height={40}
                className="rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="absolute inset-0 hidden items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-lg">
                🛠️
              </div>
            </motion.div>
            <h3 className="text-sm leading-tight font-semibold text-gray-900">{tool.name}</h3>
          </div>
          <motion.div whileHover={{ x: 2, y: -2 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
            <ArrowUpRightIcon
              size={16}
              className="text-gray-400 transition-colors duration-200 group-hover:text-gray-600"
            />
          </motion.div>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{tool.desc}</p>

        <motion.div
          className="mb-2 flex flex-wrap gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
        >
          {tool.tags.map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTagColor(tag)}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: index * 0.1 + 0.4 + tagIndex * 0.05,
                duration: 0.2,
                type: 'spring',
                stiffness: 300
              }}
              whileHover={{ scale: 1.05 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Peel-Up Tip */}
        {tool.tip && (
          <motion.div
            className="absolute inset-x-0 bottom-0 border-t border-gray-100/50 bg-gradient-to-t from-white/95 to-transparent px-4 py-3 text-xs text-gray-500 opacity-0 backdrop-blur-sm"
            whileHover={{
              opacity: 1
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
          >
            {tool.tip}
          </motion.div>
        )}
      </motion.div>
    </motion.a>
  )
}
