import { useDevSim } from '../../../contexts/DevSimContext'
import { useNotifications, NOTIFICATION_TYPES, STRATEGY_CONFIG } from '../../../contexts/NotificationContext'

export default function NotificationSection() {
  const { sim, setStrategy } = useDevSim()
  const { sendNotification, badges, clearAllBadges, clearAll, history } = useNotifications()

  const currentStrategy = sim.notificationStrategy || 'moderate'

  return (
    <div className="space-y-3">
      {/* Strategy picker */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
          Notification Strategy
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(STRATEGY_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setStrategy(key)}
              className={`px-2 py-2 rounded-lg text-left transition-colors ${
                currentStrategy === key
                  ? 'bg-blue-500/20 border border-blue-500/40'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <p className={`text-[11px] font-semibold ${
                currentStrategy === key ? 'text-blue-300' : 'text-gray-300'
              }`}>
                {config.label}
              </p>
              <p className="text-[9px] text-gray-500 mt-0.5">{config.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Send test notifications */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
          Send Test Notification
        </label>
        <div className="space-y-1">
          {Object.values(NOTIFICATION_TYPES).map((type) => (
            <button
              key={type.id}
              onClick={() => sendNotification(type.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-sm">{type.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-200">{type.label}</p>
              </div>
              <span className="text-[10px] text-gray-500 uppercase">{type.displayType}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Badge & history info */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-gray-500">
          Badges: {Object.values(badges).reduce((a, b) => a + b, 0)} · History: {history.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearAllBadges}
            className="text-[10px] text-gray-400 hover:text-gray-300 transition-colors"
          >
            Clear badges
          </button>
          <button
            onClick={clearAll}
            className="text-[10px] text-gray-400 hover:text-gray-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
