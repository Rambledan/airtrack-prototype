import { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

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

function formatPace(minPerKm) {
  const mins = Math.floor(minPerKm)
  const secs = Math.round((minPerKm - mins) * 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Mock route coordinates for the map
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

function RouteMap({ score, location }) {
  const routePoints = generateRoutePoints()
  const color = getScoreColor(score)

  // Create SVG path from route points
  const mapWidth = 320
  const mapHeight = 200
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
    <div className="relative bg-gray-100 rounded-3xl overflow-hidden" style={{ height: '220px' }}>
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50">
        {/* Street grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="streetGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#666" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streetGrid)" />
        </svg>

        {/* Route path */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
          {/* Route shadow */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          {/* Main route */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start marker */}
          <circle cx={padding + (routePoints[0].lng - minLng) * scaleX} cy={mapHeight - padding - (routePoints[0].lat - minLat) * scaleY} r="8" fill="#22c55e" />
          <circle cx={padding + (routePoints[0].lng - minLng) * scaleX} cy={mapHeight - padding - (routePoints[0].lat - minLat) * scaleY} r="4" fill="white" />
        </svg>
      </div>

      {/* Location label */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{location}</span>
        </div>
      </div>

      {/* Expand button */}
      <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
    </div>
  )
}

function StatCard({ icon, label, value, subValue }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100/50 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <span className="text-[11px] text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subValue && <div className="text-[10px] text-gray-400 mt-0.5">{subValue}</div>}
    </div>
  )
}

function ScoreCard({ score }) {
  const level = getScoreLevel(score)
  const color = getScoreColor(score)

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100/50 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-gray-500 mb-1">Air Quality Score</div>
          <div className="text-3xl font-bold" style={{ color }}>{score}%</div>
          <div className="text-[11px] text-gray-500 capitalize mt-0.5">{level}</div>
        </div>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" style={{ color }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 014 4c0 1.1-.45 2.1-1.17 2.83L12 12l-2.83-3.17A4 4 0 1112 2z" />
            <path d="M12 12v10" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function SuggestionCTA({ type, improvement, onPress }) {
  const isTimeChange = type === 'time'

  return (
    <button
      onClick={onPress}
      className="w-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-left shadow-lg shadow-green-500/20 relative overflow-hidden"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12" />

      <div className="relative flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {isTimeChange ? (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <div className="text-white/80 text-xs font-medium mb-0.5">
            {isTimeChange ? 'Better time available' : 'Cleaner route available'}
          </div>
          <div className="text-white font-semibold">
            {isTimeChange ? 'Change your run time' : 'Optimize your route'}
          </div>
          <div className="text-green-200 text-sm mt-1">
            +{improvement} pts potential improvement
          </div>
        </div>

        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}

export default function RunningDetail({ segment, onBack, onTimeChange, onRouteChange }) {
  const { dayLabel, time } = formatDate(segment.startTime)
  const hasStrava = segment.hasStrava

  // Calculate potential improvements
  const timeImprovement = Math.floor(Math.random() * 8) + 5
  const routeImprovement = Math.floor(Math.random() * 6) + 3

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Running</h1>
          <div className="text-sm text-gray-500">{dayLabel} at {time}</div>
        </div>
        {hasStrava && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FC4C02]/10 rounded-full">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FC4C02]" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            <span className="text-xs font-medium text-[#FC4C02]">Strava</span>
          </div>
        )}
      </div>

      {/* Route Map */}
      <RouteMap score={segment.score} location={segment.location} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            </svg>
          }
          label="Distance"
          value={`${segment.distanceKm?.toFixed(2) || '5.00'} km`}
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          label="Duration"
          value={formatDuration(segment.durationMinutes)}
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          }
          label="Avg Pace"
          value={`${formatPace(segment.avgPaceMinPerKm || 5.3)} /km`}
        />
        <ScoreCard score={segment.score} />
      </div>

      {/* Suggestion CTAs */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Improve Your Score</h2>
        <SuggestionCTA
          type="time"
          improvement={timeImprovement}
          onPress={() => onTimeChange(segment)}
        />
        <SuggestionCTA
          type="route"
          improvement={routeImprovement}
          onPress={() => onRouteChange(segment)}
        />
      </div>

      {/* Additional info */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-900 mb-1">About this run</div>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your air quality exposure during this run was {segment.score >= 70 ? 'relatively good' : 'moderate'}.
              The highest pollution levels were near the main roads. Consider the suggestions above to
              reduce your exposure on future runs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
