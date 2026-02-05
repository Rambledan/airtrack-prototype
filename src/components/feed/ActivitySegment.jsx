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

// Frosted glass improvement callout
function PotentialScoreCallout({ current, potential, label }) {
  if (!potential || potential <= current) return null

  const improvement = potential - current

  return (
    <div className="mt-3 -mx-1">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50/90 to-emerald-50/70 backdrop-blur-sm border border-green-200/50 px-3 py-2.5">
        {/* Subtle shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Upward arrow icon */}
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div>
            <span className="text-xs text-green-800 font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-green-700">{potential}%</span>
            <span className="text-xs font-semibold text-green-600 bg-green-100/80 px-1.5 py-0.5 rounded-full">
              +{improvement}
            </span>
          </div>
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
  hasStrava,
  potentialScore,
}) {
  const icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.walking
  const label = ACTIVITY_LABELS[activityType] || 'Activity'
  const colors = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.walking
  const gradientClasses = getScoreGradient(score)

  const isRunning = activityType === 'running'
  const showPotentialScore = potentialScore && potentialScore > score
  const hasPotentialActivities = ['running', 'car', 'walking', 'cycling'].includes(activityType)

  return (
    <div className={`bg-gradient-to-br ${gradientClasses} rounded-2xl p-4 shadow-sm border border-gray-100/80`}>
      {/* Enhanced timeline bar */}
      <div className="mb-3">
        <TimelineBar startTime={startTime} endTime={endTime} score={score} />
      </div>

      <div className="flex items-start gap-3">
        {/* Activity icon with type-specific colors */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}>
          <span className={colors.icon}>{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{label}</span>
              {isRunning && hasStrava && (
                <span className="text-[#FC4C02]" title="Recorded with Strava">
                  <StravaIcon />
                </span>
              )}
            </div>
            <ScoreBadge score={score} level={scoreLevel} size="sm" />
          </div>

          {/* Time and duration */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{formatTime(startTime)}</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-500">{formatDuration(durationMinutes)}</span>
            {location && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-400 truncate">{location}</span>
              </>
            )}
          </div>

          {/* Running-specific stats */}
          {isRunning && distanceKm && (
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Distance</span>
                <span className="font-medium text-gray-700">{distanceKm.toFixed(2)} km</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Pace</span>
                <span className="font-medium text-gray-700">{formatPace(avgPaceMinPerKm)} /km</span>
              </div>
            </div>
          )}

          {/* Frosted glass improvement callout */}
          {hasPotentialActivities && showPotentialScore && (
            <PotentialScoreCallout
              current={score}
              potential={potentialScore}
              label={getImprovementLabel(activityType)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
