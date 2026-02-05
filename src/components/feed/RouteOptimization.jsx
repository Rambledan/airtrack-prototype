import ScoreBadge from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

export default function RouteOptimization({
  originalRoute,
  suggestedRoute,
  currentScore,
  suggestedScore,
  improvementPercent,
}) {
  return (
    <div className="bg-gradient-to-r from-brand/5 to-brand-light/10 rounded-2xl p-4 border border-brand/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-brand"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">Route optimization found</h4>
          <p className="text-xs text-gray-600 mt-1">
            We found a better route with{' '}
            <span className="font-semibold text-green-600">+{improvementPercent}% score improvement</span>
          </p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Current: {originalRoute}</span>
              <ScoreBadge score={currentScore} level={getScoreLevel(currentScore)} size="sm" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-600">Better: {suggestedRoute}</span>
              <ScoreBadge score={suggestedScore} level={getScoreLevel(suggestedScore)} size="sm" />
            </div>
          </div>

          <button className="mt-3 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-full hover:bg-brand-dark transition-colors">
            View route
          </button>
        </div>
      </div>
    </div>
  )
}
