import TrackingStatusWidget from './TrackingStatusWidget'
import LiveForecast from '../forecast/LiveForecast'

export default function HomeDashboard({
  onNavigateToSettings,
}) {
  return (
    <div className="space-y-4">
      {/* Live Forecast with Location Selector and Destination Input */}
      <LiveForecast />

      {/* Tracking status - at bottom */}
      <TrackingStatusWidget onNavigateToSettings={onNavigateToSettings} />
    </div>
  )
}
