import { useState } from 'react'

const CAUSES = ['Cooking', 'Candle', 'Incense', 'Smoking', 'Vaping', 'Other']

function timeAgo(timestamp) {
  const mins = Math.round((Date.now() - new Date(timestamp)) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  return `${hrs}h ago`
}

export default function MonitorSpikeAlert({ locationName, pollutant, peakValue, unit, timestamp }) {
  const [logState, setLogState] = useState('idle')
  const [causeLogged, setCauseLogged] = useState(null)

  const handleCause = (cause) => {
    setCauseLogged(cause)
    setLogState('confirmed')
  }

  if (logState === 'confirmed') {
    return (
      <div className="bg-white rounded-3xl p-4 border border-gray-100/50 shadow-sm flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Thanks for training AirTrack</p>
          <p className="text-xs text-gray-500">{causeLogged} logged · {locationName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-sm space-y-3">
      {/* Row 1: icon + description + value chip */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {pollutant} spike at {locationName}
          </p>
          <p className="text-xs text-gray-500">{timeAgo(timestamp)}</p>
        </div>
        <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 tabular-nums">
          {peakValue} {unit}
        </div>
      </div>

      {/* Row 2: Log cause button / expanded causes */}
      {logState === 'idle' && (
        <button
          onClick={() => setLogState('expanded')}
          className="w-full py-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors"
        >
          Log cause
        </button>
      )}

      {logState === 'expanded' && (
        <div>
          <p className="text-[11px] text-gray-500 mb-2">What caused the spike?</p>
          <div className="flex flex-wrap gap-2">
            {CAUSES.map((cause) => (
              <button
                key={cause}
                onClick={() => handleCause(cause)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:border-brand/40 hover:text-brand transition-colors"
              >
                {cause}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
