import { useState } from 'react'
import { getScoreLevel } from '../../utils/feedGenerator'
import { getScoreColor } from '../shared/AqiScoreBadge'
import LockedOverlay from '../shared/LockedOverlay'

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

// Day label helper
const getDayLabel = (offset) => {
  if (offset === 0) return 'Today'
  if (offset === 1) return 'Tomorrow'
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-GB', { weekday: 'long' }) // e.g. "Thursday"
}

// Generate forecast data for a given day offset (0 = today, 1 = tomorrow, etc.)
const generateForecastData = (dayOffset = 0) => {
  const data = []
  const now = new Date()

  if (dayOffset === 0) {
    // Today: start from current hour
    for (let i = 0; i < 24; i++) {
      const time = new Date(now)
      time.setMinutes(0, 0, 0)
      time.setHours(time.getHours() + i)

      const hour = time.getHours()
      let baseScore = 70
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        baseScore = 55 // Rush hour
      } else if (hour >= 10 && hour <= 16) {
        baseScore = 65 // Midday
      } else if (hour >= 22 || hour <= 5) {
        baseScore = 85 // Night
      }

      const score = Math.min(100, Math.max(20, baseScore + Math.floor(Math.random() * 20) - 10))
      data.push({ time, score, level: getScoreLevel(score) })
    }
  } else {
    // Future day: show full 24h from midnight
    const base = new Date(now)
    base.setDate(base.getDate() + dayOffset)
    base.setHours(0, 0, 0, 0)

    for (let i = 0; i < 24; i++) {
      const time = new Date(base)
      time.setHours(i)

      const hour = i
      let baseScore = 70
      if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
        baseScore = 55
      } else if (hour >= 10 && hour <= 16) {
        baseScore = 65
      } else if (hour >= 22 || hour <= 5) {
        baseScore = 85
      }

      // Slightly different randomness per day for visual variety
      const seed = dayOffset * 7
      const score = Math.min(100, Math.max(20, baseScore + Math.floor(Math.random() * 20) - 10 + seed % 5 - 2))
      data.push({ time, score, level: getScoreLevel(score) })
    }
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
          <div className="text-sm font-semibold text-gray-900">{selectedLocation.name}</div>
          <div className="text-xs text-gray-500">{selectedLocation.area}</div>
        </div>

        <svg viewBox="0 0 24 24" className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-gray-100 shadow-lg z-10 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-gray-50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {/* Saved locations */}
          <div className="p-2">
            <div className="text-xs font-medium text-gray-400 px-2 py-1 uppercase tracking-wide">Saved</div>
            {LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => { onSelect(loc); onToggle() }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-gray-50 transition-colors ${
                  selectedLocation.id === loc.id ? 'bg-brand/5' : ''
                }`}
              >
                <div className="text-sm font-medium text-gray-800">{loc.name}</div>
                <div className="text-xs text-gray-400 ml-auto">{loc.area}</div>
              </button>
            ))}
          </div>

          {/* Popular areas */}
          {filteredAreas.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-400 px-2 py-1 uppercase tracking-wide">Popular</div>
              {filteredAreas.map(area => (
                <button
                  key={area.id}
                  onClick={() => {
                    onSelect({ id: area.id, name: area.name, area: '', lat: area.lat, lng: area.lng })
                    onToggle()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800">{area.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MapView({ location, timeIndex, forecastData, isLive = true }) {
  const zones = generateMapZones(location.lat, location.lng, timeIndex)
  const currentScore = forecastData[timeIndex]?.score || 70
  const showLiveBadge = isLive && timeIndex === 0

  // Convert lat/lng to relative pixel positions
  const latRange = 0.075
  const lngRange = 0.075
  const toPercent = (val, min, range) => ((val - min) / range) * 100

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100/50 shadow-sm" style={{ height: '200px' }}>
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={`h${i}`} className="absolute w-full border-b border-slate-400" style={{ top: `${(i + 1) * 12.5}%` }} />
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={`v${i}`} className="absolute h-full border-r border-slate-400" style={{ left: `${(i + 1) * 12.5}%` }} />
          ))}
        </div>

        {/* AQ zones */}
        {zones.map(zone => {
          const x = toPercent(zone.lng, location.lng - lngRange/2, lngRange)
          const y = toPercent(location.lat + latRange/2 - zone.lat, 0, latRange)
          return (
            <div
              key={zone.id}
              className="absolute rounded-sm opacity-60"
              style={{
                left: `${Math.max(0, Math.min(95, x))}%`,
                top: `${Math.max(0, Math.min(95, y))}%`,
                width: '18%',
                height: '18%',
                backgroundColor: zone.color,
              }}
            />
          )
        })}

        {/* Location marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-sm font-bold text-white"
            style={{ backgroundColor: getScoreColor(currentScore) }}
          >
            {currentScore}
          </div>
          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5 shadow" />
        </div>
      </div>

      {/* Live/Forecast badge */}
      <div className="absolute top-3 left-3">
        {showLiveBadge ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-500 px-2.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live
          </span>
        ) : (
          <span className="text-xs font-semibold text-white bg-blue-500/80 px-2.5 py-1 rounded-full shadow-sm">
            Forecast
          </span>
        )}
      </div>
    </div>
  )
}

// Activity breathing-rate factors — higher factor = more air inhaled = greater personal exposure
const ACTIVITIES = [
  { id: 'still',   label: 'Still',   factor: 1.0 },
  { id: 'walking', label: 'Walking', factor: 1.1 },
  { id: 'cycling', label: 'Cycling', factor: 1.2 },
  { id: 'running', label: 'Running', factor: 1.3 },
]

// Adjusted score: breathing more air = greater pollution dose = lower effective quality score
const applyActivity = (score, factor) =>
  Math.max(0, Math.min(100, Math.round(score / factor)))

function TimeSlider({ forecastData, selectedIndex, onIndexChange, selectedDay, onDayChange, isPremium, onUpgrade }) {
  const [activity, setActivity] = useState('still')

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatLabel = (date, index) => {
    if (selectedDay === 0 && index === 0) return 'Now'
    if (selectedDay > 0) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    }
    const hours = index
    if (hours < 24) return `+${hours}h`
    return `+${Math.floor(hours / 24)}d`
  }

  const isContentLocked = selectedDay > 0 && !isPremium
  const currentActivity = ACTIVITIES.find(a => a.id === activity)
  const adjScore = (raw) => applyActivity(raw, currentActivity.factor)

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">

      {/* Day selector tabs */}
      <div className="flex gap-1.5 mb-4">
        {[0, 1, 2].map(day => {
          const label = getDayLabel(day)
          const locked = day > 0 && !isPremium
          const isSelected = day === selectedDay
          return (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span>{label}</span>
              {locked && (
                <svg viewBox="0 0 24 24" className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white/80' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Activity selector */}
      <div className="flex gap-1 mb-4">
        {ACTIVITIES.map(a => {
          const isActive = a.id === activity
          return (
            <button
              key={a.id}
              onClick={() => setActivity(a.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand/10 text-brand ring-1 ring-brand/25'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {a.label}
            </button>
          )
        })}
      </div>

      {/* Timeline heading */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Forecast Timeline</h3>
        <span className="text-sm text-gray-500">
          {formatTime(forecastData[selectedIndex].time)}
        </span>
      </div>

      {/* Timeline content — locked for non-premium on future days */}
      <LockedOverlay isLocked={isContentLocked} onTap={onUpgrade} showLockIcon={true}>
        {/* Time bar visualization */}
        <div className="relative mb-4">
          <div className="flex gap-0.5 h-12 items-end">
            {forecastData.map((data, i) => {
              const s = adjScore(data.score)
              return (
                <button
                  key={i}
                  onClick={() => !isContentLocked && onIndexChange(i)}
                  className={`flex-1 rounded-t transition-all ${
                    i === selectedIndex ? 'ring-2 ring-brand ring-offset-1' : ''
                  }`}
                  style={{
                    height: `${(s / 100) * 100}%`,
                    backgroundColor: getScoreColor(s),
                    opacity: i === selectedIndex ? 1 : 0.6,
                  }}
                />
              )
            })}
          </div>

          {/* Time labels */}
          <div className="flex justify-between mt-2">
            {selectedDay === 0 ? (
              <>
                <span className="text-xs text-gray-500">Now</span>
                <span className="text-xs text-gray-500">+6h</span>
                <span className="text-xs text-gray-500">+12h</span>
                <span className="text-xs text-gray-500">+18h</span>
                <span className="text-xs text-gray-500">+24h</span>
              </>
            ) : (
              <>
                <span className="text-xs text-gray-500">00:00</span>
                <span className="text-xs text-gray-500">06:00</span>
                <span className="text-xs text-gray-500">12:00</span>
                <span className="text-xs text-gray-500">18:00</span>
                <span className="text-xs text-gray-500">23:00</span>
              </>
            )}
          </div>
        </div>

        {/* Current forecast info */}
        {(() => {
          const s = adjScore(forecastData[selectedIndex].score)
          return (
            <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-xs text-gray-500">{formatLabel(forecastData[selectedIndex].time, selectedIndex)}</div>
                <div className="text-lg font-bold text-gray-900">
                  {s}%
                  <span className="text-sm font-normal text-gray-500 ml-1 capitalize">
                    {getScoreLevel(s)}
                  </span>
                </div>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${getScoreColor(s)}20` }}
              >
                <span className="text-lg font-bold" style={{ color: getScoreColor(s) }}>
                  {s}
                </span>
              </div>
            </div>
          )
        })()}
      </LockedOverlay>
    </div>
  )
}

function ForecastInsights({ forecastData, selectedDay = 0, isLocked = false, onUpgrade }) {
  // Find best and worst hours
  const sortedByScore = [...forecastData].sort((a, b) => b.score - a.score)
  const bestTime = sortedByScore[0]
  const worstTime = sortedByScore[sortedByScore.length - 1]

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const insightsTitle = selectedDay === 0
    ? "Today's Insights"
    : selectedDay === 1
      ? "Tomorrow's Insights"
      : `${getDayLabel(selectedDay)}'s Insights`

  return (
    <LockedOverlay isLocked={isLocked} onTap={onUpgrade}>
      <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">{insightsTitle}</h3>

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
    </LockedOverlay>
  )
}

export default function LiveForecast({ isPremium = false, onUpgrade }) {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0])
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false)
  const [forecastDataByDay] = useState(() => [
    generateForecastData(0),
    generateForecastData(1),
    generateForecastData(2),
  ])
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0)

  const handleDayChange = (day) => {
    setSelectedDay(day)
    setSelectedTimeIndex(0)
  }

  const activeData = forecastDataByDay[selectedDay]
  const isLocked = selectedDay > 0 && !isPremium

  return (
    <div className="space-y-4">
      {/* Location Selector */}
      <LocationSelector
        selectedLocation={selectedLocation}
        onSelect={setSelectedLocation}
        isOpen={locationSelectorOpen}
        onToggle={() => setLocationSelectorOpen(!locationSelectorOpen)}
      />

      {/* Map View */}
      <MapView
        location={selectedLocation}
        timeIndex={selectedTimeIndex}
        forecastData={activeData}
        isLive={selectedDay === 0}
      />

      {/* Time Slider with day tabs */}
      <TimeSlider
        forecastData={activeData}
        selectedIndex={selectedTimeIndex}
        onIndexChange={setSelectedTimeIndex}
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
        isPremium={isPremium}
        onUpgrade={onUpgrade}
      />

      {/* Insights */}
      <ForecastInsights
        forecastData={activeData}
        selectedDay={selectedDay}
        isLocked={isLocked}
        onUpgrade={onUpgrade}
      />
    </div>
  )
}
