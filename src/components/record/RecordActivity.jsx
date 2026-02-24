import { useState, useEffect, useRef, useCallback } from 'react'
import ScoreBadge, { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

// ------- Activity type definitions -------
const ACTIVITY_TYPES = [
  {
    id: 'running',
    label: 'Run',
    speedMs: 3.0, // metres per second
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="4" r="2" />
        <path d="M4 17l5-2 2-5 4 2 4-4" />
        <path d="M9 22l2-5M15 22l-2-7" />
      </svg>
    ),
  },
  {
    id: 'walking',
    label: 'Walk',
    speedMs: 1.3,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="M15 22v-5l-3-3 2-4 3 1v4M9 22l2-7-2-2M6 11l4 2" />
      </svg>
    ),
  },
  {
    id: 'cycling',
    label: 'Cycle',
    speedMs: 5.0,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <circle cx="15" cy="5" r="1" />
        <path d="M12 17.5V14l-3-3 4-3 2 3h3" />
      </svg>
    ),
  },
]

// Default activity names per type
const DEFAULT_NAMES = {
  running: ['Morning Run', 'Lunch Run', 'Evening Run', 'Park Run'],
  walking: ['Morning Walk', 'Lunchtime Walk', 'Evening Walk', 'Weekend Walk'],
  cycling: ['Morning Ride', 'Commute', 'Evening Ride', 'Weekend Cycle'],
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ------- Route trace for review screen -------
function RecordedRouteMap({ readings, score }) {
  if (!readings || readings.length < 2) return null

  const w = 320
  const h = 100
  const pad = 12

  // Generate a synthetic wandering path from the readings count
  const seed = readings.length
  const points = []
  let x = pad + 20
  let y = h / 2
  const step = (w - pad * 2 - 40) / (readings.length - 1)
  for (let i = 0; i < readings.length; i++) {
    points.push({ x, y })
    x += step
    y = Math.max(pad + 8, Math.min(h - pad - 8,
      y + (Math.sin(i * 1.3 + seed) * 12)
    ))
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const color = getScoreColor(score)
  const start = points[0]
  const end = points[points.length - 1]

  return (
    <div className="relative rounded-xl overflow-hidden mb-4" style={{ height: '100px' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
          <defs>
            <pattern id="rec-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rec-grid)" />
        </svg>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path d={pathD} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={start.x} cy={start.y} r="5" fill="#1e293b" />
        <circle cx={start.x} cy={start.y} r="3" fill={color} />
        <circle cx={end.x} cy={end.y} r="5" fill="#1e293b" />
        <circle cx={end.x} cy={end.y} r="3" fill={color} />
      </svg>
    </div>
  )
}

// ------- Sparkline for live recording -------
function AQSparkline({ readings }) {
  if (!readings || readings.length < 2) return null

  const w = 200
  const h = 40
  const pad = 4

  const min = Math.min(...readings) - 5
  const max = Math.max(...readings) + 5
  const range = Math.max(max - min, 10)

  const step = (w - pad * 2) / (readings.length - 1)
  const toY = (v) => pad + (h - pad * 2) * (1 - (v - min) / range)

  const pathD = readings.map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${toY(v)}`).join(' ')
  const lastScore = readings[readings.length - 1]
  const color = getScoreColor(lastScore)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: '40px' }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ------- Format helpers -------
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatDistance(metres) {
  if (metres < 1000) return `${Math.round(metres)}m`
  return `${(metres / 1000).toFixed(2)} km`
}

// ------- Main component -------
export default function RecordActivity({ locked = false }) {
  const [phase, setPhase] = useState('idle') // 'idle' | 'recording' | 'review' | 'saved'
  const [activityType, setActivityType] = useState('running')
  const [elapsed, setElapsed] = useState(0)
  const [readings, setReadings] = useState([])
  const [currentAQ, setCurrentAQ] = useState(null)
  const [activityName, setActivityName] = useState('')

  const baseAQRef = useRef(null)
  const timerRef = useRef(null)
  const aqTimerRef = useRef(null)

  const selectedType = ACTIVITY_TYPES.find(t => t.id === activityType)

  // Live AQ simulation — updates every 4s in both idle (preview) and recording
  const startAQSim = useCallback((base) => {
    baseAQRef.current = base
    const tick = () => {
      const prev = baseAQRef.current
      const next = Math.min(100, Math.max(10, Math.round(prev + (Math.random() - 0.5) * 12)))
      baseAQRef.current = next
      setCurrentAQ(next)
      if (phase === 'recording') {
        setReadings(r => [...r.slice(-29), next]) // keep last 30
      }
    }
    tick()
    return setInterval(tick, 4000)
  }, [phase])

  // Idle AQ preview — shows a live reading without recording
  useEffect(() => {
    if (phase !== 'idle') return
    const base = 55 + Math.round(Math.random() * 30)
    baseAQRef.current = base
    setCurrentAQ(base)
    const id = setInterval(() => {
      const next = Math.min(100, Math.max(10, Math.round(baseAQRef.current + (Math.random() - 0.5) * 8)))
      baseAQRef.current = next
      setCurrentAQ(next)
    }, 4000)
    return () => clearInterval(id)
  }, [phase])

  // Recording timers
  useEffect(() => {
    if (phase !== 'recording') return

    // Timer — increment every second
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)

    // AQ readings — update every 4s, push to array
    aqTimerRef.current = setInterval(() => {
      const next = Math.min(100, Math.max(10, Math.round(baseAQRef.current + (Math.random() - 0.5) * 12)))
      baseAQRef.current = next
      setCurrentAQ(next)
      setReadings(r => [...r.slice(-29), next])
    }, 4000)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(aqTimerRef.current)
    }
  }, [phase])

  const handleStartRecording = () => {
    setElapsed(0)
    setReadings(currentAQ ? [currentAQ] : [65])
    setPhase('recording')
  }

  const handleStopRecording = () => {
    clearInterval(timerRef.current)
    clearInterval(aqTimerRef.current)
    // Ensure at least a few readings for the review screen
    setReadings(r => r.length >= 3 ? r : [...r, ...Array(3 - r.length).fill(currentAQ || 65)])
    const name = randomFrom(DEFAULT_NAMES[activityType] || DEFAULT_NAMES.running)
    setActivityName(name)
    setPhase('review')
  }

  const handleSave = () => {
    setPhase('saved')
  }

  const handleDone = () => {
    setPhase('idle')
    setElapsed(0)
    setReadings([])
  }

  const handleDiscard = () => {
    setElapsed(0)
    setReadings([])
    setPhase('idle')
  }

  const avgAQ = readings.length > 0
    ? Math.round(readings.reduce((a, b) => a + b, 0) / readings.length)
    : (currentAQ || 65)

  const distanceMetres = elapsed * selectedType.speedMs

  // ── IDLE ────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Record Activity</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track your air quality exposure in real time</p>
        </div>

        {/* Activity type selector */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Activity</p>
          <div className="flex gap-2">
            {ACTIVITY_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActivityType(type.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                  activityType === type.id
                    ? 'bg-brand/10 border-brand text-brand shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className={activityType === type.id ? 'text-brand' : 'text-gray-400'}>
                  {type.icon}
                </span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live AQ card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Air Quality</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">Live</span>
            </div>
          </div>
          {currentAQ !== null ? (
            <div className="flex items-end gap-3">
              <span
                className="text-5xl font-bold tabular-nums"
                style={{ color: getScoreColor(currentAQ) }}
              >
                {currentAQ}
              </span>
              <div className="pb-1">
                <ScoreBadge score={currentAQ} size="md" />
              </div>
            </div>
          ) : (
            <div className="h-14 flex items-center">
              <div className="w-20 h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">Islington, London · Updated just now</p>
        </div>

        {/* Record button */}
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-gray-500 text-center">
            Tap to start recording your exposure
          </p>
          <button
            onClick={handleStartRecording}
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center"
            aria-label="Start recording"
          >
            {/* Record dot */}
            <span className="w-8 h-8 rounded-full bg-white" />
          </button>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">How it works</p>
          <ul className="space-y-1.5">
            {[
              'Choose your activity type above',
              'Tap record when you\'re ready to start',
              'Air quality is sampled throughout your route',
              'Stop when done to review and save your activity',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 text-[10px] font-bold">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ── RECORDING ────────────────────────────────────────────────────
  if (phase === 'recording') {
    return (
      <div className="space-y-5">
        {/* LIVE badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-red-500 uppercase tracking-widest">Recording</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
            {selectedType.icon}
            <span className="text-xs font-semibold text-gray-600">{selectedType.label}</span>
          </div>
        </div>

        {/* Main AQ score */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Air Quality Score</p>
          {currentAQ !== null && (
            <>
              <span
                className="text-7xl font-bold tabular-nums block"
                style={{ color: getScoreColor(currentAQ) }}
              >
                {currentAQ}
              </span>
              <div className="flex justify-center mt-2">
                <ScoreBadge score={currentAQ} size="md" />
              </div>
            </>
          )}

          {/* Sparkline */}
          {readings.length >= 2 && (
            <div className="mt-4 px-2">
              <AQSparkline readings={readings} />
              <p className="text-[10px] text-gray-400 mt-1 text-center">Last {readings.length} readings</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold tabular-nums text-gray-900">{formatDuration(elapsed)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Duration</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold tabular-nums text-gray-900">{formatDistance(distanceMetres)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">Distance</p>
          </div>
        </div>

        {/* Stop button */}
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-gray-500">Tap to stop recording</p>
          <button
            onClick={handleStopRecording}
            className="w-20 h-20 rounded-full bg-gray-900 hover:bg-gray-800 active:scale-95 transition-all shadow-lg flex items-center justify-center"
            aria-label="Stop recording"
          >
            {/* Stop square */}
            <span className="w-8 h-8 rounded-md bg-white" />
          </button>
        </div>
      </div>
    )
  }

  // ── REVIEW ────────────────────────────────────────────────────────
  if (phase === 'review') {
    const scoreLevel = getScoreLevel(avgAQ)

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Activity Summary</h2>
          <p className="text-sm text-gray-500 mt-0.5">Review before saving</p>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Route trace */}
          <div className="px-4 pt-4">
            <RecordedRouteMap readings={readings} score={avgAQ} />
          </div>

          <div className="px-4 pb-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activityType === 'running' ? 'bg-rose-50 text-rose-500'
                  : activityType === 'cycling' ? 'bg-sky-50 text-sky-500'
                  : 'bg-amber-50 text-amber-600'
                }`}>
                  {selectedType.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedType.label}</p>
                  <p className="text-[11px] text-gray-400">Just now</p>
                </div>
              </div>
              <ScoreBadge score={avgAQ} size="md" />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 py-3 border-t border-gray-50">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 tabular-nums">{formatDuration(elapsed)}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Duration</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 tabular-nums">{formatDistance(distanceMetres)}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Distance</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-lg font-bold tabular-nums" style={{ color: getScoreColor(avgAQ) }}>{avgAQ}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Avg AQ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity name input */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Activity name
          </label>
          <input
            type="text"
            value={activityName}
            onChange={e => setActivityName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-brand text-white font-semibold py-3.5 rounded-2xl hover:bg-brand/90 active:scale-[0.98] transition-all shadow-sm"
          >
            Save Activity
          </button>
          <button
            onClick={handleDiscard}
            className="w-full text-gray-500 font-medium py-2 text-sm hover:text-gray-700 transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    )
  }

  // ── SAVED ────────────────────────────────────────────────────────
  if (phase === 'saved') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-5">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Saved</h2>
          <p className="text-sm text-gray-500 mt-1">{activityName}</p>
        </div>

        {/* Score summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-5 w-full max-w-xs">
          <div
            className="text-5xl font-bold tabular-nums mb-2"
            style={{ color: getScoreColor(avgAQ) }}
          >
            {avgAQ}
          </div>
          <ScoreBadge score={avgAQ} size="md" />
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500">
            <span>{formatDuration(elapsed)}</span>
            <span className="text-gray-300">·</span>
            <span>{formatDistance(distanceMetres)}</span>
            <span className="text-gray-300">·</span>
            <span className="capitalize">{selectedType.label}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 max-w-xs">
          Your activity has been recorded. It will appear in your AirCoach feed shortly.
        </p>

        <button
          onClick={handleDone}
          className="bg-brand text-white font-semibold py-3 px-10 rounded-2xl hover:bg-brand/90 active:scale-[0.98] transition-all shadow-sm"
        >
          Done
        </button>
      </div>
    )
  }

  return null
}
