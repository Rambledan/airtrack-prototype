import { useState, useEffect } from 'react'
import { fetchPollenData } from '../../services/pollenService'

// ── Pollen level config ───────────────────────────────────────────────────────
// UPI 0–5 → colour tokens + label
const LEVEL_CONFIG = {
  0: { label: 'None',     bg: 'bg-gray-100',     text: 'text-gray-500',    bar: 'bg-gray-300'     },
  1: { label: 'Very Low', bg: 'bg-green-100',    text: 'text-green-700',   bar: 'bg-green-400'    },
  2: { label: 'Moderate', bg: 'bg-yellow-100',   text: 'text-yellow-700',  bar: 'bg-yellow-400'   },
  3: { label: 'High',     bg: 'bg-orange-100',   text: 'text-orange-700',  bar: 'bg-orange-400'   },
  4: { label: 'Very High',bg: 'bg-red-100',      text: 'text-red-700',     bar: 'bg-red-400'      },
  5: { label: 'Extreme',  bg: 'bg-purple-100',   text: 'text-purple-700',  bar: 'bg-purple-500'   },
}

// ── Pollen-type icons ─────────────────────────────────────────────────────────
const TYPE_ICON = {
  TREE: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M5 12H2l10-10 10 10h-3" />
      <path d="M5 12v3a7 7 0 0014 0v-3" />
    </svg>
  ),
  GRASS: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22c0-6 4-10 4-10s4 4 4 10" />
      <path d="M14 22c0-4 2-8 2-8s2 4 2 8" />
      <path d="M6 12c0-4 2-7 4-10" />
      <path d="M16 14c0-3 1-5.5 2-8" />
    </svg>
  ),
  WEED: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
}

// ── Single pollen-type row ────────────────────────────────────────────────────
function PollenRow({ type, showRecommendations }) {
  const { code, displayName, inSeason, value, healthRecommendations } = type
  const cfg = LEVEL_CONFIG[Math.min(value, 5)] || LEVEL_CONFIG[0]
  const showRecs = showRecommendations && inSeason && value > 1 && healthRecommendations.length > 0

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
          <span className={cfg.text}>{TYPE_ICON[code]}</span>
        </div>

        {/* Name + season tag */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900">{displayName}</span>
            {!inSeason && (
              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">
                Off season
              </span>
            )}
          </div>

          {/* UPI bar — 5 segments */}
          <div className="flex gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((seg) => (
              <div
                key={seg}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  seg <= value ? cfg.bar : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category badge */}
        <span className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>

      {/* Health recommendations (only when inSeason + value > 1) */}
      {showRecs && (
        <div className="ml-11 space-y-1">
          {healthRecommendations.slice(0, 2).map((rec, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${cfg.bar}`} />
              <p className="text-xs text-gray-500 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
// lat/lng: coordinates to fetch for. Defaults to Islington (prototype default).
export default function PollenSection({ lat = 51.5362, lng = -0.1033 }) {
  const [data, setData] = useState(null)       // normalised pollen data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    fetchPollenData(lat, lng)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [lat, lng])

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-16 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-1.5 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <PollenHeaderIcon />
          <h3 className="text-base font-semibold text-gray-900">Pollen</h3>
        </div>
        <p className="text-sm text-gray-400 mt-2">Pollen data unavailable</p>
      </div>
    )
  }

  // ── Check if all types are zero / off-season ─────────────────────────────
  const allLow = data.types.every((t) => !t.inSeason || t.value <= 1)

  // ── Format today's date label ─────────────────────────────────────────────
  const { year, month, day } = data.date
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'short',
  })

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <PollenHeaderIcon />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Pollen</h3>
        </div>
        <span className="text-xs text-gray-400">{dateLabel}</span>
      </div>

      {/* All-clear message */}
      {allLow ? (
        <div className="flex items-center gap-2.5 p-3 bg-green-50 rounded-2xl border border-green-100">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-sm text-gray-700 font-medium">Pollen levels are low today</p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-gray-50">
          {data.types.map((type, i) => (
            <div key={type.code} className={i > 0 ? 'pt-4' : ''}>
              <PollenRow type={type} showRecommendations />
            </div>
          ))}
        </div>
      )}

      {/* Mock data notice */}
      {data.source === 'mock' && (
        <p className="text-[10px] text-gray-300 mt-4 text-right">Example data</p>
      )}
    </div>
  )
}

// ── Shared pollen leaf icon ───────────────────────────────────────────────────
function PollenHeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V13" />
      <path d="M20 8c0 4.4-3.6 8-8 8S4 12.4 4 8c0-2 2-6 8-6s8 4 8 6z" />
    </svg>
  )
}
