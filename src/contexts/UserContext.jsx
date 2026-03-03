import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const STORAGE_KEY = 'airtrack_user'

const DEFAULT_USER = {
  state: null, // null | 'guest' | 'registered_free' | 'registered_premium'
  registeredAt: null, // ISO string set on first registration — used for 48h feed gate
  onboardingCompleted: true, // onboarding flow removed; always true for new registrations
  permissions: {
    location: false,
    notifications: false,
    tracking: false,
    appleHealth: false,
    strava: false,
  },
  settings: {
    summaryNotifications: true,
    forecastNotifications: true,
    timezone: 'auto', // 'auto' = use device timezone, or IANA string e.g. 'Europe/London'
  },
  subscription: {
    plan: 'none', // 'none' | 'trial' | 'premium'
    startDate: null,
  },
  profile: {
    name: '',
    email: '',
    authProvider: null, // 'google' | 'apple' | 'email'
  },
  personalization: {
    gender: null,           // string | null
    dateOfBirth: null,      // 'YYYY-MM-DD' string | null
    healthConditions: null, // false (answered "No") | string[] (conditions) | null (unanswered)
    dismissed: [],          // question IDs permanently dismissed from the feed
  },
}

export function UserProvider({ children, overrides }) {
  const [user, setUser] = useState(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_USER
      }
    }
    return DEFAULT_USER
  })

  // Persist to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }, [user])

  // Helper to check if content should be locked
  const isContentLocked = (contentType, item = null) => {
    // Premium users see everything
    if (user.state === 'registered_premium') return false

    // Forecast is always accessible
    if (contentType === 'forecast') return false

    // For registered_free users, Strava running segments are unlocked
    if (user.state === 'registered_free' && contentType === 'segment') {
      if (item?.activityType === 'running' && item?.hasStrava) {
        return false
      }
    }

    // Guest and registered_free: most content is locked
    if (user.state === 'guest' || user.state === 'registered_free') {
      return true
    }

    // No user state = first visit, show splash
    return true
  }

  // Actions
  const setGuest = () => {
    setUser(prev => ({ ...prev, state: 'guest' }))
  }

  const register = (profile, authProvider) => {
    setUser(prev => ({
      ...prev,
      state: 'registered_free',
      registeredAt: prev.registeredAt || new Date().toISOString(), // only set on first registration
      onboardingCompleted: true, // onboarding flow removed — go straight to home after registration
      profile: { ...profile, authProvider },
    }))
  }

  const setSubscription = (plan) => {
    const newState = plan === 'none' ? 'registered_free' : 'registered_premium'
    setUser(prev => ({
      ...prev,
      state: newState,
      subscription: {
        plan,
        startDate: plan !== 'none' ? new Date().toISOString() : null,
      },
    }))
  }

  const updatePermission = (permission, value) => {
    setUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }))
  }

  const updateSetting = (key, value) => {
    setUser(prev => ({
      ...prev,
      settings: {
        ...(prev.settings || {}),
        [key]: value,
      },
    }))
  }

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingCompleted: true }))
  }

  // Personalisation: save an answer for a question field
  const savePersonalisation = (field, value) => {
    setUser(prev => ({
      ...prev,
      personalization: {
        ...(prev.personalization || {}),
        [field]: value,
      },
    }))
  }

  // Personalisation: permanently dismiss a question from the feed
  const dismissPersonalisationQuestion = (id) => {
    setUser(prev => ({
      ...prev,
      personalization: {
        ...(prev.personalization || {}),
        dismissed: [...(prev.personalization?.dismissed || []), id],
      },
    }))
  }

  // Personalisation: restore a dismissed question back to the feed
  const restorePersonalisationQuestion = (id) => {
    setUser(prev => ({
      ...prev,
      personalization: {
        ...(prev.personalization || {}),
        dismissed: (prev.personalization?.dismissed || []).filter(d => d !== id),
      },
    }))
  }

  // For testing/demo: reset to initial state
  const resetUser = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(DEFAULT_USER)
  }

  // Merge dev-sim overrides when active
  const effectiveUser = overrides
    ? {
        ...user,
        ...overrides,
        permissions: { ...user.permissions, ...(overrides.permissions || {}) },
        settings: { ...user.settings, ...(overrides.settings || {}) },
        subscription: { ...user.subscription, ...(overrides.subscription || {}) },
        profile: { ...user.profile, ...(overrides.profile || {}) },
      }
    : user

  const value = {
    user: effectiveUser,
    isContentLocked: overrides
      ? (contentType, item = null) => {
          // Re-evaluate locking with effective user
          if (effectiveUser.state === 'registered_premium') return false
          if (contentType === 'forecast') return false
          if (effectiveUser.state === 'registered_free' && contentType === 'segment') {
            if (item?.activityType === 'running' && item?.hasStrava) return false
          }
          if (effectiveUser.state === 'guest' || effectiveUser.state === 'registered_free') return true
          return true
        }
      : isContentLocked,
    isFirstVisit: effectiveUser.state === null,
    isGuest: effectiveUser.state === 'guest',
    isRegisteredFree: effectiveUser.state === 'registered_free',
    isPremium: effectiveUser.state === 'registered_premium',
    setGuest,
    register,
    setSubscription,
    updatePermission,
    updateSetting,
    completeOnboarding,
    resetUser,
    savePersonalisation,
    dismissPersonalisationQuestion,
    restorePersonalisationQuestion,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext
