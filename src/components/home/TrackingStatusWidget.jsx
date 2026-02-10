import { useUser } from '../../contexts/UserContext'

export default function TrackingStatusWidget({ onNavigateToSettings }) {
  const { user } = useUser()
  const isTrackingOn = user.permissions?.tracking ?? false

  return (
    <button
      onClick={onNavigateToSettings}
      className="w-full bg-white rounded-2xl p-4 border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isTrackingOn ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 ${isTrackingOn ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900">Background Tracking</div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isTrackingOn ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={`text-xs ${isTrackingOn ? 'text-green-600' : 'text-gray-500'}`}>
                {isTrackingOn ? 'Active' : 'Off'}
              </span>
            </div>
          </div>
        </div>

        <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}
