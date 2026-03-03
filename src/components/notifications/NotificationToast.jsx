import { useEffect } from 'react'
import { useNotifications } from '../../contexts/NotificationContext'

export default function NotificationToast() {
  const { queue, dismissNotification } = useNotifications()

  const toasts = queue.filter(n => n.displayType === 'toast' && !n.dismissed)

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (toasts.length === 0) return
    const latest = toasts[toasts.length - 1]
    const timer = setTimeout(() => dismissNotification(latest.id), 4000)
    return () => clearTimeout(timer)
  }, [toasts, dismissNotification])

  if (toasts.length === 0) return null

  const latest = toasts[toasts.length - 1]

  return (
    <div className="fixed bottom-32 left-4 right-4 z-[60] pointer-events-none flex justify-center">
      <div
        className="pointer-events-auto max-w-sm w-full bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-start gap-3 animate-toast-in"
        onClick={() => dismissNotification(latest.id)}
      >
        <span className="text-lg mt-0.5 shrink-0">{latest.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{latest.title}</p>
          <p className="text-xs text-gray-300 mt-0.5 line-clamp-2">{latest.body}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); dismissNotification(latest.id) }}
          className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes toast-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-toast-in {
          animation: toast-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
