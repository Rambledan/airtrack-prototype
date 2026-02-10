import { useState } from 'react'
import { UserProvider, useUser } from './contexts/UserContext'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import LocationPill from './components/LocationPill'
import HomeDashboard from './components/home/HomeDashboard'
import ActivityFeed from './components/feed/ActivityFeed'
import YourExposure from './components/exposure/YourExposure'
import RunningDetail from './components/feed/RunningDetail'
import TimeOptimization from './components/optimization/TimeOptimization'
import RouteOptimizationDetail from './components/optimization/RouteOptimizationDetail'
import SplashScreen from './components/onboarding/SplashScreen'
import RegistrationWall from './components/onboarding/RegistrationWall'
import Paywall from './components/onboarding/Paywall'
import OnboardingSteps from './components/onboarding/OnboardingSteps'
import { LockedRunningDetailPreview } from './components/shared/LockedDetailPreview'
import LockedOverlay from './components/shared/LockedOverlay'

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
    completeOnboarding,
    resetUser,
  } = useUser()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [detailView, setDetailView] = useState(null)
  const [flowState, setFlowState] = useState(FLOW_STATES.NONE)
  const [pendingLockedItem, setPendingLockedItem] = useState(null)

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

  // Show onboarding if registered but not completed
  if (user.state && user.state !== 'guest' && !user.onboardingCompleted) {
    return (
      <OnboardingSteps
        isPremium={isPremium}
        onUpdatePermission={updatePermission}
        onComplete={(permissions) => {
          completeOnboarding()
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
    // Onboarding will show automatically since onboardingCompleted is false
  }

  // Handle locked content tap
  const handleLockedTap = (item) => {
    setPendingLockedItem(item)
    setFlowState(FLOW_STATES.REGISTRATION)
  }

  const handleViewRunningDetail = (segment) => {
    setDetailView({ type: 'running', segment })
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
            isOpen={flowState === FLOW_STATES.REGISTRATION}
            onClose={() => setFlowState(FLOW_STATES.NONE)}
            onRegister={handleRegister}
          />
          <Paywall
            isOpen={flowState === FLOW_STATES.PAYWALL}
            onSelectPlan={handlePaywallSelect}
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

  // Handle route search from home dashboard
  const handleRouteSearch = () => {
    // TODO: Navigate to route search view
    console.log('Route search clicked')
  }

  // Handle clean 5K search from home dashboard
  const handleClean5kSearch = () => {
    // TODO: Navigate to route search with 5K preset
    console.log('Clean 5K search clicked')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <HomeDashboard
            onNavigateToExposure={() => setActiveTab('exposure')}
            onNavigateToSettings={() => setActiveTab('profile')}
            onRouteSearch={handleRouteSearch}
            onClean5kSearch={handleClean5kSearch}
          />
        )
      case 'feed':
        return (
          <>
            {/* Location */}
            <div className="flex items-center justify-between mb-5">
              <LocationPill />
              <span className="text-xs text-gray-400">Updated 2 min ago</span>
            </div>

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
              onNavigateToTab={setActiveTab}
              onViewRouteOptimization={handleViewRouteOptimization}
              onViewTimeOptimization={handleViewTimeOptimization}
              userState={user.state}
              onLockedTap={handleLockedTap}
            />
          </>
        )
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
                <YourExposure />
              </LockedOverlay>
            </div>
          )
        }
        return <YourExposure />
      case 'profile':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {user.profile?.name || 'Profile & Settings'}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {user.profile?.email || 'Coming soon'}
            </p>
            {user.state && (
              <p className="text-xs text-gray-400 mb-4">
                Status: {user.state === 'registered_premium' ? 'Premium' : user.state === 'registered_free' ? 'Free Account' : 'Guest'}
              </p>
            )}

            {/* Upgrade button for free users */}
            {user.state === 'registered_free' && (
              <button
                onClick={() => setFlowState(FLOW_STATES.PAYWALL)}
                className="bg-brand text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-brand/90 transition-colors mb-4"
              >
                Upgrade to Premium
              </button>
            )}

            {/* Sign up button for guests */}
            {isGuest && (
              <button
                onClick={() => setFlowState(FLOW_STATES.REGISTRATION)}
                className="bg-brand text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-brand/90 transition-colors mb-4"
              >
                Create Free Account
              </button>
            )}

            {/* Dev: Reset button */}
            <button
              onClick={resetUser}
              className="text-xs text-gray-400 hover:text-gray-600 mt-8"
            >
              Reset (Dev Only)
            </button>
          </div>
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
        isOpen={flowState === FLOW_STATES.REGISTRATION}
        onClose={() => {
          setFlowState(FLOW_STATES.NONE)
          setPendingLockedItem(null)
        }}
        onRegister={handleRegister}
      />

      {/* Paywall modal */}
      <Paywall
        isOpen={flowState === FLOW_STATES.PAYWALL}
        onSelectPlan={handlePaywallSelect}
        userName={user.profile?.name}
      />
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App
