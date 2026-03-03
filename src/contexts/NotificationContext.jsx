import { createContext, useContext, useState, useCallback, useRef } from 'react'

const NotificationContext = createContext(null)

// ── Notification templates ───────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  aq_alert: {
    id: 'aq_alert',
    label: 'AQ Alert',
    emoji: '⚠️',
    title: 'Air Quality Alert',
    body: 'Air quality has dropped to Poor in your area. Consider moving your outdoor activity indoors.',
    displayType: 'push',
    category: 'alert',
  },
  coaching_tip: {
    id: 'coaching_tip',
    label: 'Coaching Tip',
    emoji: '💡',
    title: 'Coaching Insight',
    body: 'Your morning run scored 82/100 — try starting 30 min earlier for cleaner air.',
    displayType: 'toast',
    category: 'insight',
  },
  daily_summary: {
    id: 'daily_summary',
    label: 'Daily Summary',
    emoji: '📊',
    title: 'Your Daily Summary',
    body: 'Today: 3 activities tracked, average AirScore 74. Your cleanest activity was a 7am walk.',
    displayType: 'push',
    category: 'summary',
  },
  route_suggestion: {
    id: 'route_suggestion',
    label: 'Route Suggestion',
    emoji: '🗺️',
    title: 'Cleaner Route Available',
    body: 'A route 12% cleaner than your usual commute is available via Regent\'s Canal.',
    displayType: 'toast',
    category: 'suggestion',
  },
  re_engagement: {
    id: 're_engagement',
    label: 'Re-engagement',
    emoji: '👋',
    title: 'We miss you!',
    body: 'You haven\'t tracked an activity in 3 days. Air quality is Good today — perfect for a run!',
    displayType: 'fullscreen',
    category: 're_engagement',
  },
}

// ── Strategy definitions ─────────────────────────────────────────────
export const STRATEGY_CONFIG = {
  aggressive: {
    label: 'Aggressive',
    description: 'All types, high frequency, push + toast + badge',
    allowedTypes: Object.keys(NOTIFICATION_TYPES),
    displayModes: ['push', 'toast', 'badge', 'fullscreen'],
  },
  moderate: {
    label: 'Moderate',
    description: 'Key alerts + daily summary, toast + badge',
    allowedTypes: ['aq_alert', 'coaching_tip', 'daily_summary'],
    displayModes: ['toast', 'badge'],
  },
  minimal: {
    label: 'Minimal',
    description: 'Critical alerts only, badge only',
    allowedTypes: ['aq_alert'],
    displayModes: ['badge'],
  },
  smart: {
    label: 'Smart',
    description: 'Time-aware, adapts to usage patterns',
    allowedTypes: Object.keys(NOTIFICATION_TYPES),
    displayModes: ['push', 'toast', 'badge'],
  },
}

export function NotificationProvider({ children }) {
  const [queue, setQueue] = useState([])           // Active notifications
  const [badges, setBadges] = useState({})          // { tabId: count }
  const [history, setHistory] = useState([])        // All sent notifications
  const nextId = useRef(1)

  // Push a notification into the queue
  const sendNotification = useCallback((typeId, overrideDisplay) => {
    const template = NOTIFICATION_TYPES[typeId]
    if (!template) return

    const notification = {
      id: nextId.current++,
      typeId,
      title: template.title,
      body: template.body,
      emoji: template.emoji,
      displayType: overrideDisplay || template.displayType,
      timestamp: new Date().toISOString(),
      dismissed: false,
    }

    setQueue(prev => [...prev, notification])
    setHistory(prev => [notification, ...prev].slice(0, 50))

    // Auto-increment badge for the Home tab
    setBadges(prev => ({ ...prev, feed: (prev.feed || 0) + 1 }))

    return notification.id
  }, [])

  // Dismiss a notification by id
  const dismissNotification = useCallback((id) => {
    setQueue(prev => prev.filter(n => n.id !== id))
  }, [])

  // Dismiss all
  const clearAll = useCallback(() => {
    setQueue([])
  }, [])

  // Clear badge count
  const clearBadge = useCallback((tabId) => {
    setBadges(prev => ({ ...prev, [tabId]: 0 }))
  }, [])

  // Clear all badges
  const clearAllBadges = useCallback(() => {
    setBadges({})
  }, [])

  // Get active notifications by display type
  const getByDisplayType = useCallback((type) => {
    return queue.filter(n => n.displayType === type && !n.dismissed)
  }, [queue])

  const value = {
    queue,
    badges,
    history,
    sendNotification,
    dismissNotification,
    clearAll,
    clearBadge,
    clearAllBadges,
    getByDisplayType,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext
