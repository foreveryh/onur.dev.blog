'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function EasterEgg({ trigger = 'work hard' }) {
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    let keySequence = ''

    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase()
      keySequence = (keySequence + key).slice(-trigger.length)

      if (keySequence === trigger) {
        setIsActive(true)
        // Auto-hide after 5 seconds
        setTimeout(() => setIsActive(false), 5000)
      }

      // Clear sequence after 3 seconds of inactivity
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        keySequence = ''
      }, 3000)
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [trigger])

  const MatrixRain = () => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const columns = Math.floor(window.innerWidth / 20)

    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 animate-pulse"
            style={{
              left: `${i * 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Array.from({ length: Math.floor(window.innerHeight / 20) }).map((_, j) => (
              <div
                key={j}
                className="font-mono text-sm text-green-400 opacity-80"
                style={{
                  animationDelay: `${j * 0.1}s`
                }}
              >
                {characters[Math.floor(Math.random() * characters.length)]}
              </div>
            ))}
          </div>
        ))}

        {/* Central message */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-center"
          >
            <motion.h1
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-6xl"
            >
              WORK HARD
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-mono text-lg text-green-300"
            >
              The Matrix has you...
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-2 font-mono text-sm text-green-300"
            >
              Building the future, one line of code at a time
            </motion.p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Easter egg hint */}
      <div className="fixed right-4 bottom-4 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-medium">Pro tip:</p>
              <p className="text-xs text-gray-500">
                Try typing "<span className="font-mono font-semibold text-blue-600">{trigger}</span>" for a surprise...
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Matrix rain effect */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MatrixRain />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
