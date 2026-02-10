export default function CleanRoutePromo({ onSearch }) {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-100/50">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
            <path d="M2 12h20" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Clean Route Search
          </h3>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            Find cleaner routes for your commute. Compare air quality along different paths.
          </p>

          <button
            onClick={onSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded-lg hover:bg-sky-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search Routes
          </button>
        </div>
      </div>
    </div>
  )
}
