import { useState } from 'react'

// ---------- Plan definitions ----------
const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'Your current free plan',
    selectable: false,
    features: [
      { text: 'Record the air quality of activities', included: true },
      { text: 'Automated tracking', included: false },
      { text: 'Exposure summaries', included: false },
      { text: 'Cleaner routes and times', included: false },
      { text: 'Integration with Strava and Health', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: '£6.99',
    priceYearly: '£49.99',
    periodMonthly: '/month',
    periodYearly: '/year',
    description: 'Full access to all features',
    recommended: true,
    features: [
      { text: 'Automatically track and categorise activities in the background (low energy use)', included: true },
      { text: 'Avoid recording each activity manually', included: true },
      { text: 'Suggested routes and times to choose for cleaner air', included: true },
      { text: 'Daily summaries', included: true },
      { text: 'Personal exposure analytics', included: true },
      { text: 'Integrate with Strava or Health for higher fidelity exposure data', included: true },
    ],
  },
  {
    id: 'trial',
    name: '15 Day Free Trial',
    price: '£0',
    description: 'Try Premium free for 15 days',
    features: [
      { text: 'All Premium features included', included: true },
      { text: 'No commitment', included: true },
      { text: 'Cancel anytime', included: true },
    ],
  },
]

// ---------- Apple Pay icon ----------
const ApplePayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

// ---------- Feature list item (tick or cross) ----------
function FeatureItem({ feature }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {feature.included ? (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
      <span className={feature.included ? 'text-gray-600' : 'text-gray-400'}>{feature.text}</span>
    </li>
  )
}

// ---------- Main Paywall ----------
export default function Paywall({ isOpen, onSelectPlan, onClose, userName = '' }) {
  const [selectedPlan, setSelectedPlan] = useState('trial')
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleSubscribe = () => {
    setIsProcessing(true)
    setTimeout(() => {
      onSelectPlan(selectedPlan)
      setIsProcessing(false)
    }, 1500)
  }

  const handleSkip = () => {
    onSelectPlan('none')
  }

  // Dynamic Premium price based on billing period
  const premiumPrice = billingPeriod === 'monthly' ? '£6.99' : '£49.99'
  const premiumPeriod = billingPeriod === 'monthly' ? '/month' : '/year'
  const trialAfterPrice = billingPeriod === 'monthly' ? '£6.99/m' : '£49.99/y'

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="relative min-h-screen flex flex-col">

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-12 right-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="px-6 pt-12 pb-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/30">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userName ? `Welcome, ${userName.split(' ')[0]}!` : 'Unlock Your Potential'}
          </h1>
          <p className="text-gray-500 text-sm">
            Choose how you'd like to experience AirTrack
          </p>
        </div>

        {/* Billing period toggle */}
        <div className="px-6 mb-5">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {['monthly', 'yearly'].map((period) => (
              <button
                key={period}
                onClick={() => setBillingPeriod(period)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingPeriod === period
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {period === 'monthly' ? (
                  'Monthly'
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Yearly
                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      Save 40%
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="px-6 space-y-3 mb-6">
          {PLANS.map((plan) => {
            const isSelectable = plan.selectable !== false
            const isSelected = selectedPlan === plan.id

            // Determine displayed price
            let displayPrice = plan.price ?? ''
            let displayPeriod = plan.period ?? ''
            if (plan.id === 'premium') {
              displayPrice = premiumPrice
              displayPeriod = premiumPeriod
            } else if (plan.id === 'trial') {
              displayPeriod = ` then ${trialAfterPrice}`
            }

            return (
              <button
                key={plan.id}
                onClick={() => isSelectable && setSelectedPlan(plan.id)}
                disabled={!isSelectable}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  !isSelectable
                    ? 'border-gray-100 bg-gray-50 cursor-default'
                    : isSelected
                    ? 'border-brand bg-brand/5 shadow-lg shadow-brand/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      {plan.recommended && (
                        <span className="text-xs font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      {!isSelectable && (
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Current plan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
                  </div>
                  {/* Radio button — only for selectable plans */}
                  {isSelectable && (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      isSelected ? 'border-brand bg-brand' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-3xl font-bold ${!isSelectable ? 'text-gray-400' : 'text-gray-900'}`}>
                    {displayPrice}
                  </span>
                  {displayPeriod && (
                    <span className="text-sm text-gray-500">{displayPeriod}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <FeatureItem key={idx} feature={feature} />
                  ))}
                </ul>
              </button>
            )
          })}
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

          {/* Contextual disclaimer */}
          {selectedPlan === 'trial' && (
            <p className="text-xs text-gray-400 text-center mt-2">
              You'll be charged {billingPeriod === 'monthly' ? '£6.99/month' : '£49.99/year'} after your 15-day trial ends. Cancel anytime.
            </p>
          )}
          {selectedPlan === 'premium' && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Billed {billingPeriod === 'monthly' ? `£6.99 monthly` : `£49.99 annually`} through the App Store.
            </p>
          )}
        </div>

        {/* Skip option */}
        <div className="px-6 pb-6 mt-auto">
          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            No thanks, continue with limited features
          </button>
        </div>

        {/* Terms */}
        <div className="px-6 pb-8">
          <p className="text-xs text-gray-400 text-center">
            Subscriptions are billed through the App Store. You can cancel anytime in your device settings.
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
