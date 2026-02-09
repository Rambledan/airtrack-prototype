import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const STORAGE_KEY = 'airtrack_user'

const DEFAULT_USER = {
  state: null, // null | 'guest' | 'registered_free' | 'registered_premium'
  onboardingCompleted: false,
  permissions: {
    location: false,
    notifications: false,
    tracking: false,
    appleHealth: false,
    strava: false,
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
}

export function UserProvider({ children }) {
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

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, onboardingCompleted: true }))
  }

  // For testing/demo: reset to initial state
  const resetUser = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(DEFAULT_USER)
  }

  const value = {
    user,
    isContentLocked,
    isFirstVisit: user.state === null,
    isGuest: user.state === 'guest',
    isRegisteredFree: user.state === 'registered_free',
    isPremium: user.state === 'registered_premium',
    setGuest,
    register,
    setSubscription,
    updatePermission,
    completeOnboarding,
    resetUser,
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
