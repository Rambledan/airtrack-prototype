import ScoreBadge from '../shared/AqiScoreBadge'

export default function AirQualityAlert({ currentScore, scoreLevel, recommendation, expectedDurationHours }) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-red-800">Poor Air Quality</h4>
            <ScoreBadge score={currentScore} level={scoreLevel} size="sm" />
          </div>
          <p className="text-xs text-red-700 mt-1 leading-relaxed">{recommendation}</p>
          {expectedDurationHours && (
            <p className="text-xs text-red-600/70 mt-1">
              Expected to last ~{expectedDurationHours} hours
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
