import { useDevSim, PERSONAS } from '../../../contexts/DevSimContext'

export default function PersonaSection() {
  const { sim, loadPersona, closePanel } = useDevSim()

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] text-gray-500 mb-2">
        One-tap to load a full user configuration
      </p>
      {Object.values(PERSONAS).map((persona) => {
        const isActive = sim.activePersona === persona.id
        return (
          <button
            key={persona.id}
            onClick={() => {
              loadPersona(persona.id)
              closePanel()
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
              isActive
                ? 'bg-purple-500/20 border border-purple-500/40'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{persona.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-[12px] font-semibold ${
                  isActive ? 'text-purple-200' : 'text-gray-200'
                }`}>
                  {persona.label}
                </p>
                {isActive && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/30 text-purple-300 uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">{persona.description}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
