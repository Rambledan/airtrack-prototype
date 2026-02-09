import { useState } from 'react'

export default function SplashScreen({ onContinue }) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleContinue = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onContinue()
    }, 300)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-brand via-brand to-brand-dark flex flex-col items-center justify-center transition-opacity duration-300 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* Logo on white pill for contrast */}
        <div className="animate-fade-in-up mb-8">
          <div className="bg-white rounded-2xl px-8 py-5 shadow-xl shadow-black/10">
            <img
              src="/airtrack-logo.svg"
              alt="AirTrack"
              className="h-10"
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="animate-fade-in-up animation-delay-100 text-xl text-white/90 font-medium mb-4">
          Breathe smarter. Live better.
        </p>
        <p className="animate-fade-in-up animation-delay-200 text-sm text-white/70 max-w-xs leading-relaxed mb-12">
          Track your air quality exposure throughout the day and discover cleaner routes and times.
        </p>

        {/* Features preview */}
        <div className="animate-fade-in-up animation-delay-300 flex items-center gap-6 mb-16">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="text-xs text-white/70">Track</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" />
              </svg>
            </div>
            <span className="text-xs text-white/70">Forecast</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="text-xs text-white/70">Optimize</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="animate-fade-in-up animation-delay-400 w-full max-w-xs bg-white text-brand font-semibold py-4 px-8 rounded-2xl shadow-xl shadow-black/20 hover:bg-white/95 active:scale-[0.98] transition-all"
        >
          Get Started
        </button>

        {/* Terms note */}
        <p className="animate-fade-in-up animation-delay-500 text-xs text-white/50 mt-6 max-w-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
