import { getScoreColor } from '../shared/AqiScoreBadge'

export default function BenchmarkCard({ userScore, cityAverage, cityName, percentileBetterThan, onViewExposure }) {
  const isBetter = userScore > cityAverage
  const maxScore = 100

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-base font-semibold text-gray-800">Your score vs {cityName}</h4>
        <button
          onClick={onViewExposure}
          className="text-xs font-semibold text-brand hover:text-brand/80 flex items-center gap-1"
        >
          View history
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Bar comparison */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-500">You</span>
            <span className="text-lg font-bold" style={{ color: getScoreColor(userScore) }}>{userScore}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(userScore / maxScore) * 100}%`,
                backgroundColor: getScoreColor(userScore)
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-500">{cityName} avg</span>
            <span className="text-lg font-bold text-gray-400">{cityAverage}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-300 rounded-full transition-all duration-500"
              style={{ width: `${(cityAverage / maxScore) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Percentile message */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        {isBetter ? (
          <span className="text-xs text-green-600 font-medium">
            Better than {percentileBetterThan}% of {cityName} residents
          </span>
        ) : (
          <span className="text-xs text-gray-500 font-medium">
            Room for improvement — see tips below
          </span>
        )}
      </div>
    </div>
  )
}
