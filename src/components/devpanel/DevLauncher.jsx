import { useDevSim } from '../../contexts/DevSimContext'

export default function DevLauncher() {
  const { togglePanel, panelOpen, sim } = useDevSim()

  return (
    <button
      onClick={togglePanel}
      className={`fixed bottom-20 right-4 z-50 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        panelOpen
          ? 'bg-gray-800 rotate-90'
          : sim.isActive
            ? 'bg-purple-600 animate-pulse'
            : 'bg-gray-700'
      }`}
      aria-label="Toggle Dev Panel"
    >
      {/* Gear icon */}
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>

      {/* Active indicator dot */}
      {sim.isActive && !panelOpen && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      )}
    </button>
  )
}
