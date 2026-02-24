import { useState } from 'react'
import TrackingStatusWidget from './TrackingStatusWidget'
import LiveForecast from '../forecast/LiveForecast'
import { useUser } from '../../contexts/UserContext'

// ---------- Welcome card (shown to anonymous visitors only) ----------
function WelcomeCard({ onSignUp }) {
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

// ---------- Premium promo card (shown to anonymous visitors at the bottom) ----------
function PremiumPromoCard({ onUpgrade }) {
  const HIGHLIGHTS = [
    'Automatic background activity tracking',
    'Suggested cleaner routes and times',
    'Personal exposure analytics & daily summaries',
  ]

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">AirTrack Premium</span>
        </div>
        <span className="text-xs text-gray-500 font-medium">from £6.99/mo</span>
      </div>

      {/* benefits */}
      <ul className="space-y-2 mb-4">
        {HIGHLIGHTS.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {benefit}
          </li>
        ))}
      </ul>

      <button
        onClick={onUpgrade}
        className="w-full bg-brand text-white font-semibold py-3 rounded-xl text-sm hover:bg-brand/90 transition-colors"
      >
        See Premium plans
      </button>

      <p className="text-xs text-gray-400 text-center mt-2.5">
        15-day free trial · No payment needed upfront
      </p>
    </div>
  )
}

// ---------- Main dashboard ----------
export default function HomeDashboard({
  onNavigateToSettings,
  onUpgradeClick,
  onShowRegistration,
}) {
  const { user } = useUser()
  const isAnonymous = !user.state || user.state === 'guest'

  return (
    <div className="space-y-4">
      {/* Welcome card — anonymous only */}
      {isAnonymous && <WelcomeCard onSignUp={onShowRegistration} />}

      {/* Live Forecast with Location Selector */}
      <LiveForecast />

      {/* Tracking status */}
      <TrackingStatusWidget
        onNavigateToSettings={onNavigateToSettings}
        onUpgradeClick={onUpgradeClick}
      />

      {/* Premium promo — anonymous only */}
      {isAnonymous && <PremiumPromoCard onUpgrade={onUpgradeClick} />}
    </div>
  )
}
