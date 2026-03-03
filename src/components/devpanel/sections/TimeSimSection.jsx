import { useDevSim } from '../../../contexts/DevSimContext'

const PRESETS = [
  { label: 'Day 1', days: 1 },
  { label: 'Week 1', days: 7 },
  { label: 'Month 1', days: 30 },
  { label: 'Month 3', days: 90 },
  { label: 'Month 6', days: 180 },
  { label: 'Year 1', days: 365 },
]

export default function TimeSimSection() {
  const { sim, setDaysWithApp } = useDevSim()

  const days = sim.simulatedDaysWithApp || 0

  return (
    <div className="space-y-3">
      {/* Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            Days with App
          </label>
          <span className="text-sm font-bold text-white tabular-nums">{days}</span>
        </div>
        <input
          type="range"
          min="0"
          max="365"
          value={days}
          onChange={(e) => setDaysWithApp(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700"
          style={{
            background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(days / 365) * 100}%, #374151 ${(days / 365) * 100}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-gray-600">0</span>
          <span className="text-[9px] text-gray-600">365</span>
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map(({ label, days: presetDays }) => (
            <button
              key={label}
              onClick={() => setDaysWithApp(presetDays)}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                days === presetDays
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Context info */}
      <div className="rounded-lg bg-gray-800/50 p-2.5">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          {days === 0 && 'Brand new user — no history, first impressions matter'}
          {days >= 1 && days < 7 && 'Early user — exploring features, forming habits'}
          {days >= 7 && days < 30 && 'Week-old user — starting to see patterns, may need nudges'}
          {days >= 30 && days < 90 && 'Monthly user — established routine, ready for deeper features'}
          {days >= 90 && days < 180 && 'Power user — deep engagement, may want advanced insights'}
          {days >= 180 && 'Long-term user — loyalty tested, re-engagement may be needed'}
        </p>
      </div>
    </div>
  )
}
