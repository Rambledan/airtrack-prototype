import ScoreBadge from '../shared/AqiScoreBadge'

export default function BestTimeInsight({ recommendedTime, predictedScore, scoreLevel, activitySuggestion }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const activityLabels = {
    running: 'run',
    cycling: 'bike ride',
    walking: 'walk',
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-green-800">
            Best time for your {activityLabels[activitySuggestion] || activitySuggestion}
          </h4>
          <p className="text-xs text-green-700 mt-1 leading-relaxed">
            {formatTime(recommendedTime)} tomorrow — Expected score{' '}
            <ScoreBadge score={predictedScore} level={scoreLevel} size="sm" />
          </p>
          <button className="mt-2 text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1">
            Set reminder
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
