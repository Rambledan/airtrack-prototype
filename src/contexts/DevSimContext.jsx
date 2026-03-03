import { createContext, useContext, useState, useCallback } from 'react'

const DevSimContext = createContext(null)

const DEV_STORAGE_KEY = 'airtrack_dev_sim'
const VERSION_STORAGE_KEY = 'airtrack_dev_versions'

// ── Predefined personas ──────────────────────────────────────────────
export const PERSONAS = {
  premium_cyclist: {
    id: 'premium_cyclist',
    label: 'Premium Cyclist',
    emoji: '🚴',
    description: '90 days in, all permissions, premium plan',
    overrides: {
      state: 'registered_premium',
      onboardingCompleted: true,
      permissions: { location: true, notifications: true, tracking: true, appleHealth: true, strava: true },
      subscription: { plan: 'premium', startDate: new Date(Date.now() - 90 * 86400000).toISOString() },
      profile: { name: 'Alex Chen', email: 'alex@example.com', authProvider: 'google' },
    },
    days: 90,
  },
  free_runner: {
    id: 'free_runner',
    label: 'Free Runner',
    emoji: '🏃',
    description: '30 days in, location + Strava, free plan',
    overrides: {
      state: 'registered_free',
      onboardingCompleted: true,
      permissions: { location: true, notifications: false, tracking: false, appleHealth: false, strava: true },
      subscription: { plan: 'none', startDate: null },
      profile: { name: 'Jamie Park', email: 'jamie@example.com', authProvider: 'apple' },
    },
    days: 30,
  },
  new_visitor: {
    id: 'new_visitor',
    label: 'New Visitor',
    emoji: '👋',
    description: 'First-time user, splash screen',
    overrides: {
      state: null,
      onboardingCompleted: false,
      permissions: { location: false, notifications: false, tracking: true, appleHealth: false, strava: false },
      subscription: { plan: 'none', startDate: null },
      profile: { name: '', email: '', authProvider: null },
    },
    days: 0,
  },
  guest_explorer: {
    id: 'guest_explorer',
    label: 'Guest Explorer',
    emoji: '🔍',
    description: '1 day, location only, guest access',
    overrides: {
      state: 'guest',
      onboardingCompleted: false,
      permissions: { location: true, notifications: false, tracking: false, appleHealth: false, strava: false },
      subscription: { plan: 'none', startDate: null },
      profile: { name: '', email: '', authProvider: null },
    },
    days: 1,
  },
  lapsed_user: {
    id: 'lapsed_user',
    label: 'Lapsed User',
    emoji: '😴',
    description: '180 days, premium but inactive',
    overrides: {
      state: 'registered_premium',
      onboardingCompleted: true,
      permissions: { location: true, notifications: true, tracking: true, appleHealth: true, strava: true },
      subscription: { plan: 'premium', startDate: new Date(Date.now() - 180 * 86400000).toISOString() },
      profile: { name: 'Sam Taylor', email: 'sam@example.com', authProvider: 'email' },
    },
    days: 180,
  },
  trial_user: {
    id: 'trial_user',
    label: 'Trial User',
    emoji: '⏳',
    description: '10 days in, trial plan, all permissions',
    overrides: {
      state: 'registered_free',
      onboardingCompleted: true,
      permissions: { location: true, notifications: true, tracking: true, appleHealth: true, strava: true },
      subscription: { plan: 'trial', startDate: new Date(Date.now() - 10 * 86400000).toISOString() },
      profile: { name: 'Morgan Lee', email: 'morgan@example.com', authProvider: 'google' },
    },
    days: 10,
  },
}

const STRATEGIES = ['aggressive', 'moderate', 'minimal', 'smart']

// ── Default sim state ────────────────────────────────────────────────
const DEFAULT_SIM = {
  isActive: false,
  userOverrides: null,
  notificationStrategy: 'moderate',
  simulatedDaysWithApp: 0,
  activePersona: null,
}

export function DevSimProvider({ children }) {
  const [panelOpen, setPanelOpen] = useState(false)

  const [sim, setSim] = useState(() => {
    try {
      const stored = localStorage.getItem(DEV_STORAGE_KEY)
      return stored ? { ...DEFAULT_SIM, ...JSON.parse(stored) } : DEFAULT_SIM
    } catch {
      return DEFAULT_SIM
    }
  })

  const [versionHistory, setVersionHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(VERSION_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist sim state
  const updateSim = useCallback((updater) => {
    setSim(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  // Persist version history
  const updateVersions = useCallback((updater) => {
    setVersionHistory(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  // ── Actions ──────────────────────────────────────────────────────
  const applyOverrides = useCallback((partial) => {
    updateSim(prev => ({
      ...prev,
      isActive: true,
      userOverrides: partial,
      activePersona: null,
    }))
  }, [updateSim])

  const updateOverrideField = useCallback((field, value) => {
    updateSim(prev => {
      const current = prev.userOverrides || {}
      // Handle nested fields like 'permissions.location'
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          isActive: true,
          userOverrides: {
            ...current,
            [parent]: { ...current[parent], [child]: value },
          },
          activePersona: null,
        }
      }
      return {
        ...prev,
        isActive: true,
        userOverrides: { ...current, [field]: value },
        activePersona: null,
      }
    })
  }, [updateSim])

  const loadPersona = useCallback((personaId) => {
    const persona = PERSONAS[personaId]
    if (!persona) return
    updateSim(prev => ({
      ...prev,
      isActive: true,
      userOverrides: persona.overrides,
      simulatedDaysWithApp: persona.days,
      activePersona: personaId,
    }))
  }, [updateSim])

  const setStrategy = useCallback((strategy) => {
    updateSim(prev => ({ ...prev, notificationStrategy: strategy }))
  }, [updateSim])

  const setDaysWithApp = useCallback((days) => {
    updateSim(prev => ({ ...prev, simulatedDaysWithApp: days }))
  }, [updateSim])

  const resetSimulation = useCallback(() => {
    updateSim(DEFAULT_SIM)
  }, [updateSim])

  // ── Version history ──────────────────────────────────────────────
  const saveVersion = useCallback((name) => {
    const snapshot = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name || `Snapshot ${new Date().toLocaleString()}`,
      timestamp: new Date().toISOString(),
      snapshot: {
        userOverrides: sim.userOverrides,
        notificationStrategy: sim.notificationStrategy,
        simulatedDaysWithApp: sim.simulatedDaysWithApp,
        activePersona: sim.activePersona,
      },
    }
    updateVersions(prev => [snapshot, ...prev])
    return snapshot.id
  }, [sim, updateVersions])

  const loadVersion = useCallback((id) => {
    const version = versionHistory.find(v => v.id === id)
    if (!version) return
    updateSim(prev => ({
      ...prev,
      isActive: true,
      ...version.snapshot,
    }))
  }, [versionHistory, updateSim])

  const deleteVersion = useCallback((id) => {
    updateVersions(prev => prev.filter(v => v.id !== id))
  }, [updateVersions])

  // ── Flow state control (for onboarding jumps) ───────────────────
  const [flowStateOverride, setFlowStateOverride] = useState(null)

  const value = {
    // State
    sim,
    panelOpen,
    versionHistory,
    flowStateOverride,

    // Panel
    togglePanel: () => setPanelOpen(p => !p),
    closePanel: () => setPanelOpen(false),

    // Simulation
    applyOverrides,
    updateOverrideField,
    loadPersona,
    setStrategy,
    setDaysWithApp,
    resetSimulation,

    // Flow control
    setFlowStateOverride,

    // Versions
    saveVersion,
    loadVersion,
    deleteVersion,

    // Constants
    STRATEGIES,
    PERSONAS,
  }

  return (
    <DevSimContext.Provider value={value}>
      {children}
    </DevSimContext.Provider>
  )
}

export function useDevSim() {
  const context = useContext(DevSimContext)
  if (!context) {
    throw new Error('useDevSim must be used within a DevSimProvider')
  }
  return context
}

export default DevSimContext
