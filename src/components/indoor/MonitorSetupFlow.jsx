import { useState, useEffect } from 'react'

export default function MonitorSetupFlow({ segment, onBack, onComplete }) {
  const [step, setStep] = useState(0)
  const [registrationCode, setRegistrationCode] = useState('')
  const [codeError, setCodeError] = useState(null)

  const locationName = segment?.location || 'Home'

  const validateCode = (code) => /^ATM-[A-Z0-9]{5}$/i.test(code)

  const handleRegisterSubmit = () => {
    if (!validateCode(registrationCode)) {
      setCodeError('Enter a valid code in the format ATM-XXXXX')
      return
    }
    setCodeError(null)
    setStep(1)
  }

  const handleConfirmLocation = () => {
    onComplete(locationName, registrationCode.toUpperCase())
    setStep(2)
  }

  // Auto-back after done screen
  useEffect(() => {
    if (step === 2) {
      const id = setTimeout(() => onBack(), 2500)
      return () => clearTimeout(id)
    }
  }, [step, onBack])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-900">Set up monitor</h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 px-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i <= step ? 'bg-brand flex-1' : 'bg-gray-200 flex-1'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Enter code */}
      {step === 0 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Enter your monitor code</h3>
            <p className="text-sm text-gray-500">Find the code on the bottom of your AirTrack Monitor or in the box.</p>
          </div>

          <div>
            <input
              type="text"
              value={registrationCode}
              onChange={(e) => {
                setRegistrationCode(e.target.value)
                setCodeError(null)
              }}
              placeholder="ATM-XXXXX"
              maxLength={9}
              className={`w-full px-4 py-3.5 rounded-xl border text-sm font-mono uppercase tracking-wider focus:outline-none transition-colors ${
                codeError
                  ? 'border-red-400 bg-red-50 text-red-900 focus:border-red-500'
                  : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-brand focus:bg-white'
              }`}
            />
            {codeError && (
              <p className="mt-2 text-xs text-red-600">{codeError}</p>
            )}
          </div>

          <button
            onClick={handleRegisterSubmit}
            className="w-full py-3.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand/90 transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1: Confirm location */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Confirm location</h3>
              <p className="text-sm text-gray-500">This monitor will be associated with the location below.</p>
            </div>

            <div className="flex items-center gap-3 bg-brand/5 rounded-2xl p-4 border border-brand/10">
              <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{locationName}</p>
                <p className="text-xs text-gray-500">Monitor {registrationCode.toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-100">
              <p className="text-xs text-amber-800">
                Place your monitor centrally in the room, away from windows, cooking areas, and direct sunlight for the most accurate readings.
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmLocation}
            className="w-full py-3.5 bg-brand text-white rounded-2xl text-sm font-semibold hover:bg-brand/90 transition-colors"
          >
            Complete setup
          </button>
        </div>
      )}

      {/* Step 2: Done */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100/50 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">Monitor connected</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <p className="text-sm text-gray-500">Calibrating…</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Returning to location…</p>
        </div>
      )}
    </div>
  )
}
