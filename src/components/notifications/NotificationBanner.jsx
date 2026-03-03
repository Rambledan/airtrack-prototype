import { useEffect } from 'react'
import { useNotifications } from '../../contexts/NotificationContext'

export default function NotificationBanner() {
  const { queue, dismissNotification } = useNotifications()

  const pushNotifs = queue.filter(n => n.displayType === 'push' && !n.dismissed)
  const fullscreenNotifs = queue.filter(n => n.displayType === 'fullscreen' && !n.dismissed)

  // Auto-dismiss push banners after 6s
  useEffect(() => {
    if (pushNotifs.length === 0) return
    const latest = pushNotifs[pushNotifs.length - 1]
    const timer = setTimeout(() => dismissNotification(latest.id), 6000)
    return () => clearTimeout(timer)
  }, [pushNotifs, dismissNotification])

  return (
    <>
      {/* Push banner — slides down from top */}
      {pushNotifs.length > 0 && (() => {
        const n = pushNotifs[pushNotifs.length - 1]
        return (
          <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none flex justify-center p-3 pt-[env(safe-area-inset-top,12px)]">
            <div
              className="pointer-events-auto max-w-sm w-full bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 flex items-start gap-3 animate-banner-in"
              onClick={() => dismissNotification(n.id)}
            >
              {/* App icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">AT</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">AirTrack</p>
                  <span className="text-[10px] text-gray-400">now</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Full-screen notification (re-engagement) */}
      {fullscreenNotifs.length > 0 && (() => {
        const n = fullscreenNotifs[fullscreenNotifs.length - 1]
        return (
          <div className="fixed inset-0 z-[70] bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-sm w-full text-center text-white">
              <span className="text-5xl mb-6 block">{n.emoji}</span>
              <h2 className="text-2xl font-bold mb-3">{n.title}</h2>
              <p className="text-white/80 mb-8 leading-relaxed">{n.body}</p>
              <button
                onClick={() => dismissNotification(n.id)}
                className="bg-white text-brand font-semibold py-3 px-8 rounded-xl text-sm hover:bg-white/90 transition-colors"
              >
                Open App
              </button>
              <button
                onClick={() => dismissNotification(n.id)}
                className="block mx-auto mt-4 text-sm text-white/60 hover:text-white/80 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes banner-in {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-banner-in {
          animation: banner-in 0.35s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
