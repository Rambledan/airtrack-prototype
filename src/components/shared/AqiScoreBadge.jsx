import { getScoreLevel } from '../../utils/feedGenerator'

// Score colors: 100% = green (excellent), 5% = red (hazardous)
const SCORE_BADGE_STYLES = {
  excellent: 'bg-green-500/15 text-green-700',
  good: 'bg-emerald-500/15 text-emerald-700',
  moderate: 'bg-yellow-500/15 text-yellow-700',
  poor: 'bg-orange-500/15 text-orange-700',
  bad: 'bg-red-500/15 text-red-700',
  hazardous: 'bg-red-700/20 text-red-800',
}

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export default function ScoreBadge({ score, level, size = 'sm', showPercent = true }) {
  const scoreLevel = level || getScoreLevel(score)

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${SIZE_CLASSES[size]} ${SCORE_BADGE_STYLES[scoreLevel]}`}
    >
      {score}{showPercent && '%'}
    </span>
  )
}

// Export color getter for use in other components
export function getScoreColor(score) {
  if (score >= 85) return '#22c55e' // green-500
  if (score >= 70) return '#10b981' // emerald-500
  if (score >= 55) return '#eab308' // yellow-500
  if (score >= 40) return '#f97316' // orange-500
  if (score >= 25) return '#ef4444' // red-500
  return '#b91c1c' // red-700
}
