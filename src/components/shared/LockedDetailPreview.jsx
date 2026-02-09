import { LockBadge } from './LockedOverlay'

// Generic blurred preview for locked detail pages
export default function LockedDetailPreview({ onBack, onUnlock, title = 'Activity Details' }) {
  return (
    <div className="relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Blurred preview content */}
      <div className="relative">
        {/* Mock content that's blurred */}
        <div className="blur-md pointer-events-none select-none">
          {/* Mock map */}
          <div className="h-48 bg-gradient-to-br from-emerald-100 to-green-50 rounded-2xl mb-4" />

          {/* Mock stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">5.2km</div>
              <div className="text-xs text-gray-500">Distance</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">28:42</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">78%</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>

          {/* Mock suggestions */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
            <div className="h-4 bg-green-200/50 rounded w-2/3 mb-3" />
            <div className="h-10 bg-green-300/50 rounded-lg w-full" />
          </div>
        </div>

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-black/10 max-w-xs mx-4 text-center">
            {/* Lock icon */}
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock {title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Create a free account to see your full activity insights, optimization suggestions, and more.
            </p>

            <button
              onClick={onUnlock}
              className="w-full bg-brand text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand/90 transition-colors mb-3"
            >
              Create Free Account
            </button>

            <button
              onClick={onBack}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Specific preview for running detail
export function LockedRunningDetailPreview({ segment, onBack, onUnlock }) {
  return (
    <div className="relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Preview with real-ish data but blurred */}
      <div className="relative">
        <div className="blur-md pointer-events-none select-none">
          {/* Mock map with route */}
          <div className="relative h-56 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 rounded-2xl mb-4 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
              <path
                d="M50,150 Q100,50 200,100 T350,80"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8,4"
              />
              <circle cx="50" cy="150" r="8" fill="#22c55e" />
              <circle cx="350" cy="80" r="8" fill="#ef4444" />
            </svg>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Distance</div>
              <div className="text-xl font-bold text-gray-900">{segment?.distanceKm?.toFixed(2) || '5.20'} km</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Duration</div>
              <div className="text-xl font-bold text-gray-900">{segment?.durationMinutes || '32'} min</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Air Score</div>
              <div className="text-xl font-bold text-gray-900">{segment?.score || '72'}%</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Avg Pace</div>
              <div className="text-xl font-bold text-gray-900">5:30 /km</div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-800">Better Time Available</span>
            </div>
            <p className="text-sm text-green-700 mb-3">Run at 6:30am for 15% better air quality</p>
            <div className="h-10 bg-green-200/50 rounded-lg" />
          </div>
        </div>

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-black/10 max-w-xs mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13" cy="4" r="2" />
                <path d="M4 17l5-2 2-5 4 2 4-4" />
                <path d="M9 22l2-5" />
                <path d="M15 22l-2-7" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock Run Insights
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              See detailed air quality analysis, route suggestions, and optimal running times.
            </p>

            <button
              onClick={onUnlock}
              className="w-full bg-brand text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand/90 transition-colors mb-3"
            >
              Create Free Account
            </button>

            <button
              onClick={onBack}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
