'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Plus, Send, X } from 'lucide-react'
import { toast } from 'sonner'

// 创建全局对话框状态 Context
const DialogStateContext = createContext()

export function DialogStateProvider({ children }) {
  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false)
  
  return (
    <DialogStateContext.Provider value={{ isQuickPostOpen, setIsQuickPostOpen }}>
      {children}
    </DialogStateContext.Provider>
  )
}

export function useDialogState() {
  const context = useContext(DialogStateContext)
  if (!context) {
    return { isQuickPostOpen: false, setIsQuickPostOpen: () => {} }
  }
  return context
}

export function QuickPostButton() {
  const { isQuickPostOpen: isOpen, setIsQuickPostOpen: setIsOpen } = useDialogState()
  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState('Public') // 单选：Public/Private
  const [categoryTags, setCategoryTags] = useState(['Daily']) // 复选：分类标签
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 监听对话框状态，在打开时禁用数字快捷键
  useEffect(() => {
    if (isOpen) {
      // 禁用数字快捷键
      const disableKeyPress = (e) => {
        if (e.key >= '1' && e.key <= '8') {
          e.preventDefault()
        }
      }
      window.addEventListener('keydown', disableKeyPress)
      return () => window.removeEventListener('keydown', disableKeyPress)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/musings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: content,
          labels: [visibility, ...categoryTags]
        })
      })

      if (response.ok) {
        toast.success('Musing published successfully!')
        setContent('')
        setVisibility('Public')
        setCategoryTags(['Daily'])
        setIsOpen(false)
        
        // 先触发 git-thoughts 仓库的 GitHub Action 来更新 issues.json
        try {
          const githubToken = process.env.GITHUB_PAT || 'dummy' // 在客户端我们不能直接访问，需要通过 API
          
          toast.info('Updating content...', { duration: 2000 })
          
          // 等待几秒让 GitHub Action 完成
          setTimeout(async () => {
            try {
              const revalidateResponse = await fetch('/api/revalidate?path=/musings', {
                method: 'POST'
              })
              
              if (revalidateResponse.ok) {
                console.info('Page cache revalidated successfully')
                toast.success('Content updated! Refreshing page...')
                // 延迟 1 秒后刷新页面
                setTimeout(() => {
                  window.location.reload()
                }, 1000)
              } else {
                console.error('Failed to revalidate cache, falling back to normal reload')
                window.location.reload()
              }
            } catch (revalidateError) {
              console.error('Revalidate request failed:', revalidateError)
              window.location.reload()
            }
          }, 10000) // 等待 10 秒让 GitHub Action 完成
          
        } catch (error) {
          console.error('GitHub workflow trigger failed:', error)
          // 如果触发失败，直接刷新页面
          window.location.reload()
        }
      } else {
        console.log('Response status:', response.status) // 调试信息
        
        // 针对不同错误提供友好的提示
        if (response.status === 401) {
          console.log('401 error detected, showing auth error toast') // 调试信息
          toast.error('Authentication failed: Please include the correct verification code', {
            description: 'Tip: Add the verification code to your content',
            duration: 5000
          })
        } else if (response.status >= 500) {
          toast.error('Server error, please try again later')
        } else {
          const error = await response.text()
          toast.error(`发布失败: ${error}`)
        }
      }
    } catch (error) {
      toast.error('发布失败，请检查网络连接')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions = [
    'Idea',
    'Quote',
    'Reflection',
    'Daily',
    'Woman',
    'Wealth',
    'Toybox',
    'Wine',
    'Work',
    'Workout',
    'Wisdom'
  ]

  const toggleCategoryTag = (tag) => {
    if (categoryTags.includes(tag)) {
      setCategoryTags(categoryTags.filter((t) => t !== tag))
    } else {
      setCategoryTags([...categoryTags, tag])
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <Plus size={16} />
        New Musing
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create New Musing</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts...&#10;&#10;💡 Remember to include the verification code at the end"
              className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
              rows={6}
              required
            />
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-start">
                <div className="text-xs text-amber-600">
                  <strong>📝 Publishing Note:</strong>{' '}
                  This system uses GitHub Issues as a backend. Please include the verification code at the end of your content. The code will be automatically removed and won't appear in the final published content.
                </div>
              </div>
            </div>
          </div>

                      <div className="mt-4">
            {/* Visibility selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Visibility</label>
              <div className="mt-2 flex gap-2">
                {['Public', 'Private'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setVisibility(option)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      visibility === option
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Category tags selection */}
            <div>
              <label className="text-sm font-medium text-gray-700">Category Tags</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {categoryOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCategoryTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      categoryTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={16} />
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
