export default function MonitorShopScreen({ onBack, onHaveOne }) {
  const features = [
    { label: 'PM2.5', desc: 'Fine particle monitoring' },
    { label: 'VOC', desc: 'Volatile organic compounds' },
    { label: 'CO₂', desc: 'Carbon dioxide levels' },
    { label: 'Temperature', desc: 'Ambient temperature' },
    { label: 'Humidity', desc: 'Relative humidity' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-900">AirTrack Monitor</h2>
      </div>

      {/* Hero */}
      <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)', height: 220 }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">AirTrack Monitor</p>
            <p className="text-white/60 text-sm">Real-time indoor air quality</p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-3xl font-bold text-gray-900">£89</span>
          <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full">Pre-order</span>
        </div>
        <p className="text-sm text-gray-500">Ships when available · Free delivery</p>
      </div>

      {/* Features */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">What it monitors</h3>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <div className="relative">
          <button
            disabled
            className="w-full py-4 bg-brand text-white rounded-2xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pre-order now
          </button>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap pointer-events-none">
            Coming soon
          </div>
        </div>

        <button
          onClick={onHaveOne}
          className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-semibold hover:border-brand/40 hover:text-brand transition-colors"
        >
          I already have one
        </button>
      </div>
    </div>
  )
}
