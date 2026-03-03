import { useDevSim } from '../../../contexts/DevSimContext'
import { useUser } from '../../../contexts/UserContext'

const PERMISSIONS = [
  { key: 'location', label: 'Location', emoji: '📍' },
  { key: 'notifications', label: 'Notifications', emoji: '🔔' },
  { key: 'tracking', label: 'Background Tracking', emoji: '📡' },
  { key: 'appleHealth', label: 'Apple Health', emoji: '❤️' },
  { key: 'strava', label: 'Strava', emoji: '🏃' },
]

export default function PermissionsSection() {
  const { updateOverrideField } = useDevSim()
  const { user } = useUser()

  const permissions = user.permissions || {}

  const setAll = (value) => {
    const allPerms = {}
    PERMISSIONS.forEach(p => { allPerms[p.key] = value })
    updateOverrideField('permissions', allPerms)
  }

  return (
    <div className="space-y-2">
      {PERMISSIONS.map(({ key, label, emoji }) => (
        <div key={key} className="flex items-center justify-between py-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">{emoji}</span>
            <span className="text-[12px] text-gray-300">{label}</span>
          </div>
          <button
            onClick={() => updateOverrideField('permissions', {
              ...permissions,
              [key]: !permissions[key],
            })}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              permissions[key] ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              permissions[key] ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      ))}

      {/* Bulk actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => setAll(true)}
          className="flex-1 py-1.5 rounded-lg text-[11px] font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors"
        >
          Enable All
        </button>
        <button
          onClick={() => setAll(false)}
          className="flex-1 py-1.5 rounded-lg text-[11px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
        >
          Disable All
        </button>
      </div>
    </div>
  )
}
