import ScoreBadge from '../shared/AqiScoreBadge'
import DayScoreRing from '../shared/DayScoreRing'

export default function DailySummary({ summaryDate, summary, averageScore, scoreLevel, totalSegments, outdoorMinutes, segments, onViewExposure }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-5 border border-blue-100/60">
      <div className="flex items-start gap-4">
        <DayScoreRing
          score={averageScore}
          size={100}
          strokeWidth={8}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-blue-800">{formatDate(summaryDate)}</h4>
            <ScoreBadge score={averageScore} level={scoreLevel} size="sm" />
          </div>
          <p className="text-[11px] text-blue-600 mt-1.5 leading-relaxed">{summary}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-5">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-700">{totalSegments}</span>
                <span className="text-[10px] text-blue-500 uppercase tracking-wide">segments</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-700">{outdoorMinutes}</span>
                <span className="text-[10px] text-blue-500 uppercase tracking-wide">min outdoors</span>
              </div>
            </div>
            <button
              onClick={onViewExposure}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              Full report
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
