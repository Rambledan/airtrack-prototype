import { useDevSim } from '../../../contexts/DevSimContext'
import { useUser } from '../../../contexts/UserContext'

const USER_STATES = [
  { value: null, label: 'null (First Visit)' },
  { value: 'guest', label: 'Guest' },
  { value: 'registered_free', label: 'Registered Free' },
  { value: 'registered_premium', label: 'Registered Premium' },
]

const SUBSCRIPTION_PLANS = [
  { value: 'none', label: 'None' },
  { value: 'trial', label: 'Trial' },
  { value: 'premium', label: 'Premium' },
]

export default function UserStateSection() {
  const { sim, updateOverrideField, resetSimulation } = useDevSim()
  const { user } = useUser()

  const currentState = user.state
  const currentPlan = user.subscription?.plan || 'none'

  return (
    <div className="space-y-3">
      {/* User state selector */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
          User State
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {USER_STATES.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => {
                updateOverrideField('state', value)
                // Auto-set onboarding based on state
                if (value === null || value === 'guest') {
                  updateOverrideField('onboardingCompleted', false)
                } else {
                  updateOverrideField('onboardingCompleted', true)
                }
              }}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                currentState === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscription plan */}
      <div>
        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">
          Subscription Plan
        </label>
        <div className="flex gap-1.5">
          {SUBSCRIPTION_PLANS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateOverrideField('subscription', {
                plan: value,
                startDate: value !== 'none' ? new Date().toISOString() : null,
              })}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                currentPlan === value
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Onboarding completed toggle */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">Onboarding Completed</span>
        <button
          onClick={() => updateOverrideField('onboardingCompleted', !user.onboardingCompleted)}
          className={`w-9 h-5 rounded-full transition-colors relative ${
            user.onboardingCompleted ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            user.onboardingCompleted ? 'translate-x-4' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={resetSimulation}
        className="w-full py-1.5 rounded-lg text-[11px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
      >
        Reset to Real State
      </button>
    </div>
  )
}
