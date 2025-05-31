'use client'

import { useEffect, useState } from 'react'
import { KonamiListener } from '@/lib/konami'

export const EasterEgg = ({ tools = [] }) => {
  const [isActive, setIsActive] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const listener = new KonamiListener(() => {
      startTerminalAnimation()
    })

    listener.start()
    return () => listener.stop()
  }, [tools])

  const startTerminalAnimation = () => {
    setIsActive(true)
    setIsAnimating(true)
    setDisplayText('~/stack $ ls -la\n\n')

    // Collect all tools
    const allTools = tools.flatMap((category) => category.tools || [])

    // Start typing animation with delay
    setTimeout(() => {
      animateTools(allTools)
    }, 500)
  }

  const animateTools = (allTools) => {
    if (!allTools || allTools.length === 0) {
      setDisplayText((prev) => prev + 'No tools found...\n')
      setIsAnimating(false)
      return
    }

    let currentIndex = 0
    const typeNextTool = () => {
      if (currentIndex >= allTools.length) {
        setDisplayText((prev) => prev + '\nDone! Press ESC to close...\n')
        setIsAnimating(false)
        return
      }

      const tool = allTools[currentIndex]
      const toolLine = `${tool.name.padEnd(20)} - ${tool.desc}\n`
      
      setDisplayText((prev) => prev + toolLine)
      currentIndex++

      // Recursive call for next tool
      setTimeout(typeNextTool, 80)
    }

    typeNextTool()
  }

  const closeEasterEgg = () => {
    setIsActive(false)
    setDisplayText('')
    setIsAnimating(false)
  }

  // Listen for ESC key to close
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isActive) {
        closeEasterEgg()
      }
    }

    if (isActive) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={closeEasterEgg}
    >
      <div 
        className="mx-4 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-2xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm text-gray-400">Terminal</span>
            <button
              onClick={closeEasterEgg}
              className="ml-auto text-gray-400 hover:text-white"
              title="Close (ESC)"
            >
              ✕
            </button>
          </div>
          <pre className="max-h-96 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-green-400">
            {displayText}
            {isAnimating && <span className="animate-pulse">▋</span>}
          </pre>
        </div>
      </div>
    </div>
  )
} 