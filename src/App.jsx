import { useState, useEffect } from 'react'
import LondonMarathonPage from './components/marathon/LondonMarathonPage'
import { UserProvider, useUser } from './contexts/UserContext'
import { DevSimProvider, useDevSim } from './contexts/DevSimContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import WelcomeCard from './components/home/WelcomeCard'
import LiveForecast from './components/forecast/LiveForecast'
import ActivityFeed from './components/feed/ActivityFeed'
import YourExposure from './components/exposure/YourExposure'
import RecordActivity from './components/record/RecordActivity'
import RunningDetail from './components/feed/RunningDetail'
import IndoorDetail from './components/feed/IndoorDetail'
import MonitorShopScreen from './components/indoor/MonitorShopScreen'
import MonitorSetupFlow from './components/indoor/MonitorSetupFlow'
import { LOCATION_NAME_TO_TYPE } from './data/locationProfiles'
import TimeOptimization from './components/optimization/TimeOptimization'
import RouteOptimizationDetail from './components/optimization/RouteOptimizationDetail'
import SplashScreen from './components/onboarding/SplashScreen'
import RegistrationWall from './components/onboarding/RegistrationWall'
import Paywall from './components/onboarding/Paywall'
import { LockedRunningDetailPreview } from './components/shared/LockedDetailPreview'
import LockedOverlay from './components/shared/LockedOverlay'
import DevLauncher from './components/devpanel/DevLauncher'
import DevPanel from './components/devpanel/DevPanel'
import NotificationToast from './components/notifications/NotificationToast'
import NotificationBanner from './components/notifications/NotificationBanner'
import PersonalisationCards from './components/personalisation/PersonalisationCards'
import ProfileSettings from './components/profile/ProfileSettings'

const DEV_MODE = true

// Flow states for the auth/onboarding journey
const FLOW_STATES = {
  NONE: 'none',
  REGISTRATION: 'registration',
  PAYWALL: 'paywall',
  ONBOARDING: 'onboarding',
}

function AppContent() {
  const {
    user,
    isFirstVisit,
    isGuest,
    isPremium,
    setGuest,
    register,
    setSubscription,
    updatePermission,
    updateSetting,
    resetUser,
    savePersonalisation,
    dismissPersonalisationQuestion,
    restorePersonalisationQuestion,
  } = useUser()

  // Dev simulation flow state override (for onboarding stage jumps)
  const devSim = DEV_MODE ? useDevSim() : null
  const flowOverride = devSim?.flowStateOverride

  const [activeTab, setActiveTab] = useState('feed')
  const [detailView, setDetailView] = useState(null)
  const [flowState, _setFlowState] = useState(FLOW_STATES.NONE)
  const [pendingLockedItem, setPendingLockedItem] = useState(null)
  const [locationProfiles, setLocationProfiles] = useState(() => {
    try {
      const stored = localStorage.getItem('airtrack_location_profiles')
      return stored ? JSON.parse(stored) : {}
    } catch { return {} }
  })
  const [monitorLocations, setMonitorLocations] = useState(() => {
    try {
      const stored = localStorage.getItem('airtrack_monitor_locations')
      return stored ? JSON.parse(stored) : {}
    } catch { return {} }
  })

  // Wrapper that also clears dev override
  const setFlowState = (state) => {
    _setFlowState(state)
    if (devSim) devSim.setFlowStateOverride(null)
  }

  // Persist location profiles + monitor locations to localStorage
  useEffect(() => {
    localStorage.setItem('airtrack_location_profiles', JSON.stringify(locationProfiles))
  }, [locationProfiles])

  useEffect(() => {
    localStorage.setItem('airtrack_monitor_locations', JSON.stringify(monitorLocations))
  }, [monitorLocations])

  // Apply dev flow override when set
  const effectiveFlowState = flowOverride || flowState

  // 48-hour gate: use simulated days in dev mode, real elapsed days in production
  const daysWithApp = DEV_MODE && devSim
    ? devSim.sim.simulatedDaysWithApp
    : user.registeredAt
      ? Math.floor((Date.now() - new Date(user.registeredAt)) / 86400000)
      : 0

  // DEV: force-show splash screen without overriding user state.
  // Using a flowStateOverride avoids the bug where state:null override wins over
  // setGuest(), leaving the user stuck on SplashScreen forever.
  if (DEV_MODE && flowOverride === 'splash') {
    return (
      <SplashScreen
        onContinue={() => {
          if (!user.state) setGuest()   // advance real state if truly fresh
          setFlowState(FLOW_STATES.NONE) // clears the flowOverride; real state takes over
        }}
      />
    )
  }

  // Show splash screen for first-time visitors
  if (isFirstVisit) {
    return (
      <SplashScreen
        onContinue={() => {
          setGuest()
        }}
      />
    )
  }

  // Handle registration flow
  const handleRegister = (profile, authProvider) => {
    register(profile, authProvider)
    setFlowState(FLOW_STATES.PAYWALL)
  }

  // Handle paywall selection
  const handlePaywallSelect = (plan) => {
    setSubscription(plan)
    setFlowState(FLOW_STATES.NONE)
  }

  // Handle locked content tap
  const handleLockedTap = (item) => {
    setPendingLockedItem(item)
    setFlowState(FLOW_STATES.REGISTRATION)
  }

  const handleViewRunningDetail = (segment) => {
    setDetailView({ type: 'running', segment })
  }

  const handleViewIndoorDetail = (segment) => {
    setDetailView({ type: 'indoor', segment })
  }

  const handleSaveLocationProfile = (locationName, type, answers) => {
    setLocationProfiles(prev => ({ ...prev, [locationName]: { type, answers } }))
  }

  const handleRegisterMonitor = (locationName, code) => {
    setMonitorLocations(prev => ({ ...prev, [locationName]: { registered: true, code, calibrated: false } }))
  }

  const handleBackFromDetail = () => {
    if (detailView?.fromView === 'running') {
      setDetailView({ type: 'running', segment: detailView.segment })
    } else {
      setDetailView(null)
    }
  }

  const handleTimeChange = (segment) => {
    setDetailView({ type: 'timeOptimization', segment, fromView: detailView?.type })
  }

  const handleRouteChange = (segment) => {
    setDetailView({ type: 'routeOptimization', segment, fromView: detailView?.type })
  }

  const handleViewTimeOptimization = (segment) => {
    setDetailView({ type: 'timeOptimization', segment, fromView: null })
  }

  const handleViewRouteOptimization = (segment) => {
    setDetailView({ type: 'routeOptimization', segment, fromView: null })
  }

  // Compute effective location profiles (real + dev sim override)
  const effectiveLocationProfiles = (() => {
    const override = DEV_MODE && devSim ? devSim.sim.locationProfilesOverride : null
    if (override === 'none') return {}
    if (override === 'all') {
      const autoProfiles = Object.entries(LOCATION_NAME_TO_TYPE).reduce((acc, [name, type]) => {
        acc[name] = { type, answers: {} }
        return acc
      }, {})
      return { ...autoProfiles, ...locationProfiles }
    }
    return locationProfiles
  })()

  // Check if content should be locked for detail views
  const isDetailLocked = (type, segment) => {
    if (isPremium) return false
    if (type === 'running' && segment?.hasStrava && user.state === 'registered_free') {
      return false
    }
    return user.state === 'guest' || user.state === 'registered_free'
  }

  // Render detail views
  if (detailView) {
    const locked = isDetailLocked(detailView.type, detailView.segment)

    if (locked) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <LockedRunningDetailPreview
              segment={detailView.segment}
              onBack={() => setDetailView(null)}
              onUnlock={() => setFlowState(FLOW_STATES.REGISTRATION)}
            />
          </main>
          <RegistrationWall
            isOpen={effectiveFlowState === FLOW_STATES.REGISTRATION}
            onClose={() => setFlowState(FLOW_STATES.NONE)}
            onRegister={handleRegister}
          />
          <Paywall
            isOpen={effectiveFlowState === FLOW_STATES.PAYWALL}
            onSelectPlan={handlePaywallSelect}
            onClose={() => setFlowState(FLOW_STATES.NONE)}
            userName={user.profile?.name}
          />
        </div>
      )
    }

    if (detailView.type === 'running') {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <RunningDetail
              segment={detailView.segment}
              onBack={() => setDetailView(null)}
              onTimeChange={handleTimeChange}
              onRouteChange={handleRouteChange}
            />
          </main>
        </div>
      )
    }

    if (detailView.type === 'indoor') {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <IndoorDetail
              segment={detailView.segment}
              onBack={() => setDetailView(null)}
              locationProfiles={effectiveLocationProfiles}
              monitorLocations={monitorLocations}
              onSaveLocationProfile={handleSaveLocationProfile}
              onSetupMonitor={(seg) => setDetailView({ type: 'monitorSetup', segment: seg })}
              onShopMonitor={(seg) => setDetailView({ type: 'monitorShop', segment: seg })}
            />
          </main>
        </div>
      )
    }

    if (detailView.type === 'monitorShop') {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <MonitorShopScreen
              onBack={() => setDetailView({ type: 'indoor', segment: detailView.segment })}
              onHaveOne={() => setDetailView({ type: 'monitorSetup', segment: detailView.segment })}
            />
          </main>
        </div>
      )
    }

    if (detailView.type === 'monitorSetup') {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <MonitorSetupFlow
              segment={detailView.segment}
              onBack={() => setDetailView({ type: 'indoor', segment: detailView.segment })}
              onComplete={(locationName, code) => {
                handleRegisterMonitor(locationName, code)
              }}
            />
          </main>
        </div>
      )
    }

    if (detailView.type === 'timeOptimization') {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <TimeOptimization
              segment={detailView.segment}
              onBack={handleBackFromDetail}
            />
          </main>
        </div>
      )
    }

    if (detailView.type === 'routeOptimization') {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
            <RouteOptimizationDetail
              segment={detailView.segment}
              onBack={handleBackFromDetail}
            />
          </main>
        </div>
      )
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed': {
        const isAnonymous = !user.state || user.state === 'guest'
        return (
          <>
            {/* Welcome card — anonymous users only, dismissable */}
            {isAnonymous && (
              <WelcomeCard onSignUp={() => setFlowState(FLOW_STATES.REGISTRATION)} />
            )}

            {/* Forecast header: live map, 24h timeline, today's insights */}
            <LiveForecast
              isPremium={isPremium}
              onUpgrade={() => setFlowState(FLOW_STATES.PAYWALL)}
            />

            {/* Personalisation question cards — registered users only, after 48h, unanswered/undismissed */}
            {(user.state === 'registered_free' || user.state === 'registered_premium') && (
              <PersonalisationCards
                personalization={user.personalization}
                onSave={savePersonalisation}
                onDismiss={dismissPersonalisationQuestion}
                daysWithApp={daysWithApp}
              />
            )}

            {/* Example data banner for non-premium users */}
            {!isPremium && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-amber-800">
                    <span className="font-medium">Viewing example data.</span>
                    {' '}Tap locked cards to create your free account.
                  </p>
                </div>
              </div>
            )}

            {/* Activity Feed */}
            <ActivityFeed
              onViewRunningDetail={handleViewRunningDetail}
              onViewIndoorDetail={handleViewIndoorDetail}
              onNavigateToTab={setActiveTab}
              onViewRouteOptimization={handleViewRouteOptimization}
              onViewTimeOptimization={handleViewTimeOptimization}
              userState={user.state}
              onLockedTap={handleLockedTap}
              locationProfiles={effectiveLocationProfiles}
            />
          </>
        )
      }
      case 'record':
        // Record is available to registered users (free + premium); locked for anonymous/guest
        if (!user.state || user.state === 'guest') {
          return (
            <div className="relative">
              <LockedOverlay
                isLocked={true}
                onTap={() => setFlowState(FLOW_STATES.REGISTRATION)}
                showLockIcon={true}
              >
                <RecordActivity locked />
              </LockedOverlay>
            </div>
          )
        }
        return <RecordActivity />
      case 'exposure':
        // Exposure is locked for non-premium users
        if (!isPremium) {
          return (
            <div className="relative">
              <LockedOverlay
                isLocked={true}
                onTap={() => setFlowState(FLOW_STATES.REGISTRATION)}
                showLockIcon={true}
              >
                <YourExposure
                  onViewTimeOptimization={handleViewTimeOptimization}
                  onViewRouteOptimization={handleViewRouteOptimization}
                />
              </LockedOverlay>
            </div>
          )
        }
        return (
          <YourExposure
            onViewTimeOptimization={handleViewTimeOptimization}
            onViewRouteOptimization={handleViewRouteOptimization}
          />
        )
      case 'profile':
        return (
          <ProfileSettings
            user={user}
            isPremium={isPremium}
            isGuest={isGuest}
            onUpdatePermission={updatePermission}
            onUpdateSetting={updateSetting}
            onSavePersonalisation={savePersonalisation}
            onDismissPersonalisation={dismissPersonalisationQuestion}
            onRestorePersonalisation={restorePersonalisationQuestion}
            onUpgrade={() => setFlowState(FLOW_STATES.PAYWALL)}
            onSignUp={() => setFlowState(FLOW_STATES.REGISTRATION)}
            onManageBilling={() => setFlowState(FLOW_STATES.PAYWALL)}
            onReset={resetUser}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-5 pb-24">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Registration wall modal */}
      <RegistrationWall
        isOpen={effectiveFlowState === FLOW_STATES.REGISTRATION}
        onClose={() => {
          setFlowState(FLOW_STATES.NONE)
          setPendingLockedItem(null)
        }}
        onRegister={handleRegister}
      />

      {/* Paywall modal */}
      <Paywall
        isOpen={effectiveFlowState === FLOW_STATES.PAYWALL}
        onSelectPlan={handlePaywallSelect}
        onClose={() => setFlowState(FLOW_STATES.NONE)}
        userName={user.profile?.name}
      />
    </div>
  )
}

function AppWithDevSim() {
  const { sim } = useDevSim()
  const overrides = sim.isActive ? sim.userOverrides : undefined

  return (
    <UserProvider overrides={overrides}>
      <NotificationProvider>
        <AppContent />
        {DEV_MODE && <DevLauncher />}
        {DEV_MODE && <DevPanel />}
        <NotificationToast />
        <NotificationBanner />
      </NotificationProvider>
    </UserProvider>
  )
}

function App() {
  // Serve the marathon partner page when ?view=marathon
  if (new URLSearchParams(window.location.search).get('view') === 'marathon') {
    return <LondonMarathonPage />
  }
  return (
    <DevSimProvider>
      <AppWithDevSim />
    </DevSimProvider>
  )
}

export default App
