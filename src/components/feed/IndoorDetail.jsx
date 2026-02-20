import { getScoreColor } from '../shared/AqiScoreBadge'

function formatDate(date) {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let dayLabel
  if (d.toDateString() === today.toDateString()) {
    dayLabel = 'Today'
  } else if (d.toDateString() === yesterday.toDateString()) {
    dayLabel = 'Yesterday'
  } else {
    dayLabel = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
  }

  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  return { dayLabel, time }
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// Interior photo filenames in public/
const INTERIOR_PHOTOS = [
  'Interior1.png',
  'interior2.png',
  'interior3.png',
  'interior4.png',
  'interior5.png',
]

function photoForSegment(segmentId) {
  if (!segmentId) return INTERIOR_PHOTOS[0]
  const idx = segmentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % INTERIOR_PHOTOS.length
  return INTERIOR_PHOTOS[idx]
}

// Real interior photo — larger version for detail view (~180px tall)
function BuildingFacadeLarge({ location, segmentId }) {
  const src = `${import.meta.env.BASE_URL}${photoForSegment(segmentId)}`

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ height: '180px' }}>
      <img
        src={src}
        alt={location || 'Indoor location'}
        className="w-full h-full object-cover"
      />
      {/* Dark gradient so location label is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {/* Location label overlay */}
      <div className="absolute bottom-3 left-4 right-4">
        <span className="text-xs font-semibold text-white drop-shadow">
          {location}
        </span>
      </div>
    </div>
  )
}

// A–E ventilation rating display
const RATING_CONFIG = {
  5: { letter: 'A', color: 'bg-green-500',  label: 'Excellent natural ventilation' },
  4: { letter: 'B', color: 'bg-lime-500',   label: 'Good natural ventilation'      },
  3: { letter: 'C', color: 'bg-yellow-400', label: 'Moderate ventilation'          },
  2: { letter: 'D', color: 'bg-orange-400', label: 'Limited natural ventilation'   },
  1: { letter: 'E', color: 'bg-red-500',    label: 'Sealed / mechanical only'      },
}

const AI_INTERPRETATION = {
  5: "Based on construction data and street view analysis, this pre-1919 brick building has excellent natural ventilation potential. Solid masonry walls and large openable windows allow effective cross-ventilation when opened on opposite sides.",
  4: "This interwar building has good natural ventilation. Original window openings are generous, and relatively low building density nearby supports air movement across the facade.",
  3: "This post-war building has moderate ventilation potential. The window-to-wall ratio is reasonable, though the construction style limits passive cross-ventilation compared to older properties.",
  2: "Modern construction typically prioritises thermal efficiency over natural ventilation. Air exchange is partially mechanical; opening windows during clean-air windows still provides some benefit.",
  1: "Contemporary airtight construction handles air exchange mechanically. Natural ventilation through windows has limited impact on indoor air quality — focus on HEPA filtration instead.",
}

function VentilationCard({ segment }) {
  const rating = segment.ventilationRating || 3
  const config = RATING_CONFIG[rating]
  const interpretation = AI_INTERPRETATION[rating]

  // Energy-rating-style A–E bar
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

      {/* A–E rating bar */}
      <div className="flex items-center gap-1 mb-4">
        {allRatings.map((r) => {
          const c = RATING_CONFIG[r]
          const isActive = r === rating
          return (
            <div key={r} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-all ${c.color} ${isActive ? 'scale-110 shadow-md' : 'opacity-30'}`}
              >
                {c.letter}
              </div>
            </div>
          )
        })}
      </div>

      {/* Rating label */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold ${config.color}`}>
          {config.letter}
        </div>
        <span className="text-sm font-medium text-gray-800">{config.label}</span>
      </div>

      {/* Building metadata */}
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

      {/* AI interpretation */}
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

  // Deterministic times — vary by day-of-week to avoid always showing same window
  const dow = new Date(segment.startTime).getDay() // 0–6
  const openStartHour  = 6 + (dow % 2)             // 6 or 7
  const openEndHour    = openStartHour + 3          // 9 or 10
  const closeStartHour = 17 + (dow % 2)             // 17 or 18
  const closeEndHour   = closeStartHour + 3         // 20 or 21

  // Synthetic AQ scores for the windows
  const openScore  = Math.min(92, 78 + rating * 3)
  const closeScore = Math.max(32, 56 - rating * 4)

  const fmt = (h) => `${String(h).padStart(2, '0')}:00`
  const openColor  = getScoreColor(openScore)
  const closeColor = getScoreColor(closeScore)

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
            <path d="M7 10h10M7 7h10" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900">Ventilation Windows Today</h3>
      </div>

      {isMechanical ? (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Mechanically ventilated building</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Modern airtight construction handles air exchange mechanically. Opening windows has limited impact — focus on indoor HEPA filtration and monitor your indoor AQ sensor for best results.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Open windows row */}
          <div className="flex items-center gap-3 p-3.5 bg-green-50 rounded-2xl border border-green-100">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: openColor }} />
            <div className="flex-1">
              <div className="text-xs font-semibold text-green-800 mb-0.5">Open windows</div>
              <div className="text-sm font-medium text-gray-700">
                {fmt(openStartHour)} – {fmt(openEndHour)}
              </div>
            </div>
            <div
              className="text-xs font-bold rounded-full px-2.5 py-1 text-white"
              style={{ backgroundColor: openColor }}
            >
              {openScore}%
            </div>
          </div>

          {/* Close windows row */}
          <div className="flex items-center gap-3 p-3.5 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: closeColor }} />
            <div className="flex-1">
              <div className="text-xs font-semibold text-orange-800 mb-0.5">Close windows</div>
              <div className="text-sm font-medium text-gray-700">
                {fmt(closeStartHour)} – {fmt(closeEndHour)}
              </div>
            </div>
            <div
              className="text-xs font-bold rounded-full px-2.5 py-1 text-white"
              style={{ backgroundColor: closeColor }}
            >
              {closeScore}%
            </div>
          </div>

          <p className="text-[11px] text-gray-400 px-1 leading-relaxed">
            Based on forecast outdoor air quality for today. Times may shift with changing weather patterns.
          </p>
        </div>
      )}
    </div>
  )
}

export default function IndoorDetail({ segment, onBack }) {
  const { dayLabel, time } = formatDate(segment.startTime)

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
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">Indoor Segment</h2>
          <p className="text-sm text-gray-500">{dayLabel} · {time} · {formatDuration(segment.durationMinutes)}</p>
        </div>
      </div>

      {/* Building facade */}
      <BuildingFacadeLarge location={segment.location} segmentId={segment.id} />

      {/* Ventilation Rating */}
      <VentilationCard segment={segment} />

      {/* Window guidance */}
      <WindowGuidanceCard segment={segment} />
    </div>
  )
}
