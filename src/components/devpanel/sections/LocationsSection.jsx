import { useDevSim } from '../../../contexts/DevSimContext'

const OPTIONS = [
  {
    value: 'none',
    label: 'No locations set',
    description: 'Indoor cards show generic "Indoors". Users can set type in detail screen.',
    emoji: '📦',
  },
  {
    value: 'all',
    label: 'All locations set',
    description: 'Indoor cards show street view, type label and area name.',
    emoji: '📍',
  },
]

export default function LocationsSection() {
  const { sim, setLocationProfilesOverride } = useDevSim()
  const current = sim.locationProfilesOverride

  const handleSelect = (value) => {
    setLocationProfilesOverride(current === value ? null : value)
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gray-500 mb-2">
        Override indoor location profile state across the feed
      </p>

      {current && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-3">
          <span className="text-[11px] text-blue-300 font-medium">
            Override active — real profiles paused
          </span>
          <button
            onClick={() => setLocationProfilesOverride(null)}
            className="text-[10px] text-blue-400 hover:text-blue-200 font-medium"
          >
            Clear
          </button>
        </div>
      )}

      {OPTIONS.map((opt) => {
        const isActive = current === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
              isActive
                ? 'bg-blue-500/20 border border-blue-500/40'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl mt-0.5">{opt.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-[12px] font-semibold ${isActive ? 'text-blue-200' : 'text-gray-200'}`}>
                  {opt.label}
                </p>
                {isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/30 text-blue-300 uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{opt.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
