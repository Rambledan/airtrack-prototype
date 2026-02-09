import { useState } from 'react'

const PLANS = [
  {
    id: 'premium',
    name: 'Premium',
    price: '£10.99',
    period: '/month',
    description: 'Full access to all features',
    features: [
      'Unlimited activity tracking',
      'Route optimization suggestions',
      'Real-time air quality alerts',
      'Detailed exposure analytics',
      'Priority support',
    ],
    recommended: true,
  },
  {
    id: 'trial',
    name: '15 Day Free Trial',
    price: '£0',
    period: ' then £10.99/m',
    description: 'Try Premium free for 15 days',
    features: [
      'All Premium features',
      'No commitment',
      'Cancel anytime',
    ],
    recommended: false,
  },
]

// Apple Pay icon
const ApplePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

export default function Paywall({ isOpen, onSelectPlan, userName = '' }) {
  const [selectedPlan, setSelectedPlan] = useState('trial')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleSubscribe = () => {
    setIsProcessing(true)
    // Simulate Apple subscription flow
    setTimeout(() => {
      onSelectPlan(selectedPlan)
      setIsProcessing(false)
    }, 1500)
  }

  const handleSkip = () => {
    onSelectPlan('none')
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/30">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userName ? `Welcome, ${userName.split(' ')[0]}!` : 'Unlock Your Potential'}
          </h1>
          <p className="text-gray-500">
            Choose how you'd like to experience AirTrack
          </p>
        </div>

        {/* Plan cards */}
        <div className="px-6 space-y-4 mb-6">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-brand bg-brand/5 shadow-lg shadow-brand/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    {plan.recommended && (
                      <span className="text-xs font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedPlan === plan.id
                    ? 'border-brand bg-brand'
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === plan.id && (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Subscribe button */}
        <div className="px-6 mb-4">
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ApplePayIcon />
                {selectedPlan === 'trial' ? 'Start Free Trial' : 'Subscribe with Apple'}
              </>
            )}
          </button>
          {selectedPlan === 'trial' && (
            <p className="text-xs text-gray-400 text-center mt-2">
              You'll be charged £10.99/month after your trial ends. Cancel anytime.
            </p>
          )}
        </div>

        {/* Skip option */}
        <div className="px-6 pb-8 mt-auto">
          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            No thanks, continue with limited features
          </button>
        </div>

        {/* Terms */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-400 text-center">
            Subscriptions are billed monthly through the App Store. You can cancel anytime in your device settings.
          </p>
        </div>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600">Setting up your subscription...</p>
          </div>
        </div>
      )}
    </div>
  )
}
