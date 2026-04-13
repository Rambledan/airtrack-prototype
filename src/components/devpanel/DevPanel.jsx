import { useState } from 'react'
import { useDevSim } from '../../contexts/DevSimContext'
import UserStateSection from './sections/UserStateSection'
import PermissionsSection from './sections/PermissionsSection'
import OnboardingSection from './sections/OnboardingSection'
import NotificationSection from './sections/NotificationSection'
import PersonaSection from './sections/PersonaSection'
import TimeSimSection from './sections/TimeSimSection'
import VersionHistorySection from './sections/VersionHistorySection'
import LocationsSection from './sections/LocationsSection'

const SECTIONS = [
  { id: 'personas', label: 'Personas', emoji: '👤', Component: PersonaSection },
  { id: 'locations', label: 'Locations', emoji: '📍', Component: LocationsSection },
  { id: 'user-state', label: 'User State', emoji: '🔑', Component: UserStateSection },
  { id: 'permissions', label: 'Permissions', emoji: '🔒', Component: PermissionsSection },
  { id: 'onboarding', label: 'Onboarding', emoji: '🚀', Component: OnboardingSection },
  { id: 'notifications', label: 'Notifications', emoji: '🔔', Component: NotificationSection },
  { id: 'time-sim', label: 'Time with App', emoji: '⏱️', Component: TimeSimSection },
  { id: 'versions', label: 'Version History', emoji: '📋', Component: VersionHistorySection },
]

export default function DevPanel() {
  const { panelOpen, closePanel, sim, resetSimulation } = useDevSim()
  const [expandedSections, setExpandedSections] = useState(['personas'])

  const toggleSection = (id) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (!panelOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={closePanel}
      />

      {/* Panel drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] bg-gray-900 rounded-t-2xl overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm">🛠️</span>
            <h2 className="text-sm font-bold text-white">Dev Simulation Panel</h2>
            {sim.isActive && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-500/20 text-green-400 uppercase tracking-wider">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {sim.isActive && (
              <button
                onClick={resetSimulation}
                className="text-[11px] text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
              >
                Reset All
              </button>
            )}
            <button
              onClick={closePanel}
              className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
              aria-label="Close panel"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active persona indicator */}
        {sim.activePersona && (
          <div className="px-4 py-2 bg-purple-500/10 border-b border-gray-700 shrink-0">
            <p className="text-[11px] text-purple-300">
              Active persona: <span className="font-semibold text-purple-200">{sim.activePersona}</span>
              {' · '}{sim.simulatedDaysWithApp} days with app
            </p>
          </div>
        )}

        {/* Scrollable sections */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {SECTIONS.map(({ id, label, emoji, Component }) => (
            <div key={id} className="border-b border-gray-800 last:border-b-0">
              {/* Section header */}
              <button
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{emoji}</span>
                  <span className="text-sm font-medium text-gray-200">{label}</span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    expandedSections.includes(id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Section content */}
              {expandedSections.includes(id) && (
                <div className="px-4 pb-3">
                  <Component />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide-up animation */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </>
  )
}
