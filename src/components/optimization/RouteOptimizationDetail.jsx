import { useState } from 'react'
import { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

// Generate original route points (through busy streets)
const generateOriginalRoute = () => {
  const points = []
  const startLat = 51.5328
  const startLng = -0.1058

  // Route through main roads
  const waypoints = [
    { lat: 51.5328, lng: -0.1058 }, // Start - Angel
    { lat: 51.5320, lng: -0.0950 }, // City Road (busy)
    { lat: 51.5300, lng: -0.0850 }, // Old Street (busy)
    { lat: 51.5280, lng: -0.0750 }, // Through traffic
    { lat: 51.5320, lng: -0.0650 }, // Shoreditch High St
    { lat: 51.5360, lng: -0.0550 }, // Bethnal Green Rd
    { lat: 51.5380, lng: -0.0450 }, // End point
  ]

  waypoints.forEach((wp, i) => {
    points.push(wp)
  })

  return points
}

// Generate optimized route points (through parks/quieter streets)
const generateOptimizedRoute = () => {
  const points = [
    { lat: 51.5328, lng: -0.1058 }, // Start - Angel
    { lat: 51.5350, lng: -0.0980 }, // Quieter residential
    { lat: 51.5380, lng: -0.0880 }, // Through park
    { lat: 51.5400, lng: -0.0750 }, // Canal path
    { lat: 51.5420, lng: -0.0600 }, // Victoria Park edge
    { lat: 51.5400, lng: -0.0500 }, // Quiet streets
    { lat: 51.5380, lng: -0.0450 }, // End point
  ]

  return points
}

function RouteComparisonMap({ originalRoute, optimizedRoute, showBoth }) {
  const mapWidth = 320
  const mapHeight = 240
  const padding = 25

  // Combine all points for bounds calculation
  const allPoints = [...originalRoute, ...optimizedRoute]
  const minLat = Math.min(...allPoints.map(p => p.lat)) - 0.002
  const maxLat = Math.max(...allPoints.map(p => p.lat)) + 0.002
  const minLng = Math.min(...allPoints.map(p => p.lng)) - 0.005
  const maxLng = Math.max(...allPoints.map(p => p.lng)) + 0.005

  const scaleX = (mapWidth - 2 * padding) / (maxLng - minLng)
  const scaleY = (mapHeight - 2 * padding) / (maxLat - minLat)

  const toPath = (points) => points.map((point, i) => {
    const x = padding + (point.lng - minLng) * scaleX
    const y = mapHeight - padding - (point.lat - minLat) * scaleY
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const originalPath = toPath(originalRoute)
  const optimizedPath = toPath(optimizedRoute)

  // Start and end points
  const startX = padding + (originalRoute[0].lng - minLng) * scaleX
  const startY = mapHeight - padding - (originalRoute[0].lat - minLat) * scaleY
  const endX = padding + (originalRoute[originalRoute.length - 1].lng - minLng) * scaleX
  const endY = mapHeight - padding - (originalRoute[originalRoute.length - 1].lat - minLat) * scaleY

  return (
    <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{ height: '240px' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Street grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="streetGridRoute" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#666" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streetGridRoute)" />
        </svg>

        {/* Routes */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
          {/* Original route (red/orange - worse AQ) */}
          {showBoth && (
            <>
              <path
                d={originalPath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />
              <path
                d={originalPath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
              />
            </>
          )}

          {/* Optimized route (green - better AQ) */}
          <path
            d={optimizedPath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          <path
            d={optimizedPath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start marker */}
          <circle cx={startX} cy={startY} r="10" fill="#3b82f6" />
          <circle cx={startX} cy={startY} r="5" fill="white" />

          {/* End marker */}
          <rect x={endX - 8} y={endY - 8} width="16" height="16" rx="3" fill="#8b5cf6" />
          <rect x={endX - 4} y={endY - 4} width="8" height="8" rx="1" fill="white" />
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 bg-green-500 rounded-full" />
            <span className="text-gray-600">Cleaner route</span>
          </div>
          {showBoth && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-1 bg-red-400 rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ef4444 0, #ef4444 4px, transparent 4px, transparent 8px)' }} />
              <span className="text-gray-600">Original</span>
            </div>
          )}
        </div>
      </div>

      {/* Markers legend */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-gray-600">End</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RouteToggle({ showBoth, onToggle }) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
          !showBoth ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
        }`}
      >
        Optimized only
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
          showBoth ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
        }`}
      >
        Compare routes
      </button>
    </div>
  )
}

function ExposureComparison({ originalScore, optimizedScore }) {
  const improvement = optimizedScore - originalScore
  const reductionPercent = Math.round((improvement / (100 - originalScore)) * 100)

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Exposure Reduction</h3>

      <div className="flex items-center justify-between mb-4">
        {/* Original */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto"
            style={{ backgroundColor: `${getScoreColor(originalScore)}20` }}
          >
            <span className="text-xl font-bold" style={{ color: getScoreColor(originalScore) }}>
              {originalScore}%
            </span>
          </div>
          <div className="text-xs text-gray-500">Original route</div>
        </div>

        {/* Arrow with improvement */}
        <div className="flex flex-col items-center px-4">
          <div className="bg-green-100 text-green-700 font-bold text-sm px-3 py-1 rounded-full mb-1">
            +{improvement}
          </div>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {/* Optimized */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto border-2 border-green-400"
            style={{ backgroundColor: `${getScoreColor(optimizedScore)}20` }}
          >
            <span className="text-xl font-bold" style={{ color: getScoreColor(optimizedScore) }}>
              {optimizedScore}%
            </span>
          </div>
          <div className="text-xs text-gray-500">Cleaner route</div>
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs text-gray-500 mb-1">PM2.5 Reduction</div>
          <div className="text-lg font-bold text-gray-900">-{Math.floor(improvement * 0.8)}%</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs text-gray-500 mb-1">NO₂ Reduction</div>
          <div className="text-lg font-bold text-gray-900">-{Math.floor(improvement * 1.2)}%</div>
        </div>
      </div>
    </div>
  )
}

function RouteDetails({ originalDistance, optimizedDistance }) {
  const distanceDiff = optimizedDistance - originalDistance
  const timeDiff = Math.round(distanceDiff * 6) // ~6 min per km at running pace

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Route Details</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Original route</div>
              <div className="text-xs text-gray-500">Via City Road, Old Street</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{originalDistance.toFixed(1)} km</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Cleaner route</div>
              <div className="text-xs text-gray-500">Via Regent's Canal, quieter streets</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{optimizedDistance.toFixed(1)} km</div>
            {distanceDiff !== 0 && (
              <div className={`text-xs ${distanceDiff > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {distanceDiff > 0 ? '+' : ''}{distanceDiff.toFixed(1)} km
              </div>
            )}
          </div>
        </div>

        {timeDiff > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center">
              ~{timeDiff} min extra for significantly cleaner air
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionCard({ optimizedScore }) {
  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <div className="text-white/80 text-sm">Breathe easier with</div>
          <div className="text-xl font-bold">{optimizedScore}% Air Quality</div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-white text-green-700 font-semibold text-sm py-3 px-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Navigate with this route
        </button>
        <button className="w-full bg-white/20 text-white font-semibold text-sm py-3 px-4 rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          Save route
        </button>
      </div>
    </div>
  )
}

export default function RouteOptimizationDetail({ segment, onBack }) {
  const [showBoth, setShowBoth] = useState(true)
  const [originalRoute] = useState(() => generateOriginalRoute())
  const [optimizedRoute] = useState(() => generateOptimizedRoute())

  // Scores
  const originalScore = segment?.score || 58
  const optimizedScore = Math.min(100, originalScore + Math.floor(Math.random() * 12) + 8)

  // Distances (km)
  const originalDistance = 4.2
  const optimizedDistance = 4.6

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
          <h1 className="text-lg font-semibold text-gray-900">Cleaner Route</h1>
          <p className="text-sm text-gray-500">Avoid high pollution areas</p>
        </div>
      </div>

      {/* Route Toggle */}
      <RouteToggle showBoth={showBoth} onToggle={setShowBoth} />

      {/* Map */}
      <RouteComparisonMap
        originalRoute={originalRoute}
        optimizedRoute={optimizedRoute}
        showBoth={showBoth}
      />

      {/* Exposure Comparison */}
      <ExposureComparison
        originalScore={originalScore}
        optimizedScore={optimizedScore}
      />

      {/* Route Details */}
      <RouteDetails
        originalDistance={originalDistance}
        optimizedDistance={optimizedDistance}
      />

      {/* Action */}
      <ActionCard optimizedScore={optimizedScore} />
    </div>
  )
}
