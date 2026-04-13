import { useState } from 'react'
import { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'
import {
  LOCATION_TYPES,
  LOCATION_NAME_TO_TYPE,
  EXAMPLE_LOCATIONS,
  formatLocationProfileSummary,
} from '../../data/locationProfiles'
import LocationQuestionnaire from './LocationQuestionnaire'
import MonitorLiveDataCard from './MonitorLiveDataCard'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date) {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  let dayLabel
  if (d.toDateString() === today.toDateString()) dayLabel = 'Today'
  else if (d.toDateString() === yesterday.toDateString()) dayLabel = 'Yesterday'
  else dayLabel = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  return { dayLabel, time }
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function seededRandom(n) {
  const x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

function charSum(str) {
  return (str || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0)
}

// ── Ventilation rating (kept from original) ──────────────────────────────────

const RATING_CONFIG = {
  5: { letter: 'A', color: 'bg-green-500',  label: 'Excellent natural ventilation' },
  4: { letter: 'B', color: 'bg-lime-500',   label: 'Good natural ventilation'      },
  3: { letter: 'C', color: 'bg-yellow-400', label: 'Moderate ventilation'          },
  2: { letter: 'D', color: 'bg-orange-400', label: 'Limited natural ventilation'   },
  1: { letter: 'E', color: 'bg-red-500',    label: 'Sealed / mechanical only'      },
}

const AI_INTERPRETATION = {
  5: 'Based on construction data, this pre-1919 brick building has excellent natural ventilation potential. Solid masonry walls and large openable windows allow effective cross-ventilation when opened on opposite sides.',
  4: 'This interwar building has good natural ventilation. Original window openings are generous and relatively low building density supports air movement across the facade.',
  3: 'This post-war building has moderate ventilation potential. The window-to-wall ratio is reasonable, though the construction style limits passive cross-ventilation compared to older properties.',
  2: 'Modern construction prioritises thermal efficiency over natural ventilation. Air exchange is partially mechanical; opening windows during clean-air windows still provides some benefit.',
  1: 'Contemporary airtight construction handles air exchange mechanically. Natural ventilation through windows has limited impact on indoor air quality — focus on HEPA filtration instead.',
}

function VentilationCard({ segment }) {
  const rating = segment.ventilationRating || 3
  const config = RATING_CONFIG[rating]
  const interpretation = AI_INTERPRETATION[rating]
  const allRatings = [5, 4, 3, 2, 1]

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.7 7.7a2.5 2.5 0 111.8 4.3H2" />
            <path d="M9.6 4.6A2 2 0 1111 8H2" />
            <path d="M12.6 19.4A2 2 0 1014 16H2" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900">Estimated Ventilation Rating</h3>
      </div>

      <div className="flex items-center gap-1 mb-4">
        {allRatings.map((r) => {
          const c = RATING_CONFIG[r]
          return (
            <div key={r} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-all ${c.color} ${r === rating ? 'scale-110 shadow-md' : 'opacity-30'}`}>
                {c.letter}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold ${config.color}`}>
          {config.letter}
        </div>
        <span className="text-sm font-medium text-gray-800">{config.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">Building Era</div>
          <div className="text-sm font-semibold text-gray-800">{segment.buildingEra || 'Unknown'}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">Construction</div>
          <div className="text-sm font-semibold text-gray-800 leading-tight">{segment.constructionType || 'Unknown'}</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100/40">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a4 4 0 014 4c0 1.1-.45 2.1-1.17 2.83L12 12" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wide">AI Analysis</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{interpretation}</p>
      </div>
    </div>
  )
}

function WindowGuidanceCard({ segment }) {
  const rating = segment.ventilationRating || 3
  const isMechanical = rating <= 2
  const dow = new Date(segment.startTime).getDay()
  const openStartHour  = 6 + (dow % 2)
  const openEndHour    = openStartHour + 3
  const closeStartHour = 17 + (dow % 2)
  const closeEndHour   = closeStartHour + 3
  const openScore  = Math.min(92, 78 + rating * 3)
  const closeScore = Math.max(32, 56 - rating * 4)
  const fmt = (h) => `${String(h).padStart(2, '0')}:00`
  const openColor  = getScoreColor(openScore)
  const closeColor = getScoreColor(closeScore)
  // Mock temperature based on seeded random
  const seed = charSum(segment.id || '')
  const tempDrop = Math.round(10 + seededRandom(seed + 99) * 8)
  const tempHour = closeStartHour + 1

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4M7 10h10M7 7h10" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900">Ventilation Windows Today</h3>
      </div>

      {isMechanical ? (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-sm font-medium text-slate-700 mb-1">Mechanically ventilated building</p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Modern airtight construction handles air exchange mechanically. Focus on HEPA filtration and monitor your indoor sensor for best results.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3.5 bg-green-50 rounded-2xl border border-green-100">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: openColor }} />
            <div className="flex-1">
              <div className="text-xs font-semibold text-green-800 mb-0.5">Open windows</div>
              <div className="text-sm font-medium text-gray-700">{fmt(openStartHour)} – {fmt(openEndHour)}</div>
              <div className="text-xs text-gray-500 mt-0.5">Outdoor AQ forecast is {openScore}% — good for ventilation</div>
            </div>
            <div className="text-xs font-bold rounded-full px-2.5 py-1 text-white" style={{ backgroundColor: openColor }}>
              {openScore}%
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: closeColor }} />
            <div className="flex-1">
              <div className="text-xs font-semibold text-orange-800 mb-0.5">Close windows</div>
              <div className="text-sm font-medium text-gray-700">{fmt(closeStartHour)} – {fmt(closeEndHour)}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Temperature estimated below {tempDrop}°C after {fmt(tempHour)}
              </div>
            </div>
            <div className="text-xs font-bold rounded-full px-2.5 py-1 text-white" style={{ backgroundColor: closeColor }}>
              {closeScore}%
            </div>
          </div>

          <p className="text-[11px] text-gray-400 px-1 leading-relaxed">
            Based on forecast outdoor air quality. Times may shift with changing weather.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Indoor AQ Forecast bar chart ─────────────────────────────────────────────

function IndoorForecastCard({ locationType, segmentId }) {
  const config = LOCATION_TYPES[locationType] || LOCATION_TYPES.home
  const shape = config.forecastShape
  const seed = charSum(segmentId || '')
  const currentHour = new Date().getHours()

  const bars = shape.map((base, hour) => {
    const noise = seededRandom(seed + hour * 7) * 16 - 8
    return Math.max(20, Math.min(100, Math.round(base + noise)))
  })

  // Find best 2-hour window from current hour onwards
  let bestStart = currentHour
  let bestScore = 0
  for (let h = currentHour; h < 23; h++) {
    const avg = (bars[h] + bars[h + 1]) / 2
    if (avg > bestScore) { bestScore = avg; bestStart = h }
  }
  const fmt = (h) => `${String(h).padStart(2, '0')}:00`

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Indoor Air Quality · Today</h3>
        <span className="text-xs text-gray-400">{fmt(currentHour)}</span>
      </div>

      {/* Bar chart */}
      <div className="flex gap-0.5 h-14 items-end mb-1">
        {bars.map((score, hour) => {
          const isPast = hour < currentHour
          const isCurrent = hour === currentHour
          return (
            <div
              key={hour}
              className={`flex-1 rounded-t transition-all ${isCurrent ? 'ring-2 ring-gray-800 ring-offset-1' : ''}`}
              style={{
                height: `${(score / 100) * 100}%`,
                backgroundColor: getScoreColor(score),
                opacity: isPast ? 0.3 : 0.8,
              }}
            />
          )
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mb-3">
        {['00:00', '06:00', '12:00', '18:00', '23:00'].map(t => (
          <span key={t} className="text-[10px] text-gray-400">{t}</span>
        ))}
      </div>

      {/* Best window callout */}
      <div className="flex items-center gap-2.5 p-3 bg-green-50 rounded-2xl border border-green-100">
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-green-800">Best ventilation window</p>
          <p className="text-xs text-gray-600">{fmt(bestStart)} – {fmt(Math.min(23, bestStart + 2))} · {Math.round(bestScore)}% AQ</p>
        </div>
      </div>
    </div>
  )
}

// ── Location-specific tips ────────────────────────────────────────────────────

function TipsCard({ locationType, answers }) {
  const config = LOCATION_TYPES[locationType] || LOCATION_TYPES.home
  const tips = config.tips(answers || {})

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.5-1.3 4.7-3.3 6H8.3A7.02 7.02 0 015 9a7 7 0 017-7z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900">Reduce Indoor Pollution</h3>
      </div>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-amber-700">{i + 1}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Add monitor CTA ───────────────────────────────────────────────────────────

function AddMonitorCard({ onShop, onSetup }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 3H8M12 3v4M8 12h8M8 16h5" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Get live readings</h3>
          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
            An AirTrack Monitor gives you live PM2.5, VOC and CO₂ readings — replacing our estimated score with real data.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onShop}
          className="flex-1 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand/90 transition-colors"
        >
          Shop monitor
        </button>
        <button
          onClick={onSetup}
          className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          I have one
        </button>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function IndoorDetail({
  segment,
  onBack,
  locationProfiles,
  monitorLocations,
  onSaveLocationProfile,
  onSetupMonitor,
  onShopMonitor,
}) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)

  const { dayLabel, time } = formatDate(segment.startTime)
  const locationType = segment.locationType || LOCATION_NAME_TO_TYPE[segment.location] || 'home'
  const profile = locationProfiles?.[segment.location]
  const monitor = monitorLocations?.[segment.location]
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  // Deterministically pick a Street View / map location
  const seed = charSum(segment.id || segment.location || '')
  const loc = EXAMPLE_LOCATIONS[seed % EXAMPLE_LOCATIONS.length]

  const streetViewUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/streetview?location=${loc.lat},${loc.lng}&size=640x300&fov=90&key=${apiKey}`
    : null

  const staticMapUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${loc.lat},${loc.lng}&zoom=15&size=640x180&markers=color:red%7C${loc.lat},${loc.lng}&key=${apiKey}`
    : null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 leading-tight truncate">
            Indoor at {segment.location}
          </h2>
          <p className="text-sm text-gray-500">{dayLabel} · {time} · {formatDuration(segment.durationMinutes)}</p>
        </div>
      </div>

      {/* Street View */}
      <div className="rounded-3xl overflow-hidden relative" style={{ height: '190px' }}>
        {streetViewUrl ? (
          <>
            <img
              src={streetViewUrl}
              alt={`Street view near ${segment.location}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-400">Street View unavailable</p>
          </div>
        )}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-white drop-shadow">{segment.location}</span>
          <span className="text-[10px] text-white/70 drop-shadow">{loc.name}</span>
        </div>
      </div>

      {/* Static map */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100/50 shadow-sm">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Location</span>
          <span className="text-xs text-gray-400">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</span>
        </div>
        {staticMapUrl ? (
          <img
            src={staticMapUrl}
            alt={`Map near ${segment.location}`}
            className="w-full object-cover"
            style={{ height: '130px' }}
          />
        ) : (
          <div className="mx-4 mb-4 rounded-xl bg-gray-100 flex items-center justify-center" style={{ height: '120px' }}>
            <p className="text-xs text-gray-400">Map unavailable</p>
          </div>
        )}
      </div>

      {/* Indoor AQ forecast */}
      <IndoorForecastCard locationType={locationType} segmentId={segment.id} />

      {/* Location profile section */}
      {profile ? (
        <div className="bg-green-50 rounded-3xl p-4 border border-green-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                {LOCATION_TYPES[profile.type]?.label || 'Location'} profile saved
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                {formatLocationProfileSummary(profile.type, profile.answers)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQuestionnaire(true)}
            className="text-xs text-brand font-medium shrink-0 hover:underline"
          >
            Edit
          </button>
        </div>
      ) : showQuestionnaire ? (
        <LocationQuestionnaire
          locationType={locationType}
          existingAnswers={profile?.answers}
          onSave={(answers) => {
            onSaveLocationProfile?.(segment.location, locationType, answers)
            setShowQuestionnaire(false)
          }}
          onDismiss={() => setShowQuestionnaire(false)}
        />
      ) : (
        <div className="bg-white rounded-3xl p-4 border border-dashed border-gray-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Help us estimate pollution more accurately</p>
            <p className="text-xs text-gray-500 mt-0.5 mb-3">Answer 3 quick questions about this location.</p>
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="text-sm font-semibold text-brand hover:underline"
            >
              Set location profile →
            </button>
          </div>
        </div>
      )}

      {/* Ventilation rating */}
      <VentilationCard segment={segment} />

      {/* Window guidance */}
      <WindowGuidanceCard segment={segment} />

      {/* Location-specific tips */}
      <TipsCard locationType={locationType} answers={profile?.answers} />

      {/* Monitor section */}
      {monitor?.registered ? (
        <MonitorLiveDataCard locationName={segment.location} monitorCode={monitor.code} />
      ) : (
        <AddMonitorCard
          onShop={() => onShopMonitor?.(segment)}
          onSetup={() => onSetupMonitor?.(segment)}
        />
      )}
    </div>
  )
}
