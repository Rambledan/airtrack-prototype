import { useState } from 'react'
import ScoreBadge, { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

// Mock data for exposure history
const generateExposureData = () => {
  const days = []
  const now = new Date()

  for (let i = 0; i < 14; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    days.push({
      date,
      score: Math.floor(Math.random() * 35) + 55, // 55-90 range
      outdoorMinutes: Math.floor(Math.random() * 120) + 30,
      indoorMinutes: Math.floor(Math.random() * 300) + 400,
    })
  }
  return days
}

const EXPOSURE_DATA = generateExposureData()

// Leaderboard mock data — includes route + time star averages
const LEADERBOARD_DATA = [
  { rank: 1, name: 'Sarah M.', score: 89, routeStars: 4.8, timeStars: 4.6, isUser: false },
  { rank: 2, name: 'James T.', score: 86, routeStars: 4.5, timeStars: 4.2, isUser: false },
  { rank: 3, name: 'You', score: 82, routeStars: 3.9, timeStars: 3.7, isUser: true },
  { rank: 4, name: 'Emma W.', score: 79, routeStars: 3.6, timeStars: 4.0, isUser: false },
  { rank: 5, name: 'Michael K.', score: 76, routeStars: 3.2, timeStars: 3.5, isUser: false },
  { rank: 6, name: 'Lisa P.', score: 74, routeStars: 2.9, timeStars: 3.1, isUser: false },
  { rank: 7, name: 'David R.', score: 71, routeStars: 2.7, timeStars: 2.8, isUser: false },
]

// Star history mock data
const STAR_HISTORY_ACTIVITIES = ['Running', 'Cycling', 'Walking', 'Hiking']
const STAR_HISTORY_LOCATIONS = ["Regent's Park", 'Thames Path', 'Victoria Park', 'Hampstead Heath', "Regent's Canal", 'Hyde Park']

const generateStarHistory = () => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(i / 2))
    return {
      id: i,
      activity: pick(STAR_HISTORY_ACTIVITIES),
      location: pick(STAR_HISTORY_LOCATIONS),
      date,
      routeRating: rand(2, 5),
      timeRating: rand(2, 5),
    }
  })
}

const STAR_HISTORY = generateStarHistory()

const AI_SUMMARIES = {
  day: [
    "Good day overall! Your morning commute had elevated PM2.5 levels, but you made up for it with excellent indoor air quality at the office. Consider taking the earlier train tomorrow for a 15% improvement.",
    "Mixed exposure today. Your lunch walk along the canal was in a moderate zone. The evening showed improvement as traffic died down.",
    "Excellent choices today! Your route via Victoria Park avoided the worst pollution. Keep using quieter streets for your walks.",
  ],
  week: [
    "This week showed a 12% improvement over last week. Your decision to cycle via the park route on Tuesday and Thursday significantly reduced your overall exposure. Weekend activities were consistently in the green zone.",
    "Solid week with room for improvement. Monday and Wednesday commutes had the highest exposure. Consider adjusting your travel times or routes on these days.",
    "Great progress! You've reduced your weekly exposure by avoiding peak traffic hours. Your average score is now 8 points above the London average.",
  ],
}

function RangeToggle({ range, onRangeChange }) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => onRangeChange('day')}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
          range === 'day'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Day
      </button>
      <button
        onClick={() => onRangeChange('week')}
        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
          range === 'week'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Week
      </button>
    </div>
  )
}

function DateSelector({ range, currentIndex, onNavigate, data }) {
  const formatDate = (date, isWeek) => {
    if (isWeek) {
      const endDate = new Date(date)
      const startDate = new Date(date)
      startDate.setDate(startDate.getDate() - 6)
      return `${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const maxIndex = range === 'day' ? data.length - 1 : Math.floor(data.length / 7)
  const currentDate = data[range === 'day' ? currentIndex : currentIndex * 7]?.date || new Date()

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onNavigate(Math.min(currentIndex + 1, maxIndex))}
        disabled={currentIndex >= maxIndex}
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <span className="text-base font-semibold text-gray-900">
        {formatDate(currentDate, range === 'week')}
      </span>

      <button
        onClick={() => onNavigate(Math.max(currentIndex - 1, 0))}
        disabled={currentIndex <= 0}
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}

function ScoreRing({ score, size = 140 }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)
  const level = getScoreLevel(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{score}%</span>
        <span className="text-sm text-gray-500 capitalize">{level}</span>
      </div>
    </div>
  )
}

function AISummary({ range }) {
  const summaries = AI_SUMMARIES[range]
  const summary = summaries[Math.floor(Math.random() * summaries.length)]

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100/40">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 014 4c0 1.1-.45 2.1-1.17 2.83L12 12l-2.83-3.17A4 4 0 1112 2z" />
            <path d="M12 12v10" />
            <path d="M8 18h8" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-indigo-900">AI Insights</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
    </div>
  )
}

function CityBenchmark({ userScore, cityAverage = 68 }) {
  const difference = userScore - cityAverage
  const isAbove = difference > 0

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-5">City Benchmark</h3>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{userScore}%</div>
          <div className="text-xs text-gray-500">Your Score</div>
        </div>

        <div className="flex items-center gap-1">
          <span className={`text-sm font-semibold ${isAbove ? 'text-green-600' : 'text-red-500'}`}>
            {isAbove ? '+' : ''}{difference}
          </span>
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 ${isAbove ? 'text-green-600' : 'text-red-500 rotate-180'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">{cityAverage}%</div>
          <div className="text-xs text-gray-500">London Avg</div>
        </div>
      </div>

      {/* Visual comparison bar */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gray-300 rounded-full"
          style={{ width: `${cityAverage}%` }}
        />
        <div
          className="absolute h-full rounded-full transition-all duration-500"
          style={{
            width: `${userScore}%`,
            background: `linear-gradient(90deg, ${getScoreColor(userScore)}dd, ${getScoreColor(userScore)})`,
          }}
        />
        {/* City average marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-600"
          style={{ left: `${cityAverage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        {isAbove
          ? `You're breathing cleaner air than ${Math.min(95, 50 + difference)}% of Londoners`
          : `Room for improvement - try optimizing your routes`
        }
      </p>
    </div>
  )
}

// Compact inline star cluster for Exposure tab
function StarMini({ rating, max = 5 }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-3 h-3 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function SegmentStarHistory() {
  const formatRelativeDate = (date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-500" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900">Segment Ratings</h3>
      </div>

      {/* Column headers */}
      <div className="flex items-center mb-2 px-1">
        <span className="flex-1 text-[10px] uppercase tracking-wide text-gray-400 font-medium">Activity</span>
        <div className="flex gap-5">
          <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium w-16 text-center">Route</span>
          <span className="text-[10px] uppercase tracking-wide text-gray-400 font-medium w-16 text-center">Time</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {STAR_HISTORY.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {/* Activity info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{item.activity}</div>
              <div className="text-[11px] text-gray-400 truncate">
                {item.location} · {formatRelativeDate(item.date)}
              </div>
            </div>

            {/* Star ratings */}
            <div className="flex gap-5 shrink-0">
              <div className="w-16 flex justify-center">
                <StarMini rating={item.routeRating} />
              </div>
              <div className="w-16 flex justify-center">
                <StarMini rating={item.timeRating} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Leaderboard({ onJoinNew }) {
  const [activeGroup, setActiveGroup] = useState('office')
  const [sortBy, setSortBy] = useState('score')

  const groups = [
    { id: 'office', name: 'Office Team' },
    { id: 'family', name: 'Family' },
  ]

  const sortOptions = [
    { id: 'score', label: 'Score' },
    { id: 'route', label: 'Route ★' },
    { id: 'time', label: 'Time ★' },
  ]

  const sortedData = [...LEADERBOARD_DATA].sort((a, b) => {
    if (sortBy === 'route') return b.routeStars - a.routeStars
    if (sortBy === 'time') return b.timeStars - a.timeStars
    return b.score - a.score
  }).map((entry, i) => ({ ...entry, displayRank: i + 1 }))

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Leaderboard</h3>

        {/* Group tabs */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeGroup === group.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort toggle */}
      <div className="flex gap-1 mb-4">
        {sortOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSortBy(opt.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortBy === opt.id
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-gray-50 text-gray-500 border border-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Leaderboard list */}
      <div className="space-y-1.5">
        {sortedData.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors ${
              entry.isUser ? 'bg-brand/10 border border-brand/20' : 'hover:bg-gray-50'
            }`}
          >
            {/* Rank */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              entry.displayRank === 1 ? 'bg-yellow-100 text-yellow-700' :
              entry.displayRank === 2 ? 'bg-gray-200 text-gray-600' :
              entry.displayRank === 3 ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              {entry.displayRank}
            </div>

            {/* Name */}
            <span className={`flex-1 text-sm truncate ${entry.isUser ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {entry.name}
            </span>

            {/* Score or star rating depending on sort */}
            {sortBy === 'score' && <ScoreBadge score={entry.score} size="sm" />}
            {sortBy === 'route' && (
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {entry.routeStars.toFixed(1)}
              </div>
            )}
            {sortBy === 'time' && (
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {entry.timeStars.toFixed(1)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Join new group */}
      <button
        onClick={onJoinNew}
        className="w-full mt-4 py-2.5 px-4 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Join a leaderboard
      </button>
    </div>
  )
}

function JoinLeaderboardModal({ isOpen, onClose }) {
  const [code, setCode] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 pb-8 sm:m-4 animate-slide-up">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:hidden" />

        <h2 className="text-lg font-semibold text-gray-900 mb-2">Join a Leaderboard</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the code shared by your group admin to join their leaderboard.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leaderboard Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g., OFFICE-2024"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
            maxLength={12}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={code.length < 4}
            className="flex-1 py-3 px-4 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}

export default function YourExposure() {
  const [range, setRange] = useState('day')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showJoinModal, setShowJoinModal] = useState(false)

  // Calculate score based on range and index
  const getScore = () => {
    if (range === 'day') {
      return EXPOSURE_DATA[currentIndex]?.score || 75
    }
    // Week average
    const startIdx = currentIndex * 7
    const weekData = EXPOSURE_DATA.slice(startIdx, startIdx + 7)
    const avgScore = Math.round(weekData.reduce((sum, d) => sum + d.score, 0) / weekData.length)
    return avgScore || 75
  }

  const score = getScore()

  return (
    <div className="space-y-4">
      {/* Range Toggle */}
      <RangeToggle range={range} onRangeChange={setRange} />

      {/* Date Selector */}
      <DateSelector
        range={range}
        currentIndex={currentIndex}
        onNavigate={setCurrentIndex}
        data={EXPOSURE_DATA}
      />

      {/* Score Ring */}
      <div className="flex justify-center py-4">
        <ScoreRing score={score} />
      </div>

      {/* AI Summary */}
      <AISummary range={range} />

      {/* Segment Star History */}
      <SegmentStarHistory />

      {/* City Benchmark */}
      <CityBenchmark userScore={score} />

      {/* Leaderboard */}
      <Leaderboard onJoinNew={() => setShowJoinModal(true)} />

      {/* Join Modal */}
      <JoinLeaderboardModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  )
}
