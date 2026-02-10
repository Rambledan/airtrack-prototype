import { useState } from 'react'
import TrackingStatusWidget from './TrackingStatusWidget'
import DestinationInput from './DestinationInput'
import LiveForecast from '../forecast/LiveForecast'
import LocationPill from '../LocationPill'

export default function HomeDashboard({
  onNavigateToSettings,
}) {
  const [destination, setDestination] = useState('')

  return (
    <div className="space-y-4">
      {/* Location header */}
      <div className="flex items-center justify-between">
        <LocationPill />
        <span className="text-xs text-gray-400">Updated 2 min ago</span>
      </div>

      {/* Destination input - floating above map */}
      <DestinationInput onDestinationChange={setDestination} />

      {/* Live Forecast / Map */}
      <LiveForecast />

      {/* Tracking status - at bottom */}
      <TrackingStatusWidget onNavigateToSettings={onNavigateToSettings} />
    </div>
  )
}
