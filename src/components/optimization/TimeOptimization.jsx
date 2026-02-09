import { useState } from 'react'
import { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

// Generate hourly forecast data from 6am to 11pm
function generateHourlyForecast() {
  const hours = []
  for (let hour = 6; hour <= 23; hour++) {
    // Simulate realistic AQ patterns
    let baseScore = 70
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      baseScore = 50 // Rush hours - worse
    } else if (hour >= 10 && hour <= 16) {
      baseScore = 65 // Midday
    } else if (hour >= 20) {
      baseScore = 80 // Evening - better
    } else if (hour === 6) {
      baseScore = 88 // Early morning - best
    }

    const score = Math.min(100, Math.max(25, baseScore + Math.floor(Math.random() * 15) - 7))
    hours.push({
      hour,
      score,
      level: getScoreLevel(score),
    })
  }
  return hours
}

// Mock route coordinates
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

function RouteMap({ location }) {
  const routePoints = generateRoutePoints()
  const mapWidth = 320
  const mapHeight = 180
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
    <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{ height: '180px' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="streetGridTime" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#666" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streetGridTime)" />
        </svg>

        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
          <path
            d={pathData}
            fill="none"
            stroke="#6366f1"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          <path
            d={pathData}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={padding + (routePoints[0].lng - minLng) * scaleX}
            cy={mapHeight - padding - (routePoints[0].lat - minLat) * scaleY}
            r="6"
            fill="#22c55e"
          />
          <circle
            cx={padding + (routePoints[0].lng - minLng) * scaleX}
            cy={mapHeight - padding - (routePoints[0].lat - minLat) * scaleY}
            r="3"
            fill="white"
          />
        </svg>
      </div>

      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{location}</span>
        </div>
      </div>
    </div>
  )
}

function TimeSlot({ hour, score, isSelected, isBest, onClick }) {
  const color = getScoreColor(score)
  const formatHour = (h) => `${h.toString().padStart(2, '0')}:00`

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-xl transition-all ${
        isSelected ? 'ring-2 ring-brand ring-offset-2' : ''
      } ${isBest ? 'bg-green-50' : 'bg-gray-50'}`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1"
        style={{ backgroundColor: color }}
      >
        {score}
      </div>
      <span className={`text-xs font-medium ${isBest ? 'text-green-700' : 'text-gray-600'}`}>
        {formatHour(hour)}
      </span>
      {isBest && (
        <span className="text-[10px] text-green-600 font-semibold mt-0.5">BEST</span>
      )}
    </button>
  )
}

function TimeHeatmap({ hourlyData, selectedHour, onSelectHour, bestHour }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Best Time to Run</h3>

      {/* Time grid */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {hourlyData.slice(0, 12).map((data) => (
          <TimeSlot
            key={data.hour}
            hour={data.hour}
            score={data.score}
            isSelected={selectedHour === data.hour}
            isBest={bestHour === data.hour}
            onClick={() => onSelectHour(data.hour)}
          />
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {hourlyData.slice(12).map((data) => (
          <TimeSlot
            key={data.hour}
            hour={data.hour}
            score={data.score}
            isSelected={selectedHour === data.hour}
            isBest={bestHour === data.hour}
            onClick={() => onSelectHour(data.hour)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {['#ef4444', '#f97316', '#eab308', '#10b981', '#22c55e'].map((color, i) => (
                <div key={i} className="w-4 h-2 rounded-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span>Poor → Excellent</span>
          </div>
          <span>Tap to compare</span>
        </div>
      </div>
    </div>
  )
}

function ComparisonCard({ currentHour, currentScore, bestHour, bestScore }) {
  const improvement = bestScore - currentScore
  const formatHour = (h) => `${h.toString().padStart(2, '0')}:00`

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
        <div>
          <div className="text-white/80 text-xs">Potential improvement</div>
          <div className="text-xl font-bold">+{improvement} points</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-white/70 text-xs mb-1">Your time</div>
          <div className="text-lg font-bold">{formatHour(currentHour)}</div>
          <div className="text-sm text-white/80">{currentScore}% AQ</div>
        </div>
        <div className="bg-white/20 rounded-xl p-3 border border-white/30">
          <div className="text-white/70 text-xs mb-1">Best time</div>
          <div className="text-lg font-bold">{formatHour(bestHour)}</div>
          <div className="text-sm text-green-200">{bestScore}% AQ</div>
        </div>
      </div>

      <button className="w-full mt-4 bg-white text-green-700 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        Set reminder for {formatHour(bestHour)}
      </button>
    </div>
  )
}

function InsightCard({ bestHour }) {
  const formatHour = (h) => `${h.toString().padStart(2, '0')}:00`

  return (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-blue-900 mb-1">Why {formatHour(bestHour)} is best</div>
          <p className="text-xs text-blue-700 leading-relaxed">
            Early morning has the lowest traffic emissions and overnight dispersion of pollutants.
            Air quality typically degrades during rush hours (7-9am, 5-7pm) due to vehicle traffic.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TimeOptimization({ segment, onBack }) {
  const [hourlyData] = useState(() => generateHourlyForecast())

  // Find best hour
  const bestHourData = hourlyData.reduce((best, curr) =>
    curr.score > best.score ? curr : best
  , hourlyData[0])

  // Current hour from segment or default
  const currentHour = segment?.startTime
    ? new Date(segment.startTime).getHours()
    : 19

  const [selectedHour, setSelectedHour] = useState(currentHour)
  const selectedData = hourlyData.find(h => h.hour === selectedHour) || hourlyData[0]
  const currentData = hourlyData.find(h => h.hour === currentHour) || hourlyData[0]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Optimize Your Time</h1>
          <p className="text-sm text-gray-500">Find the best time for cleaner air</p>
        </div>
      </div>

      {/* Route Map */}
      <RouteMap location={segment?.location || "Regent's Canal"} />

      {/* Time Heatmap */}
      <TimeHeatmap
        hourlyData={hourlyData}
        selectedHour={selectedHour}
        onSelectHour={setSelectedHour}
        bestHour={bestHourData.hour}
      />

      {/* Comparison */}
      <ComparisonCard
        currentHour={currentHour}
        currentScore={currentData.score}
        bestHour={bestHourData.hour}
        bestScore={bestHourData.score}
      />

      {/* Insight */}
      <InsightCard bestHour={bestHourData.hour} />
    </div>
  )
}
