import { useState, useMemo } from 'react'
import { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

// ── Helpers ──────────────────────────────────────────────────────────────────

// Deterministic pseudo-random — ensures past-day bars are stable across renders
const seededRandom = (n) => {
  const x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

// Day label: handles -2 to +2
const getDayLabel = (offset) => {
  if (offset === 0) return 'Today'
  if (offset === 1) return 'Tomorrow'
  if (offset === -1) return 'Yesterday'
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-GB', { weekday: 'long' }) // e.g. "Monday", "Thursday"
}

// Generate 24 data points (hours 0–23) for any day offset
const generateDayForecast = (dayOffset) => {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  const dateSeed = d.getDate() * 31 + d.getMonth() * 366

  return Array.from({ length: 24 }, (_, hour) => {
    let baseScore = 70
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      baseScore = 55 // Rush hours
    } else if (hour >= 10 && hour <= 16) {
      baseScore = 65 // Midday
    } else if (hour >= 22 || hour <= 5) {
      baseScore = 85 // Night / early morning
    } else if (hour === 6) {
      baseScore = 88 // Pre-rush sweet spot
    }

    const rand = seededRandom(dateSeed + hour * 7) * 15 - 7
    const score = Math.min(100, Math.max(25, Math.round(baseScore + rand)))
    return { hour, score, level: getScoreLevel(score) }
  })
}

// ── Route Map (unchanged) ────────────────────────────────────────────────────

const generateRoutePoints = () => {
  const points = []
  const centerLat = 51.5362
  const centerLng = -0.1033
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const radius = 0.008 + Math.sin(i * 0.5) * 0.003
    points.push({
      lat: centerLat + Math.sin(angle) * radius,
      lng: centerLng + Math.cos(angle) * radius * 1.5,
    })
  }
  return points
}

function RouteMap({ location }) {
  const routePoints = generateRoutePoints()
  const mapWidth = 320
  const mapHeight = 180
  const padding = 20

  const minLat = Math.min(...routePoints.map(p => p.lat))
  const maxLat = Math.max(...routePoints.map(p => p.lat))
  const minLng = Math.min(...routePoints.map(p => p.lng))
  const maxLng = Math.max(...routePoints.map(p => p.lng))

  const scaleX = (mapWidth - 2 * padding) / (maxLng - minLng)
  const scaleY = (mapHeight - 2 * padding) / (maxLat - minLat)

  const pathData = routePoints.map((point, i) => {
    const x = padding + (point.lng - minLng) * scaleX
    const y = mapHeight - padding - (point.lat - minLat) * scaleY
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ') + ' Z'

  return (
    <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{ height: '180px' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="streetGridTime" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#666" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streetGridTime)" />
        </svg>

        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
          <path
            d={pathData}
            fill="none"
            stroke="#6366f1"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          <path
            d={pathData}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={padding + (routePoints[0].lng - minLng) * scaleX}
            cy={mapHeight - padding - (routePoints[0].lat - minLat) * scaleY}
            r="6"
            fill="#22c55e"
          />
          <circle
            cx={padding + (routePoints[0].lng - minLng) * scaleX}
            cy={mapHeight - padding - (routePoints[0].lat - minLat) * scaleY}
            r="3"
            fill="white"
          />
        </svg>
      </div>

      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{location}</span>
        </div>
      </div>
    </div>
  )
}

// ── DayTimeline ──────────────────────────────────────────────────────────────
// A single 24-bar row matching the Forecast Timeline bar pattern

function DayTimeline({ offset, label, data, currentHour, selection, onSelectBar }) {
  const isPast = offset < 0
  const isToday = offset === 0

  return (
    <div>
      {/* Day label */}
      <p className={`text-xs font-semibold mb-1.5 ${
        isToday ? 'text-brand' : isPast ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {label}
      </p>

      {/* Bar chart — same pattern as Forecast Timeline: flex gap-0.5 h-10 items-end */}
      <div className="flex gap-0.5 h-10 items-end">
        {data.map((d, i) => {
          const isPastHour = isToday && i < currentHour
          const isSelected = selection?.dayOffset === offset && selection?.hourIndex === i
          return (
            <button
              key={i}
              onClick={() => onSelectBar(offset, i, d.score)}
              className={`flex-1 rounded-t transition-all ${
                isSelected ? 'ring-2 ring-brand ring-offset-1' : ''
              }`}
              style={{
                height: `${Math.max(15, (d.score / 100) * 100)}%`,
                backgroundColor: getScoreColor(d.score),
                opacity: isPastHour ? 0.3 : isPast ? 0.55 : 0.85,
              }}
            />
          )
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">00:00</span>
        <span className="text-[10px] text-gray-400">06:00</span>
        <span className="text-[10px] text-gray-400">12:00</span>
        <span className="text-[10px] text-gray-400">18:00</span>
        <span className="text-[10px] text-gray-400">23:00</span>
      </div>

      {/* "Now" indicator pinned under the current hour bar */}
      {isToday && (
        <div
          className="text-[9px] text-brand font-semibold mt-0.5"
          style={{
            marginLeft: `calc(${(currentHour / 24) * 100}% - 8px)`,
            width: 'fit-content',
          }}
        >
          ▲ Now
        </div>
      )}
    </div>
  )
}

// ── TimeMap ───────────────────────────────────────────────────────────────────
// Container: 5 stacked DayTimeline rows inside one card

function TimeMap({ allDaysData, currentHour, selection, onSelectBar }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">5-Day Air Quality</h3>

      <div className="space-y-1">
        {allDaysData.map(({ offset, label, data }, idx) => (
          <div key={offset}>
            {idx > 0 && <div className="border-t border-gray-100 my-3" />}
            <DayTimeline
              offset={offset}
              label={label}
              data={data}
              currentHour={currentHour}
              selection={selection}
              onSelectBar={onSelectBar}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {['#ef4444', '#f97316', '#eab308', '#10b981', '#22c55e'].map((c, i) => (
              <div key={i} className="w-4 h-2 rounded-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="text-xs text-gray-400">Poor → Excellent</span>
        </div>
        <span className="text-xs text-gray-400">Tap to compare</span>
      </div>
    </div>
  )
}

// ── ComparisonCard ────────────────────────────────────────────────────────────

function ComparisonCard({ selection, bestFutureSlot }) {
  const improvement = bestFutureSlot.score - selection.score
  const selDayLabel = getDayLabel(selection.dayOffset)
  const selHourStr = `${String(selection.hourIndex).padStart(2, '0')}:00`
  const bestHourStr = `${String(bestFutureSlot.hourIndex).padStart(2, '0')}:00`

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
        <div>
          <div className="text-white/80 text-xs">Potential improvement</div>
          <div className="text-xl font-bold">
            {improvement > 0 ? `+${improvement}` : improvement} points
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-white/70 text-xs mb-1">Selected</div>
          <div className="text-base font-bold leading-tight">{selHourStr}</div>
          <div className="text-xs text-white/70 mt-0.5">{selDayLabel}</div>
          <div className="text-sm text-white/80 mt-1">{selection.score}% AQ</div>
        </div>
        <div className="bg-white/20 rounded-xl p-3 border border-white/30">
          <div className="text-white/70 text-xs mb-1">Best window</div>
          <div className="text-base font-bold leading-tight">{bestHourStr}</div>
          <div className="text-xs text-white/70 mt-0.5">{bestFutureSlot.label}</div>
          <div className="text-sm text-green-200 mt-1">{bestFutureSlot.score}% AQ</div>
        </div>
      </div>

      <button className="w-full mt-4 bg-white text-green-700 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        Set reminder — {bestFutureSlot.label} at {bestHourStr}
      </button>
    </div>
  )
}

// ── InsightCard ───────────────────────────────────────────────────────────────

function InsightCard({ bestFutureSlot }) {
  const bestHourStr = `${String(bestFutureSlot.hourIndex).padStart(2, '0')}:00`
  const title = `Why ${bestFutureSlot.label} at ${bestHourStr} is best`

  return (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-blue-900 mb-1">{title}</div>
          <p className="text-xs text-blue-700 leading-relaxed">
            Early morning and late evening hours have the lowest traffic emissions and benefit from
            overnight pollutant dispersion. Air quality typically degrades during rush hours
            (7–9am, 5–7pm) due to vehicle traffic. Planning around these peaks can significantly
            improve your exposure.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TimeOptimization({ segment, onBack }) {
  const currentHour = new Date().getHours()

  // Generate 5-day data once at mount (seeded = stable across re-renders)
  const [allDaysData] = useState(() =>
    [-2, -1, 0, 1, 2].map(offset => ({
      offset,
      label: getDayLabel(offset),
      data: generateDayForecast(offset),
    }))
  )

  // Default selection to segment's usual hour on Today
  const yourHour = segment?.startTime ? new Date(segment.startTime).getHours() : 19
  const todayEntry = allDaysData.find(d => d.offset === 0)
  const [selection, setSelection] = useState({
    dayOffset: 0,
    hourIndex: yourHour,
    score: todayEntry.data[yourHour].score,
  })

  const handleSelectBar = (dayOffset, hourIndex, score) => {
    setSelection({ dayOffset, hourIndex, score })
  }

  // Best upcoming slot: today (from current hour onwards) + tomorrow + day+2 (full)
  const bestFutureSlot = useMemo(() => {
    let best = { dayOffset: 0, hourIndex: currentHour, score: 0, label: 'Today' }
    allDaysData
      .filter(d => d.offset >= 0)
      .forEach(({ offset, label, data }) => {
        const start = offset === 0 ? currentHour : 0
        data.slice(start).forEach((d, i) => {
          if (d.score > best.score) {
            best = { dayOffset: offset, hourIndex: start + i, score: d.score, label }
          }
        })
      })
    return best
  }, [allDaysData, currentHour])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Optimize Your Time</h1>
          <p className="text-sm text-gray-500">Find the best time for cleaner air</p>
        </div>
      </div>

      {/* Route Map */}
      <RouteMap location={segment?.location || "Regent's Canal"} />

      {/* 5-Day Time Map */}
      <TimeMap
        allDaysData={allDaysData}
        currentHour={currentHour}
        selection={selection}
        onSelectBar={handleSelectBar}
      />

      {/* Comparison */}
      <ComparisonCard
        selection={selection}
        bestFutureSlot={bestFutureSlot}
      />

      {/* Insight */}
      <InsightCard bestFutureSlot={bestFutureSlot} />
    </div>
  )
}
