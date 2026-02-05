import ScoreBadge from '../shared/AqiScoreBadge'

export default function DailySummary({ summaryDate, summary, averageScore, scoreLevel, totalSegments, outdoorMinutes }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-blue-800">{formatDate(summaryDate)}</h4>
            <ScoreBadge score={averageScore} level={scoreLevel} size="sm" />
          </div>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">{summary}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-blue-600">{totalSegments}</span>
              <span className="text-[10px] text-blue-500">segments</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-blue-600">{outdoorMinutes}m</span>
              <span className="text-[10px] text-blue-500">outdoors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
