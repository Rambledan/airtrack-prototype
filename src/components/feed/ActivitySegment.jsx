import ScoreBadge, { getScoreColor } from '../shared/AqiScoreBadge'

// Activity icons (stroke style, colored by activity type)
const ACTIVITY_ICONS = {
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
  hiking: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M7 21l3-9" />
      <path d="M17 21l-3-9" />
      <path d="M12 6v6" />
      <path d="M8 12h8" />
      <path d="M12 21v-3" />
      <path d="M3 21l4-6" />
      <path d="M21 21l-4-6" />
    </svg>
  ),
}

// Activity-type specific colors
const ACTIVITY_COLORS = {
  running: { bg: 'bg-rose-50', border: 'border-rose-200/50', icon: 'text-rose-500' },
  cycling: { bg: 'bg-sky-50', border: 'border-sky-200/50', icon: 'text-sky-500' },
  hiking: { bg: 'bg-emerald-50', border: 'border-emerald-200/50', icon: 'text-emerald-600' },
}

// Strava icon
const StravaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
  </svg>
)

const ACTIVITY_LABELS = {
  running: 'Running',
  cycling: 'Cycling',
  hiking: 'Hiking',
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

// Enhanced improvement CTA for activities with optimization suggestions
function ImprovementCTA({ current, potential, label, activityType, onPress }) {
  if (!potential || potential <= current) return null

  const improvement = potential - current

  // Activity-specific CTA text
  const ctaText = {
    running: 'See best times',
    cycling: 'Optimize route',
    hiking: 'Find better trail',
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
    case 'cycling':
      return 'Cleaner route available'
    case 'hiking':
      return 'Better trail available'
    default:
      return 'Improvement available'
  }
}

// Star Segment celebration component
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
  avgSpeedKmh,
  elevationGain,
  hasStrava,
  starReason,
  onViewDetail,
  segment,
}) {
  const icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.running
  const label = ACTIVITY_LABELS[activityType] || 'Activity'
  const isRunning = activityType === 'running'
  const isCycling = activityType === 'cycling'
  const isHiking = activityType === 'hiking'

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(segment)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Golden gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Sparkle decorations */}
      <div className="absolute top-3 right-4 text-white/40">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </div>
      <div className="absolute bottom-12 left-3 text-white/30">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative p-5">
        {/* Star badge header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-bold text-white uppercase tracking-wide">Star Segment</span>
          </div>
        </div>

        {/* Main content row */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
            <span className="text-white scale-125">{icon}</span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-white">{label}</span>
              {hasStrava && (
                <span className="text-white/70">
                  <StravaIcon />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <span>{formatTime(startTime)}</span>
              <span className="text-white/50">•</span>
              <span>{formatDuration(durationMinutes)}</span>
              {location && (
                <>
                  <span className="text-white/50">•</span>
                  <span className="truncate">{location}</span>
                </>
              )}
            </div>

            {/* Activity stats */}
            {distanceKm && (
              <div className="flex items-center gap-4 text-sm text-white/90">
                <span><span className="text-white/60">Distance</span> {distanceKm.toFixed(2)} km</span>
                {(isRunning || isHiking) && avgPaceMinPerKm && (
                  <span><span className="text-white/60">Pace</span> {formatPace(avgPaceMinPerKm)} /km</span>
                )}
                {isCycling && avgSpeedKmh && (
                  <span><span className="text-white/60">Speed</span> {avgSpeedKmh} km/h</span>
                )}
                {isHiking && elevationGain && (
                  <span><span className="text-white/60">Elev</span> {elevationGain}m</span>
                )}
              </div>
            )}
          </div>

          {/* Score */}
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold text-white">{score}%</div>
            <div className="text-xs text-white/70 font-medium capitalize">{scoreLevel}</div>
          </div>
        </div>

        {/* Celebration message */}
        <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-sm text-white/90 leading-relaxed">{starReason}</p>
          </div>
        </div>

        {/* View details CTA for running */}
        {isRunning && (
          <div className="mt-4 flex items-center justify-end">
            <div className="flex items-center gap-1 text-white text-sm font-medium bg-white/20 rounded-full px-3 py-1.5">
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
  onViewDetail,
  onViewRouteOptimization,
  onViewTimeOptimization,
  segment,
}) {
  // Render star segment if applicable
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
        onViewDetail={onViewDetail}
        segment={segment}
      />
    )
  }

  const icon = ACTIVITY_ICONS[activityType] || ACTIVITY_ICONS.running
  const label = ACTIVITY_LABELS[activityType] || 'Activity'
  const colors = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.running
  const gradientClasses = getScoreGradient(score)

  const isRunning = activityType === 'running'
  const isCycling = activityType === 'cycling'
  const isHiking = activityType === 'hiking'
  const showPotentialScore = potentialScore && potentialScore > score
  const hasPotentialActivities = ['running', 'cycling', 'hiking'].includes(activityType)

  const handleCardClick = () => {
    if (isRunning && onViewDetail) {
      onViewDetail(segment)
    }
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradientClasses} rounded-3xl p-5 shadow-sm border border-gray-100/50 ${isRunning ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={handleCardClick}
    >
      {/* Enhanced timeline bar */}
      <div className="mb-3">
        <TimelineBar startTime={startTime} endTime={endTime} score={score} />
      </div>

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
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
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

          {/* Activity-specific stats */}
          {distanceKm && (
            <div className="flex items-center gap-4 mt-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{distanceKm.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">km</span>
              </div>
              {isRunning && avgPaceMinPerKm && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{formatPace(avgPaceMinPerKm)}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">/km pace</span>
                </div>
              )}
              {isCycling && avgSpeedKmh && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{avgSpeedKmh}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">km/h avg</span>
                </div>
              )}
              {isHiking && avgPaceMinPerKm && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{formatPace(avgPaceMinPerKm)}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">/km pace</span>
                </div>
              )}
              {isHiking && elevationGain && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">{elevationGain}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">m elev</span>
                </div>
              )}
            </div>
          )}

          {/* View details CTA */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Tap to view details & suggestions</span>
              <div className="flex items-center gap-1 text-brand text-xs font-medium">
                View
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Improvement CTA */}
          {hasPotentialActivities && showPotentialScore && (
            <ImprovementCTA
              current={score}
              potential={potentialScore}
              label={getImprovementLabel(activityType)}
              activityType={activityType}
              onPress={() => {
                if (activityType === 'cycling' || activityType === 'hiking') {
                  onViewRouteOptimization?.(segment)
                } else if (activityType === 'running') {
                  onViewTimeOptimization?.(segment)
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
