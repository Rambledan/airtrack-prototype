export default function HealthTip() {
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
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-green-800">Health Tip</h4>
          <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
            Air quality is good today. Great conditions for outdoor activities and exercise.
          </p>
        </div>
      </div>
    </div>
  )
}
