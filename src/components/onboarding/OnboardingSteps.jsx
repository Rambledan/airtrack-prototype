import { useState } from 'react'

// All possible onboarding steps
const ALL_STEPS = {
  location: {
    id: 'location',
    title: 'Enable Location',
    description: 'We use your location to track air quality exposure as you move throughout your day.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  notifications: {
    id: 'notifications',
    title: 'Enable Notifications',
    description: 'Get alerts when air quality changes and reminders for optimal activity times.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  tracking: {
    id: 'tracking',
    title: 'Enable Activity Tracking',
    description: 'Automatically detect your activities like walking, running, and commuting.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
  },
  appleHealth: {
    id: 'appleHealth',
    title: 'Connect Apple Health',
    description: 'Sync your workouts and health data for more accurate exposure tracking.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
  },
  strava: {
    id: 'strava',
    title: 'Connect Strava',
    description: 'Import your runs, rides, and other activities automatically from Strava.',
    icon: (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    ),
    color: 'from-[#FC4C02] to-orange-500',
    bgColor: 'bg-orange-50',
  },
}

// Premium users get all steps including tracking
const PREMIUM_STEPS = ['location', 'notifications', 'tracking', 'appleHealth', 'strava']

// Free users skip tracking
const FREE_STEPS = ['location', 'notifications', 'appleHealth', 'strava']

export default function OnboardingSteps({ isPremium, onComplete, onUpdatePermission }) {
  const steps = isPremium ? PREMIUM_STEPS : FREE_STEPS
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [permissions, setPermissions] = useState({})

  const currentStep = ALL_STEPS[steps[currentStepIndex]]
  const isLastStep = currentStepIndex === steps.length - 1
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleEnable = () => {
    // Update permission
    const newPermissions = { ...permissions, [currentStep.id]: true }
    setPermissions(newPermissions)
    onUpdatePermission?.(currentStep.id, true)

    // Move to next step or complete
    if (isLastStep) {
      onComplete(newPermissions)
    } else {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    // Update permission as false
    const newPermissions = { ...permissions, [currentStep.id]: false }
    setPermissions(newPermissions)
    onUpdatePermission?.(currentStep.id, false)

    // Move to next step or complete
    if (isLastStep) {
      onComplete(newPermissions)
    } else {
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          {steps.map((stepId, idx) => (
            <div
              key={stepId}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx <= currentStepIndex ? 'bg-brand' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Icon */}
        <div className={`w-28 h-28 rounded-3xl ${currentStep.bgColor} flex items-center justify-center mb-8`}>
          <div className={`text-transparent bg-clip-text bg-gradient-to-br ${currentStep.color}`} style={{ color: 'inherit' }}>
            <div className={`bg-gradient-to-br ${currentStep.color} bg-clip-text`}>
              {currentStep.icon}
            </div>
          </div>
        </div>

        {/* Title & description */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {currentStep.title}
        </h1>
        <p className="text-gray-500 leading-relaxed max-w-sm">
          {currentStep.description}
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleEnable}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${currentStep.color} hover:opacity-95 transition-opacity shadow-lg`}
        >
          {currentStep.id === 'strava' ? 'Connect Strava' :
           currentStep.id === 'appleHealth' ? 'Connect Apple Health' :
           'Enable'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 text-gray-500 text-sm hover:text-gray-700"
        >
          {isLastStep ? 'Skip & Finish' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}
