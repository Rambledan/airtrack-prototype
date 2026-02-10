import { getScoreColor } from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

// Generate yesterday's score (matches YourExposure pattern)
const generateYesterdayScore = () => {
  return Math.floor(Math.random() * 35) + 55 // 55-90 range
}

// Store score so it's consistent during session
const YESTERDAY_SCORE = generateYesterdayScore()

export function getYesterdayScore() {
  return YESTERDAY_SCORE
}

function ScoreRingSmall({ score, size = 80 }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
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
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{score}%</span>
      </div>
    </div>
  )
}

export default function YesterdayScoreCard({ onNavigateToExposure }) {
  const score = YESTERDAY_SCORE
  const level = getScoreLevel(score)

  return (
    <button
      onClick={onNavigateToExposure}
      className="w-full bg-white rounded-2xl p-4 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-center gap-4">
        <ScoreRingSmall score={score} />

        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1">Yesterday's Score</div>
          <div className="text-base font-semibold text-gray-900 capitalize mb-1">
            {level} Air Quality
          </div>
          <div className="flex items-center gap-1 text-brand text-sm font-medium">
            <span>View details</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}
