import ScoreBadge, { getScoreColor } from '../shared/AqiScoreBadge'

// Activity icons (stroke style, colored by activity type)
const ACTIVITY_ICONS = {
  car: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17a2 2 0 104 0m6 0a2 2 0 104 0M5 17H3v-3.5a.5.5 0 01.5-.5H5l1.5-4.5A2 2 0 018.39 7h7.22a2 2 0 011.89 1.35L19 13h1.5a.5.5 0 01.5.5V17h-2m-4 0H9" />
    </svg>
  ),
  indoor: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  walking: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 22v-5l-3-3 2-4 3 1v4" />
      <path d="M9 22l2-7-2-2" />
      <path d="M6 11l4 2" />
    </svg>
  ),
  running: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4" r="2" />
      <path d="M4 17l5-2 2-5 4 2 4-4" />
      <path d="M9 22l2-5" />
      <path d="M15 22l-2-7" />
    </svg>
  ),
  cycling: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h3" />
    </svg>
  ),
  bus: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      <path d="M4 11h16" />
      <path d="M8 18v2M16 18v2" />
      <circle cx="7.5" cy="14.5" r="1" />
      <circle cx="16.5" cy="14.5" r="1" />
    </svg>
  ),
  train: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8" cy="15" r="1" />
      <circle cx="16" cy="15" r="1" />
      <path d="M8 19l-2 3M16 19l2 3" />
    </svg>
  ),
}

// Activity-type specific colors
const ACTIVITY_COLORS = {
  running: { bg: 'bg-rose-50', border: 'border-rose-200/50', icon: 'text-rose-500' },
  cycling: { bg: 'bg-sky-50', border: 'border-sky-200/50', icon: 'text-sky-500' },
  walking: { bg: 'bg-amber-50', border: 'border-amber-200/50', icon: 'text-amber-600' },
  indoor: { bg: 'bg-slate-50', border: 'border-slate-200/50', icon: 'text-slate-500' },
  car: { bg: 'bg-zinc-100', border: 'border-zinc-200/50', icon: 'text-zinc-500' },
  bus: { bg: 'bg-violet-50', border: 'border-violet-200/50', icon: 'text-violet-500' },
  train: { bg: 'bg-indigo-50', border: 'border-indigo-200/50', icon: 'text-indigo-500' },
}

// Strava icon
const StravaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
  </svg>
)

const ACTIVITY_LABELS = {
  car: 'Driving',
  indoor: 'Indoors',
  walking: 'Walking',
  running: 'Running',
  cycling: 'Cycling',
  bus: 'Bus',
  train: 'Train',
}

// Score-based gradient tint for card background
function getScoreGradient(score) {
  if (score >= 85) return 'from-green-50/80 via-white to-white'
  if (score >= 70) return 'from-emerald-50/70 via-white to-white'
  if (score >= 55) return 'from-yellow-50/60 via-white to-white'
  if (score >= 40) return 'from-orange-50/50 via-white to-white'
  if (score >= 25) return 'from-red-50/40 via-white to-white'
  return 'from-red-100/50 via-white to-white'
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatPace(minPerKm) {
  const mins = Math.floor(minPerKm)
  const secs = Math.round((minPerKm - mins) * 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Enhanced timeline bar with glow effect
function TimelineBar({ startTime, endTime, score }) {
  const startDate = new Date(startTime)
  const endDate = new Date(endTime)

  const dayStart = 5 * 60
  const dayEnd = 23 * 60
  const dayLength = dayEnd - dayStart

  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()

  const startPercent = Math.max(0, ((startMinutes - dayStart) / dayLength) * 100)
  const endPercent = Math.min(100, ((endMinutes - dayStart) / dayLength) * 100)
  const width = endPercent - startPercent

  const color = getScoreColor(score)

  return (
    <div className="relative h-2 bg-gray-100/80 rounded-full overflow-hidden">
      <div
        className="absolute h-full rounded-full transition-all duration-300"
        style={{
          left: `${startPercent}%`,
          width: `${Math.max(width, 2)}%`,
          background: `linear-gradient(90deg, ${color}dd, ${color})`,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </div>
  )
}

// Inline route map using custom SVG — consistent with RouteOptimizationDetail approach
function RouteMap({ routePoints, score, dark = false }) {
  if (!routePoints || routePoints.length < 2) return null

  const mapWidth = 320
  const mapHeight = 120
  const padding = 16

  const minLat = Math.min(...routePoints.map(p => p.lat)) - 0.001
  const maxLat = Math.max(...routePoints.map(p => p.lat)) + 0.001
  const minLng = Math.min(...routePoints.map(p => p.lng)) - 0.002
  const maxLng = Math.max(...routePoints.map(p => p.lng)) + 0.002

  const scaleX = (mapWidth - 2 * padding) / (maxLng - minLng)
  const scaleY = (mapHeight - 2 * padding) / (maxLat - minLat)

  const toXY = (point) => ({
    x: padding + (point.lng - minLng) * scaleX,
    y: mapHeight - padding - (point.lat - minLat) * scaleY,
  })

  const pathD = routePoints.map((p, i) => {
    const { x, y } = toXY(p)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const start = toXY(routePoints[0])
  const end = toXY(routePoints[routePoints.length - 1])
  const color = getScoreColor(score)

  const bgClass = dark ? 'from-black/40 to-black/30' : 'from-slate-100 to-slate-200'
  const gridOpacity = dark ? 0.12 : 0.2

  return (
    <div className={`relative rounded-2xl overflow-hidden mb-3`} style={{ height: '120px', zIndex: 1 }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgClass}`}>
        {/* Street grid pattern */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: gridOpacity }}>
          <defs>
            <pattern id={`grid-${score}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={dark ? '#ffffff' : '#94a3b8'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${score})`} />
        </svg>
      </div>

      {/* Route SVG */}
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Glow layer */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
        />
        {/* Main route line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Start dot */}
        <circle cx={start.x} cy={start.y} r="5" fill={dark ? 'rgba(255,255,255,0.9)' : '#1e293b'} />
        <circle cx={start.x} cy={start.y} r="3" fill={color} />
        {/* End dot */}
        <circle cx={end.x} cy={end.y} r="5" fill={dark ? 'rgba(255,255,255,0.9)' : '#1e293b'} />
        <circle cx={end.x} cy={end.y} r="3" fill={color} />
      </svg>
    </div>
  )
}

// Interior photo filenames in public/
const INTERIOR_PHOTOS = [
  'Interior1.png',
  'interior2.png',
  'interior3.png',
  'interior4.png',
  'interior5.png',
]

// Stable photo selection — same segment always gets the same photo
function photoForSegment(segmentId) {
  if (!segmentId) return INTERIOR_PHOTOS[0]
  const idx = segmentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % INTERIOR_PHOTOS.length
  return INTERIOR_PHOTOS[idx]
}

// Real interior photo for indoor activity cards
function BuildingFacade({ location, segmentId }) {
  const src = `${import.meta.env.BASE_URL}${photoForSegment(segmentId)}`
  return (
    <div className="relative rounded-2xl overflow-hidden mb-3" style={{ height: '100px' }}>
      <img
        src={src}
        alt={location || 'Indoor location'}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}

// Enhanced improvement CTA for activities with optimization suggestions
function ImprovementCTA({ current, potential, label, activityType, onPress }) {
  if (!potential || potential <= current) return null

  const improvement = potential - current

  // Activity-specific CTA text
  const ctaText = {
    running: 'See best times',
    car: 'View alternatives',
    walking: 'Find cleaner route',
    cycling: 'Optimize route',
  }

  return (
    <div className="mt-4 -mx-1">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-4 shadow-lg shadow-green-500/20">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />

        {/* Sparkle decoration */}
        <div className="absolute top-2 right-3 text-white/30">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
          </svg>
        </div>

        <div className="relative">
          {/* Score improvement highlight */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
              <div>
                <div className="text-white/80 text-xs font-medium">{label}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white">{potential}%</span>
                  <span className="text-sm font-semibold text-green-200">+{improvement} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPress?.()
            }}
            className="w-full bg-white text-green-700 font-semibold text-sm py-2.5 px-4 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {ctaText[activityType] || 'View suggestion'}
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Get improvement label based on activity type
function getImprovementLabel(activityType) {
  switch (activityType) {
    case 'running':
      return 'Better timing available'
    case 'car':
      return 'Public transport alternative'
    case 'walking':
    case 'cycling':
      return 'Cleaner route available'
    default:
      return 'Improvement available'
  }
}

// Star segment banner — shown when no route or time improvement is available
function NearPerfectBanner({ reason }) {
  return (
    <div className="mt-3">
      {/* Divider with inline star label */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-px flex-1 bg-amber-100" />
        <div className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-amber-500" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-500">Star Segment</span>
        </div>
        <div className="h-px flex-1 bg-amber-100" />
      </div>
      {/* Celebration message */}
      <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">{reason}</p>
      </div>
    </div>
  )
}

// AirCoach section: divider label + coaching text + suggestion buttons
function AirCoachSection({ coachingText, children }) {
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">AirCoach</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>
      {coachingText && (
        <p className="text-xs text-gray-500 italic mb-2.5 leading-relaxed">{coachingText}</p>
      )}
      {children}
    </div>
  )
}

// Two-button row linking to optimised route and optimised time detail views
function OptimisationRow({ onViewRoute, onViewTime, routeRating = 3, timeRating = 3, white = false }) {
  const handleRoute = (e) => { e.stopPropagation(); onViewRoute?.() }
  const handleTime  = (e) => { e.stopPropagation(); onViewTime?.() }

  const routePct = Math.round(8 + (5 - routeRating) * 3)
  const timePct  = Math.round(6 + (5 - timeRating) * 4)

  const btnBase  = 'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-colors'
  const routeBtn = white
    ? `${btnBase} bg-white/20 text-white hover:bg-white/30`
    : `${btnBase} bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100`
  const timeBtn  = white
    ? `${btnBase} bg-white/20 text-white hover:bg-white/30`
    : `${btnBase} bg-sky-50 text-sky-700 border border-sky-200/60 hover:bg-sky-100`
  const divider = white ? 'bg-white/20' : 'bg-gray-100'

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleRoute} className={routeBtn}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Try {routePct}% cleaner route
      </button>
      <div className={`w-px h-6 shrink-0 ${divider}`} />
      <button onClick={handleTime} className={timeBtn}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Try {timePct}% cleaner time
      </button>
    </div>
  )
}

// Star Segment celebration component — combined card with map + coaching
function StarSegmentCard({
  activityType,
  score,
  scoreLevel,
  durationMinutes,
  startTime,
  endTime,
  location,
  distanceKm,
  avgPaceMinPerKm,
  hasStrava,
  starReason,
  routePoints,
  coachingText,
  routeRating,
  timeRating,
  onViewDetail,
  onViewRouteOptimization,
  onViewTimeOptimization,
  segment,
}) {
  const icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.walking
  const label = ACTIVITY_LABELS[activityType] || 'Activity'
  const isRunning = activityType === 'running'

  const handleCardClick = () => {
    if (isRunning && onViewDetail) {
      onViewDetail(segment)
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-lg ${isRunning ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Deep golden gradient background — darker for contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-500" />

      {/* Subtle radial highlight top-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />

      {/* Sparkle decorations */}
      <div className="absolute top-3 right-4 text-white/50">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </div>
      <div className="absolute bottom-12 left-3 text-white/30">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </div>

      {/* Content — sits above all background layers */}
      <div className="relative z-10 p-5">
        {/* 10 Star badge header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-bold text-white uppercase tracking-wide">10 Star Segment</span>
          </div>
          {/* Score pill */}
          <div className="bg-black/25 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-sm font-bold text-white">{score}%</span>
            <span className="text-xs text-white/75 font-medium capitalize ml-1">{scoreLevel}</span>
          </div>
        </div>

        {/* Route map — rendered inside the z-10 content layer so it's on top */}
        {routePoints && (
          <RouteMap routePoints={routePoints} score={score} dark />
        )}

        {/* Main content row */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <span className="text-white scale-110">{icon}</span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-base font-bold text-white drop-shadow-sm">{label}</span>
              {isRunning && hasStrava && (
                <span className="text-white/80">
                  <StravaIcon />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white text-xs font-medium mb-2 flex-wrap">
              <span className="bg-black/20 rounded-md px-1.5 py-0.5">{formatTime(startTime)}</span>
              <span className="bg-black/20 rounded-md px-1.5 py-0.5">{formatDuration(durationMinutes)}</span>
              {location && (
                <span className="bg-black/20 rounded-md px-1.5 py-0.5 truncate">{location}</span>
              )}
            </div>

            {/* Running stats */}
            {isRunning && distanceKm && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-white font-semibold">{distanceKm.toFixed(2)} <span className="text-white/70 font-normal">km</span></span>
                <span className="text-white font-semibold">{formatPace(avgPaceMinPerKm)} <span className="text-white/70 font-normal">/km</span></span>
              </div>
            )}
          </div>
        </div>

        {/* Celebration message */}
        <div className="mt-4 bg-black/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-sm text-white font-medium leading-relaxed">{starReason}</p>
          </div>
        </div>

        {/* Optimisation buttons */}
        {(routeRating || timeRating) && (
          <div className="mt-3 pt-3 border-t border-white/15">
            <OptimisationRow
              white
              routeRating={routeRating}
              timeRating={timeRating}
              onViewRoute={() => onViewRouteOptimization?.(segment)}
              onViewTime={() => onViewTimeOptimization?.(segment)}
            />
          </div>
        )}

        {/* View details CTA for running */}
        {isRunning && (
          <div className="mt-4 flex items-center justify-end">
            <div className="flex items-center gap-1 text-white text-sm font-semibold bg-black/25 backdrop-blur-sm rounded-full px-3 py-1.5">
              View details
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const OUTDOOR_ACTIVITIES = ['running', 'cycling', 'hiking', 'walking']

export default function ActivitySegment({
  activityType,
  score,
  scoreLevel,
  durationMinutes,
  startTime,
  endTime,
  location,
  distanceKm,
  avgPaceMinPerKm,
  avgSpeedKmh,
  elevationGain,
  hasStrava,
  potentialScore,
  isStarSegment,
  starReason,
  routePoints,
  coachingText,
  routeRating,
  timeRating,
  isNearPerfect,
  nearPerfectReason,
  buildingEra,
  constructionType,
  ventilationRating,
  onViewDetail,
  onViewIndoorDetail,
  onViewRouteOptimization,
  onViewTimeOptimization,
  segment,
}) {
  // Render star segment if applicable — now includes map + coaching + ratings
  if (isStarSegment && starReason) {
    return (
      <StarSegmentCard
        activityType={activityType}
        score={score}
        scoreLevel={scoreLevel}
        durationMinutes={durationMinutes}
        startTime={startTime}
        endTime={endTime}
        location={location}
        distanceKm={distanceKm}
        avgPaceMinPerKm={avgPaceMinPerKm}
        hasStrava={hasStrava}
        starReason={starReason}
        routePoints={routePoints}
        coachingText={coachingText}
        routeRating={routeRating}
        timeRating={timeRating}
        onViewDetail={onViewDetail}
        onViewRouteOptimization={onViewRouteOptimization}
        onViewTimeOptimization={onViewTimeOptimization}
        segment={segment}
      />
    )
  }

  const icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.walking
  const label = ACTIVITY_LABELS[activityType] || 'Activity'
  const colors = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.walking
  const gradientClasses = getScoreGradient(score)

  const isRunning = activityType === 'running'
  const isIndoor = activityType === 'indoor'
  const isOutdoor = OUTDOOR_ACTIVITIES.includes(activityType)
  const showPotentialScore = potentialScore && potentialScore > score
  const hasPotentialActivities = ['running', 'car', 'walking', 'cycling'].includes(activityType)

  const handleCardClick = () => {
    if (isRunning && onViewDetail) {
      onViewDetail(segment)
    } else if (isIndoor && onViewIndoorDetail) {
      onViewIndoorDetail(segment)
    }
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradientClasses} rounded-3xl p-5 shadow-sm border border-gray-100/50 ${(isRunning || isIndoor) ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={handleCardClick}
    >
      {/* Timeline bar */}
      <div className="mb-3">
        <TimelineBar startTime={startTime} endTime={endTime} score={score} />
      </div>

      {/* Route map for outdoor activities */}
      {isOutdoor && routePoints && (
        <RouteMap routePoints={routePoints} score={score} />
      )}

      {/* Building facade for indoor activities */}
      {isIndoor && (
        <BuildingFacade location={location} segmentId={segment?.id} />
      )}

      <div className="flex items-start gap-3">
        {/* Activity icon with type-specific colors */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}>
          <span className={`${colors.icon} scale-110`}>{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-900">{label}</span>
              {hasStrava && (
                <span className="text-[#FC4C02]" title="Recorded with Strava">
                  <StravaIcon />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ScoreBadge score={score} level={scoreLevel} size="sm" />
              {(isRunning || isIndoor) && (
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </div>
          </div>

          {/* Time and duration */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] text-gray-500">{formatTime(startTime)}</span>
            <span className="text-[11px] text-gray-300">•</span>
            <span className="text-[11px] text-gray-500">{formatDuration(durationMinutes)}</span>
            {location && (
              <>
                <span className="text-[11px] text-gray-300">•</span>
                <span className="text-[11px] text-gray-400 truncate">{location}</span>
              </>
            )}
          </div>

          {/* Activity stats */}
          {isRunning && distanceKm && (
            <div className="flex items-center gap-4 mt-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{distanceKm.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">km</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{formatPace(avgPaceMinPerKm)}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">/km pace</span>
              </div>
            </div>
          )}
          {activityType === 'cycling' && distanceKm && (
            <div className="flex items-center gap-4 mt-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{distanceKm.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">km</span>
              </div>
              {avgSpeedKmh && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{avgSpeedKmh}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">km/h avg</span>
                </div>
              )}
            </div>
          )}
          {activityType === 'hiking' && distanceKm && (
            <div className="flex items-center gap-4 mt-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{distanceKm.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">km</span>
              </div>
              {elevationGain && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{elevationGain}m</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">elevation</span>
                </div>
              )}
            </div>
          )}

          {/* AirCoach section — coaching insight + optimisation suggestions */}
          {isOutdoor && (routeRating || timeRating) && (
            <AirCoachSection coachingText={coachingText}>
              <OptimisationRow
                routeRating={routeRating}
                timeRating={timeRating}
                onViewRoute={() => onViewRouteOptimization?.(segment)}
                onViewTime={() => onViewTimeOptimization?.(segment)}
              />
            </AirCoachSection>
          )}

          {/* Star segment — no improvement available, celebrate the user */}
          {isOutdoor && isNearPerfect && (
            <NearPerfectBanner reason={nearPerfectReason} />
          )}
        </div>
      </div>
    </div>
  )
}
