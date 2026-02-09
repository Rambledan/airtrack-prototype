import ScoreBadge from '../shared/AqiScoreBadge'

export default function NewLocationAlert({ locationName, distanceFromHomeMiles, localScore, localScoreLevel }) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100/60">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
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
            <h4 className="text-base font-semibold text-indigo-800">You're somewhere new!</h4>
          </div>
          <p className="text-[11px] text-indigo-600 mt-1.5">
            Detected in <span className="font-semibold">{locationName}</span>
            <span className="text-indigo-500/80"> • {distanceFromHomeMiles} miles from home</span>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-indigo-500">Local air quality:</span>
            <ScoreBadge score={localScore} level={localScoreLevel} size="sm" />
          </div>

          <button className="mt-4 text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1">
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
