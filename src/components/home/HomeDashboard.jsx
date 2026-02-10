import YesterdayScoreCard from './YesterdayScoreCard'
import TrackingStatusWidget from './TrackingStatusWidget'
import CleanRoutePromo from './CleanRoutePromo'
import Clean5kPromo from './Clean5kPromo'
import LiveForecast from '../forecast/LiveForecast'
import LocationPill from '../LocationPill'

export default function HomeDashboard({
  onNavigateToExposure,
  onNavigateToSettings,
  onRouteSearch,
  onClean5kSearch,
}) {
  return (
    <div className="space-y-4">
      {/* Location header */}
      <div className="flex items-center justify-between">
        <LocationPill />
        <span className="text-xs text-gray-400">Updated 2 min ago</span>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 gap-3">
        <YesterdayScoreCard onNavigateToExposure={onNavigateToExposure} />
        <TrackingStatusWidget onNavigateToSettings={onNavigateToSettings} />
      </div>

      {/* Promo cards */}
      <div className="space-y-3">
        <Clean5kPromo onStart={onClean5kSearch} />
        <CleanRoutePromo onSearch={onRouteSearch} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">Today's Forecast</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Live Forecast */}
      <LiveForecast />
    </div>
  )
}
