import { useState } from 'react'
import { useDevSim } from '../../../contexts/DevSimContext'

export default function VersionHistorySection() {
  const { versionHistory, saveVersion, loadVersion, deleteVersion, sim } = useDevSim()
  const [newName, setNewName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  const handleSave = () => {
    if (!sim.isActive) return
    saveVersion(newName.trim() || undefined)
    setNewName('')
    setShowSaveInput(false)
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-3">
      {/* Save current */}
      {!showSaveInput ? (
        <button
          onClick={() => setShowSaveInput(true)}
          disabled={!sim.isActive}
          className={`w-full py-2 rounded-lg text-[11px] font-semibold transition-colors ${
            sim.isActive
              ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {sim.isActive ? '+ Save Current Snapshot' : 'Activate a simulation first'}
        </button>
      ) : (
        <div className="flex gap-1.5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Snapshot name (optional)"
            className="flex-1 bg-gray-800 text-white text-[11px] rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none placeholder:text-gray-600"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-lg text-[11px] font-semibold bg-blue-500 text-white hover:bg-blue-400 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => { setShowSaveInput(false); setNewName('') }}
            className="px-2 py-2 rounded-lg text-[11px] text-gray-400 hover:text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Version list */}
      {versionHistory.length === 0 ? (
        <p className="text-[11px] text-gray-600 text-center py-4">
          No saved snapshots yet
        </p>
      ) : (
        <div className="space-y-1.5">
          {versionHistory.map((version) => (
            <div
              key={version.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-200 truncate">{version.name}</p>
                <p className="text-[9px] text-gray-500">{formatDate(version.timestamp)}</p>
                {version.snapshot.activePersona && (
                  <p className="text-[9px] text-purple-400 mt-0.5">
                    Persona: {version.snapshot.activePersona}
                  </p>
                )}
              </div>
              <button
                onClick={() => loadVersion(version.id)}
                className="px-2 py-1 rounded text-[10px] font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                Load
              </button>
              <button
                onClick={() => deleteVersion(version.id)}
                className="px-2 py-1 rounded text-[10px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {versionHistory.length > 0 && (
        <p className="text-[9px] text-gray-600 text-center">
          {versionHistory.length} snapshot{versionHistory.length !== 1 ? 's' : ''} saved to localStorage
        </p>
      )}
    </div>
  )
}
