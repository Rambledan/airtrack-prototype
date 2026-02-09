import { useState } from 'react'

// Google icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

// Apple icon
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

export default function RegistrationWall({ isOpen, onClose, onRegister }) {
  const [mode, setMode] = useState('social') // 'social' | 'email'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSocialAuth = (provider) => {
    setIsLoading(true)
    // Simulate auth delay
    setTimeout(() => {
      const mockProfile = {
        name: provider === 'google' ? 'John Doe' : 'John D.',
        email: `john.doe@${provider === 'google' ? 'gmail.com' : 'icloud.com'}`,
      }
      onRegister(mockProfile, provider)
      setIsLoading(false)
    }, 800)
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) return

    setIsLoading(true)
    setTimeout(() => {
      onRegister({ name: formData.name, email: formData.email }, 'email')
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md sm:m-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Handle bar for mobile */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="p-6 pb-8">
          {/* Header */}
          <div className="text-center mb-6">
            <img
              src={`${import.meta.env.BASE_URL}airtrack-logo.svg`}
              alt="AirTrack"
              className="h-8 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Free Account</h2>
            <p className="text-sm text-gray-500">
              Unlock personalized air quality insights and optimize your daily routine.
            </p>
          </div>

          {mode === 'social' ? (
            <>
              {/* Social login buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialAuth('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialAuth('apple')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  <AppleIcon />
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Email option */}
              <button
                onClick={() => setMode('email')}
                className="w-full py-3.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue with email
              </button>
            </>
          ) : (
            <>
              {/* Email form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              {/* Back to social */}
              <button
                onClick={() => setMode('social')}
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Back to other options
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full mt-6 text-sm text-gray-400 hover:text-gray-600"
          >
            Maybe later
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-6">
            By creating an account, you agree to our{' '}
            <span className="text-gray-600">Terms of Service</span> and{' '}
            <span className="text-gray-600">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
