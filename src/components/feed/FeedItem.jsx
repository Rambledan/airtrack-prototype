import ActivitySegment from './ActivitySegment'
import BestTimeInsight from './BestTimeInsight'
import AirQualityAlert from './AirQualityAlert'
import DailySummary from './DailySummary'
import RouteOptimization from './RouteOptimization'
import NewLocationAlert from './NewLocationAlert'
import PartnershipCTA from './PartnershipCTA'
import BenchmarkCard from './BenchmarkCard'
import LockedOverlay from '../shared/LockedOverlay'

export default function FeedItem({
  item,
  onViewRunningDetail,
  onNavigateToTab,
  onViewRouteOptimization,
  onViewTimeOptimization,
  userState,
  onLockedTap,
}) {
  // Determine if this item should be locked based on user state
  const isLocked = () => {
    // Premium users see everything unlocked
    if (userState === 'registered_premium') return false

    // Forecast-related items are always accessible (air-quality-alert, best-time with forecast CTA)
    // But detail views from them are locked

    // For guests and registered_free users:
    if (userState === 'guest' || userState === 'registered_free') {
      // Segments are locked except Strava running for registered_free
      if (item.type === 'segment') {
        // Strava running segments unlocked for registered_free
        if (userState === 'registered_free' && item.activityType === 'running' && item.hasStrava) {
          return false
        }
        return true
      }

      // These insight cards are locked
      if (['daily-summary', 'benchmark', 'route-optimization'].includes(item.type)) {
        return true
      }
    }

    return false
  }

  const locked = isLocked()

  // Handle tap on locked content
  const handleLockedTap = () => {
    onLockedTap?.(item)
  }

  switch (item.type) {
    case 'segment':
      return (
        <LockedOverlay isLocked={locked} onTap={handleLockedTap}>
          <ActivitySegment
            {...item}
            segment={item}
            onViewDetail={locked ? handleLockedTap : onViewRunningDetail}
            onViewRouteOptimization={locked ? handleLockedTap : onViewRouteOptimization}
            onViewTimeOptimization={locked ? handleLockedTap : onViewTimeOptimization}
          />
        </LockedOverlay>
      )

    case 'best-time':
      // Best time insight - the forecast CTA works, but time optimization is locked
      return (
        <BestTimeInsight
          {...item}
          item={item}
          onViewForecast={() => onNavigateToTab?.('forecast')}
          onViewTimeOptimization={locked ? handleLockedTap : onViewTimeOptimization}
        />
      )

    case 'air-quality-alert':
      // Air quality alerts always work - they link to forecast
      return <AirQualityAlert {...item} onViewForecast={() => onNavigateToTab?.('forecast')} />

    case 'daily-summary':
      return (
        <LockedOverlay isLocked={locked} onTap={handleLockedTap}>
          <DailySummary {...item} onViewExposure={locked ? handleLockedTap : () => onNavigateToTab?.('exposure')} />
        </LockedOverlay>
      )

    case 'route-optimization':
      return (
        <LockedOverlay isLocked={locked} onTap={handleLockedTap}>
          <RouteOptimization
            {...item}
            onViewForecast={() => onNavigateToTab?.('forecast')}
            onViewRoute={locked ? handleLockedTap : () => onViewRouteOptimization?.(item)}
          />
        </LockedOverlay>
      )

    case 'new-location':
      return <NewLocationAlert {...item} />

    case 'partnership':
      return <PartnershipCTA {...item} />

    case 'benchmark':
      return (
        <LockedOverlay isLocked={locked} onTap={handleLockedTap}>
          <BenchmarkCard {...item} onViewExposure={locked ? handleLockedTap : () => onNavigateToTab?.('exposure')} />
        </LockedOverlay>
      )

    default:
      return null
  }
}
