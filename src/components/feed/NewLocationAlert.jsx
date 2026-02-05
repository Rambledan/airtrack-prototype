import ScoreBadge from '../shared/AqiScoreBadge'

export default function NewLocationAlert({ locationName, distanceFromHomeMiles, localScore, localScoreLevel }) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-indigo-800">You're somewhere new!</h4>
          </div>
          <p className="text-xs text-indigo-700 mt-1">
            Detected in <span className="font-semibold">{locationName}</span>
            <span className="text-indigo-500"> • {distanceFromHomeMiles} miles from home</span>
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-indigo-600">Local air quality:</span>
            <ScoreBadge score={localScore} level={localScoreLevel} size="sm" />
          </div>

          <button className="mt-2 text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1">
            View local conditions
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
