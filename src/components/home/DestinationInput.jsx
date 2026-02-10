import { useState } from 'react'

export default function DestinationInput({ onDestinationChange }) {
  const [destination, setDestination] = useState('')

  const handleChange = (e) => {
    setDestination(e.target.value)
    onDestinationChange?.(e.target.value)
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Search icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          {/* Input field */}
          <input
            type="text"
            value={destination}
            onChange={handleChange}
            placeholder="Where to?"
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />

          {/* Clear button - only show when there's text */}
          {destination && (
            <button
              onClick={() => {
                setDestination('')
                onDestinationChange?.('')
              }}
              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
