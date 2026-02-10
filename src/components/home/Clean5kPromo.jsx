export default function Clean5kPromo({ onStart }) {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-4 border border-rose-100/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-rose-100/50 blur-2xl" />

      <div className="relative flex items-center gap-4">
        {/* Running illustration */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-200/50">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="3" />
            <path d="M6.5 23l6-10 3.5 1 2-7" />
            <path d="M9.5 13l-3 7" />
            <path d="M17.5 23l-2-5" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Clean 5K Run
            </h3>
            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
              BEST AIR NOW
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Find your cleanest 5K route starting from your current location.
          </p>

          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all shadow-md shadow-rose-200/50"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Find My Cleanest 5K
          </button>
        </div>
      </div>
    </div>
  )
}
