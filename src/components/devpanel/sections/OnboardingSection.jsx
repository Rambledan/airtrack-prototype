import { useDevSim } from '../../../contexts/DevSimContext'

const STAGES = [
  {
    id: 'splash',
    label: 'Splash Screen',
    emoji: '✨',
    description: 'First-time visitor experience',
    action: (ctx) => {
      ctx.updateOverrideField('state', null)
      ctx.updateOverrideField('onboardingCompleted', false)
      ctx.closePanel()
    },
  },
  {
    id: 'guest',
    label: 'Guest Home',
    emoji: '👤',
    description: 'Guest browsing with locked content',
    action: (ctx) => {
      ctx.updateOverrideField('state', 'guest')
      ctx.updateOverrideField('onboardingCompleted', false)
      ctx.closePanel()
    },
  },
  {
    id: 'registration',
    label: 'Registration Wall',
    emoji: '📝',
    description: 'Sign-up modal overlay',
    action: (ctx) => {
      ctx.updateOverrideField('state', 'guest')
      ctx.setFlowStateOverride('registration')
      ctx.closePanel()
    },
  },
  {
    id: 'paywall',
    label: 'Paywall',
    emoji: '💎',
    description: 'Plan selection screen',
    action: (ctx) => {
      ctx.updateOverrideField('state', 'registered_free')
      ctx.updateOverrideField('onboardingCompleted', true)
      ctx.setFlowStateOverride('paywall')
      ctx.closePanel()
    },
  },
  {
    id: 'onboarding',
    label: 'Onboarding Steps',
    emoji: '🚀',
    description: 'Permission setup flow',
    action: (ctx) => {
      ctx.updateOverrideField('state', 'registered_free')
      ctx.updateOverrideField('onboardingCompleted', false)
      ctx.closePanel()
    },
  },
  {
    id: 'complete',
    label: 'Completed (Premium)',
    emoji: '🏆',
    description: 'Fully onboarded premium user',
    action: (ctx) => {
      ctx.updateOverrideField('state', 'registered_premium')
      ctx.updateOverrideField('onboardingCompleted', true)
      ctx.closePanel()
    },
  },
]

export default function OnboardingSection() {
  const devSim = useDevSim()

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] text-gray-500 mb-2">
        Jump directly to any onboarding stage
      </p>
      {STAGES.map(({ id, label, emoji, description, action }) => (
        <button
          key={id}
          onClick={() => action(devSim)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left"
        >
          <span className="text-base">{emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-gray-200">{label}</p>
            <p className="text-[10px] text-gray-500">{description}</p>
          </div>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ))}
    </div>
  )
}
