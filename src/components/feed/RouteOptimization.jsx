import ScoreBadge from '../shared/AqiScoreBadge'
import { getScoreLevel } from '../../utils/feedGenerator'

export default function RouteOptimization({
  originalRoute,
  suggestedRoute,
  currentScore,
  suggestedScore,
  improvementPercent,
  onViewForecast,
  onViewRoute,
}) {
  return (
    <div className="bg-gradient-to-r from-brand/5 to-brand-light/10 rounded-3xl p-5 border border-brand/15">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
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
          <h4 className="text-base font-semibold text-gray-900">Route optimization found</h4>
          <p className="text-[11px] text-gray-500 mt-1.5">
            We found a better route with{' '}
            <span className="font-semibold text-green-600">+{improvementPercent}% score improvement</span>
          </p>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Current: {originalRoute}</span>
              <ScoreBadge score={currentScore} level={getScoreLevel(currentScore)} size="sm" />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-green-600 font-medium">Better: {suggestedRoute}</span>
              <ScoreBadge score={suggestedScore} level={getScoreLevel(suggestedScore)} size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onViewRoute}
              className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-full hover:bg-brand-dark transition-colors"
            >
              View route
            </button>
            <button
              onClick={onViewForecast}
              className="text-xs font-semibold text-brand hover:text-brand/80 flex items-center gap-1"
            >
              See on map
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
