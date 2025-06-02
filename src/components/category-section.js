'use client'

import { motion } from 'framer-motion'

import { ToolCard } from './tool-card'

export const CategorySection = ({ id, name, tools }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  return (
    <motion.section
      className="mb-12 scroll-mt-20"
      id={id}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-2 text-2xl font-bold text-gray-900">{name}</h2>
      </motion.div>

      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" variants={containerVariants}>
        {tools.map((tool, index) => (
          <ToolCard key={tool.slug} tool={tool} index={index} />
        ))}
      </motion.div>
    </motion.section>
  )
}
