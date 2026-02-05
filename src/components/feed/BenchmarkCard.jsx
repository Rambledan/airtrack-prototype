import { getScoreColor } from '../shared/AqiScoreBadge'

export default function BenchmarkCard({ userScore, cityAverage, cityName, percentileBetterThan }) {
  const isBetter = userScore > cityAverage
  const maxScore = 100

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">Your score vs {cityName}</h4>

      {/* Bar comparison */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">You</span>
            <span className="text-xs font-semibold" style={{ color: getScoreColor(userScore) }}>{userScore}%</span>
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
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{cityName} avg</span>
            <span className="text-xs font-semibold text-gray-400">{cityAverage}%</span>
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
