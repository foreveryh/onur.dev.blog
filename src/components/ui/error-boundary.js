'use client'

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

export function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-900 text-white" role="alert">
          <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
          <p className="mt-2 text-zinc-400">An unexpected error occurred. Please try again.</p>
          <pre className="mt-4 max-w-2xl overflow-auto rounded-md bg-zinc-800 p-4 text-sm whitespace-pre-wrap text-red-400">
            {error.message}
          </pre>
          <button
            onClick={resetErrorBoundary}
            className="mt-6 rounded-md bg-zinc-700 px-4 py-2 text-white transition-colors hover:bg-zinc-600"
          >
            Try again
          </button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  )
}
