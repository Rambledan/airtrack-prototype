import { getScoreColor } from './AqiScoreBadge'

/**
 * DayScoreRing - A circular progress ring showing a score percentage
 * The ring fills based on the score (68% score = 68% of circumference filled)
 * Color is determined by the score level (green for good, red for poor)
 */
export default function DayScoreRing({
  score,
  size = 100,
  strokeWidth = 8
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring - gray */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Score ring - colored fill */}
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
        />
      </svg>
      {/* Center score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{score}%</span>
      </div>
    </div>
  )
}
