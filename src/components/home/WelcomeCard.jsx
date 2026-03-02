import { useState } from 'react'

export default function WelcomeCard({ onSignUp }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="relative bg-gradient-to-br from-brand to-brand-dark rounded-3xl p-5 text-white overflow-hidden">
      {/* decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />

      {/* dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* icon */}
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
        </svg>
      </div>

      <h2 className="text-lg font-bold mb-1.5">Welcome to AirTrack! 👋</h2>
      <p className="text-sm text-white/80 mb-4 leading-relaxed">
        Understand the air quality of your daily commutes, runs, and walks — and find cleaner routes. Creating your free account takes under 10 seconds.
      </p>

      <button
        onClick={onSignUp}
        className="w-full bg-white text-brand font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors"
      >
        Create free account →
      </button>
    </div>
  )
}
