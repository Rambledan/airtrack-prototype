import { useState } from 'react'
import { PERSONALISATION_QUESTIONS } from '../../data/personalisationQuestions'

// ── Inline answer inputs ──────────────────────────────────────────────

function GenderInput({ question, answer, onAnswer }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {question.options.map(option => (
        <button
          key={option}
          onClick={() => onAnswer(option)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
            answer === option
              ? 'bg-brand text-white border-brand shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40 hover:text-brand'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function DateInput({ answer, onAnswer }) {
  const currentYear = new Date().getFullYear()
  const parts = answer ? answer.split('-') : ['', '', '']
  const [year, setYear] = useState(parts[0] || '')
  const [month, setMonth] = useState(parts[1] || '')
  const [day, setDay] = useState(parts[2] || '')

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const handleChange = (newYear, newMonth, newDay) => {
    if (newYear && newMonth && newDay) {
      const paddedMonth = String(newMonth).padStart(2, '0')
      const paddedDay = String(newDay).padStart(2, '0')
      onAnswer(`${newYear}-${paddedMonth}-${paddedDay}`)
    } else {
      onAnswer(null)
    }
  }

  const selectClass = 'flex-1 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:border-brand focus:outline-none text-gray-700'

  return (
    <div className="flex gap-2 mt-3">
      <select
        value={day}
        onChange={e => { setDay(e.target.value); handleChange(year, month, e.target.value) }}
        className={selectClass}
      >
        <option value="">Day</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={month}
        onChange={e => { setMonth(e.target.value); handleChange(year, e.target.value, day) }}
        className={`${selectClass} flex-[2]`}
      >
        <option value="">Month</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>{m}</option>
        ))}
      </select>

      <select
        value={year}
        onChange={e => { setYear(e.target.value); handleChange(e.target.value, month, day) }}
        className={`${selectClass} flex-[1.5]`}
      >
        <option value="">Year</option>
        {Array.from({ length: 100 }, (_, i) => currentYear - 1 - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

function HealthInput({ question, answer, onAnswer }) {
  const isYes = Array.isArray(answer)
  const isNo = answer === false
  const selectedConditions = isYes ? answer : []

  const toggleCondition = (condition) => {
    const current = isYes ? answer : []
    const updated = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition]
    onAnswer(updated)
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => onAnswer([])}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
            isYes
              ? 'bg-brand text-white border-brand shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer(false)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
            isNo
              ? 'bg-brand text-white border-brand shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40'
          }`}
        >
          No
        </button>
      </div>

      {isYes && (
        <div className="pl-0.5 space-y-2 pt-1">
          <p className="text-xs text-gray-400">Select all that apply:</p>
          {question.conditions.map(condition => {
            const checked = selectedConditions.includes(condition)
            return (
              <label
                key={condition}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  onClick={() => toggleCondition(condition)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                    checked ? 'bg-brand border-brand' : 'bg-white border-gray-300 group-hover:border-brand/50'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 12 10" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 5 4.5 8.5 11 1" />
                    </svg>
                  )}
                </div>
                <span onClick={() => toggleCondition(condition)} className="text-sm text-gray-700">
                  {condition}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────

export default function PersonalisationOnboarding({ onComplete, savePersonalisation }) {
  const [answers, setAnswers] = useState({
    gender: null,
    dateOfBirth: null,
    healthConditions: null,
  })

  const genderQ = PERSONALISATION_QUESTIONS.find(q => q.id === 'gender')
  const dobQ = PERSONALISATION_QUESTIONS.find(q => q.id === 'dateOfBirth')
  const healthQ = PERSONALISATION_QUESTIONS.find(q => q.id === 'healthConditions')

  const handleAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    // Save any questions that were answered
    Object.entries(answers).forEach(([field, value]) => {
      if (value !== null && value !== undefined) {
        savePersonalisation(field, value)
      }
    })
    onComplete()
  }

  const handleSkip = () => {
    onComplete()
  }

  const hasAnyAnswer = Object.values(answers).some(v => v !== null && v !== undefined)

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Progress bar — full, this is the final step */}
      <div className="h-1 bg-gray-100 shrink-0">
        <div className="h-full bg-brand w-full transition-all duration-500 ease-out" />
      </div>

      {/* Step indicator */}
      <div className="px-6 pt-6 pb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          {/* All dots filled */}
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-brand" />
          ))}
          {/* Current step dot */}
          <div className="h-1.5 flex-1 rounded-full bg-brand" />
        </div>
        <p className="text-xs text-gray-400 mt-2">Almost there — optional questions</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {/* Heading */}
        <div className="py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Personalise your AirTrack
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            These optional details help us tailor air quality advice to you. You can answer now or any time from your Profile.
          </p>
        </div>

        {/* Gender question */}
        <div className="pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{genderQ.icon}</span>
            <h3 className="text-sm font-semibold text-gray-900">{genderQ.title}</h3>
          </div>
          <p className="text-xs text-gray-400 ml-8">{genderQ.subtitle}</p>
          <GenderInput
            question={genderQ}
            answer={answers.gender}
            onAnswer={v => handleAnswer('gender', v)}
          />
        </div>

        {/* Date of birth question */}
        <div className="py-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{dobQ.icon}</span>
            <h3 className="text-sm font-semibold text-gray-900">{dobQ.title}</h3>
          </div>
          <p className="text-xs text-gray-400 ml-8">{dobQ.subtitle}</p>
          <DateInput
            answer={answers.dateOfBirth}
            onAnswer={v => handleAnswer('dateOfBirth', v)}
          />
        </div>

        {/* Health conditions question */}
        <div className="pt-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{healthQ.icon}</span>
            <h3 className="text-sm font-semibold text-gray-900">{healthQ.title}</h3>
          </div>
          <p className="text-xs text-gray-400 ml-8">{healthQ.subtitle}</p>
          <HealthInput
            question={healthQ}
            answer={answers.healthConditions}
            onAnswer={v => handleAnswer('healthConditions', v)}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-6 pb-8 pt-3 space-y-3 shrink-0 border-t border-gray-100">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-brand hover:bg-brand/90 transition-opacity shadow-sm"
        >
          {hasAnyAnswer ? 'Save & Continue' : 'Continue'}
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
