import { useState, useEffect } from 'react'
import { getScoreLevel } from '../../utils/feedGenerator'
import { getScoreColor } from '../shared/AqiScoreBadge'
import DestinationInput from '../home/DestinationInput'

// Mock locations for London
const LOCATIONS = [
  { id: 'current', name: 'Current Location', area: 'Islington', lat: 51.5362, lng: -0.1033 },
  { id: 'home', name: 'Home', area: 'Angel', lat: 51.5328, lng: -0.1058 },
  { id: 'work', name: 'Work', area: 'Canary Wharf', lat: 51.5054, lng: -0.0235 },
  { id: 'gym', name: 'Gym', area: 'Shoreditch', lat: 51.5246, lng: -0.0794 },
]

const POPULAR_AREAS = [
  { id: 'victoria-park', name: 'Victoria Park', lat: 51.5362, lng: -0.0395 },
  { id: 'regents-park', name: "Regent's Park", lat: 51.5313, lng: -0.1570 },
  { id: 'hyde-park', name: 'Hyde Park', lat: 51.5073, lng: -0.1657 },
  { id: 'hampstead', name: 'Hampstead Heath', lat: 51.5604, lng: -0.1639 },
  { id: 'greenwich', name: 'Greenwich Park', lat: 51.4769, lng: -0.0005 },
]

// Generate forecast data for next 24 hours
const generateForecastData = () => {
  const data = []
  const now = new Date()

  for (let i = 0; i < 24; i++) {
    const time = new Date(now)
    time.setMinutes(0, 0, 0)
    time.setHours(time.getHours() + i)

    // Simulate AQ patterns (worse during rush hours)
    const hour = time.getHours()
    let baseScore = 70

    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      baseScore = 55 // Rush hour
    } else if (hour >= 10 && hour <= 16) {
      baseScore = 65 // Midday
    } else if (hour >= 22 || hour <= 5) {
      baseScore = 85 // Night
    }

    // Add some randomness
    const score = Math.min(100, Math.max(20, baseScore + Math.floor(Math.random() * 20) - 10))

    data.push({
      time,
      score,
      level: getScoreLevel(score),
    })
  }

  return data
}

// Mock AQ zones for the map (grid overlay)
const generateMapZones = (centerLat, centerLng, timeIndex) => {
  const zones = []
  const gridSize = 5
  const cellSize = 0.015 // degrees

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat - (cellSize * gridSize / 2) + (i * cellSize)
      const lng = centerLng - (cellSize * gridSize / 2) + (j * cellSize)

      // Vary scores based on position and time
      const distFromCenter = Math.sqrt(Math.pow(i - gridSize/2, 2) + Math.pow(j - gridSize/2, 2))
      const baseScore = 75 - (distFromCenter * 5) + (timeIndex * 0.5)
      const score = Math.min(100, Math.max(30, baseScore + Math.floor(Math.random() * 15)))

      zones.push({
        id: `${i}-${j}`,
        lat,
        lng,
        score,
        color: getScoreColor(score),
      })
    }
  }

  return zones
}

function LocationSelector({ selectedLocation, onSelect, isOpen, onToggle }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAreas = POPULAR_AREAS.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      {/* Selected Location Button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100/50 shadow-sm"
      >
        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">{selectedLocation.name}</div>
          <div className="text-xs text-gray-500">{selectedLocation.area || selectedLocation.name}</div>
        </div>
        <svg viewBox="0 0 24 24" className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100/50 shadow-lg z-20 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
          </div>

          {/* Saved Locations */}
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase">Saved</div>
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  onSelect(loc)
                  onToggle()
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedLocation.id === loc.id ? 'bg-brand/10' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  loc.id === 'current' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {loc.id === 'current' ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.area}</div>
                </div>
                {selectedLocation.id === loc.id && (
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Popular Areas */}
          <div className="p-2 border-t border-gray-100">
            <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase">Popular Areas</div>
            {filteredAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => {
                  onSelect({ ...area, area: area.name })
                  onToggle()
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{area.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MapView({ location, timeIndex, forecastData }) {
  const zones = generateMapZones(location.lat, location.lng, timeIndex)
  const currentScore = forecastData[timeIndex]?.score || 70

  return (
    <div className="relative bg-gray-100 rounded-3xl overflow-hidden" style={{ height: '280px' }}>
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
        {/* Grid pattern for streets */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* AQ overlay zones */}
        <div className="absolute inset-0 flex flex-wrap">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="transition-colors duration-500"
              style={{
                width: '20%',
                height: '20%',
                backgroundColor: `${zone.color}40`,
              }}
            />
          ))}
        </div>

        {/* Location marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: getScoreColor(currentScore) }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: getScoreColor(currentScore) }}
            >
              <span className="text-white font-bold text-sm">{currentScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="text-xs text-gray-500 mb-1">Air Quality</div>
        <div className="flex gap-1">
          {['#22c55e', '#10b981', '#eab308', '#f97316', '#ef4444'].map((color, i) => (
            <div
              key={i}
              className="w-6 h-2 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
          <span>Good</span>
          <span>Poor</span>
        </div>
      </div>

      {/* Live/Forecast badge */}
      <div className="absolute top-3 left-3">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
          timeIndex === 0
            ? 'bg-green-500 text-white'
            : 'bg-white text-gray-700'
        }`}>
          {timeIndex === 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Live
            </span>
          ) : (
            'Forecast'
          )}
        </div>
      </div>
    </div>
  )
}

function TimeSlider({ forecastData, selectedIndex, onIndexChange }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatLabel = (date, index) => {
    if (index === 0) return 'Now'
    const hours = index
    if (hours < 24) return `+${hours}h`
    return `+${Math.floor(hours / 24)}d`
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Forecast Timeline</h3>
        <span className="text-sm text-gray-500">
          {formatTime(forecastData[selectedIndex].time)}
        </span>
      </div>

      {/* Time bar visualization */}
      <div className="relative mb-4">
        <div className="flex gap-0.5 h-12 items-end">
          {forecastData.map((data, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`flex-1 rounded-t transition-all ${
                i === selectedIndex ? 'ring-2 ring-brand ring-offset-1' : ''
              }`}
              style={{
                height: `${(data.score / 100) * 100}%`,
                backgroundColor: getScoreColor(data.score),
                opacity: i === selectedIndex ? 1 : 0.6,
              }}
            />
          ))}
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Now</span>
          <span className="text-xs text-gray-500">+6h</span>
          <span className="text-xs text-gray-500">+12h</span>
          <span className="text-xs text-gray-500">+18h</span>
          <span className="text-xs text-gray-500">+24h</span>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={forecastData.length - 1}
        value={selectedIndex}
        onChange={(e) => onIndexChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
      />

      {/* Current forecast info */}
      <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <div className="text-xs text-gray-500">{formatLabel(forecastData[selectedIndex].time, selectedIndex)}</div>
          <div className="text-lg font-bold text-gray-900">
            {forecastData[selectedIndex].score}%
            <span className="text-sm font-normal text-gray-500 ml-1 capitalize">
              {forecastData[selectedIndex].level}
            </span>
          </div>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${getScoreColor(forecastData[selectedIndex].score)}20` }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: getScoreColor(forecastData[selectedIndex].score) }}
          >
            {forecastData[selectedIndex].score}
          </span>
        </div>
      </div>
    </div>
  )
}

function ForecastInsights({ forecastData }) {
  // Find best and worst hours
  const sortedByScore = [...forecastData].sort((a, b) => b.score - a.score)
  const bestTime = sortedByScore[0]
  const worstTime = sortedByScore[sortedByScore.length - 1]

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Today's Insights</h3>

      <div className="space-y-3">
        {/* Best time */}
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-xs text-green-600 font-medium">Best time for outdoor activity</div>
            <div className="text-sm font-semibold text-gray-900">{formatTime(bestTime.time)} • {bestTime.score}% AQ</div>
          </div>
        </div>

        {/* Worst time */}
        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-xs text-orange-600 font-medium">Avoid outdoor exercise</div>
            <div className="text-sm font-semibold text-gray-900">{formatTime(worstTime.time)} • {worstTime.score}% AQ</div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-blue-600 font-medium">Tip</div>
            <div className="text-sm text-gray-700">Morning hours typically have the best air quality. Plan your run or cycle before 9am for optimal conditions.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LiveForecast() {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0])
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false)
  const [forecastData] = useState(() => generateForecastData())
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0)

  // Auto-advance time for demo (optional)
  useEffect(() => {
    if (selectedTimeIndex === 0) {
      // Only auto-play if on "now"
      return
    }
  }, [selectedTimeIndex])

  return (
    <div className="space-y-4">
      {/* Location Selector */}
      <LocationSelector
        selectedLocation={selectedLocation}
        onSelect={setSelectedLocation}
        isOpen={locationSelectorOpen}
        onToggle={() => setLocationSelectorOpen(!locationSelectorOpen)}
      />

      {/* Destination Input */}
      <DestinationInput onDestinationChange={() => {}} />

      {/* Map View */}
      <MapView
        location={selectedLocation}
        timeIndex={selectedTimeIndex}
        forecastData={forecastData}
      />

      {/* Time Slider */}
      <TimeSlider
        forecastData={forecastData}
        selectedIndex={selectedTimeIndex}
        onIndexChange={setSelectedTimeIndex}
      />

      {/* Insights */}
      <ForecastInsights forecastData={forecastData} />
    </div>
  )
}
