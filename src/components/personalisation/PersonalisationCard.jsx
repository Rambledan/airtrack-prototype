import { useState, useRef } from 'react'

// ── Answer input components ──────────────────────────────────────────

function ChoiceInput({ question, answer, onAnswer }) {
  const [selfDescribeText, setSelfDescribeText] = useState(
    answer && !question.options.filter(o => o !== question.selfDescribeOption).includes(answer)
      ? answer
      : ''
  )
  const isSelfDescribe = answer === question.selfDescribeOption || selfDescribeText

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        {question.options.map(option => {
          const isSelected = option === question.selfDescribeOption
            ? isSelfDescribe
            : answer === option
          return (
            <button
              key={option}
              onClick={() => {
                if (option === question.selfDescribeOption) {
                  onAnswer(question.selfDescribeOption)
                  setSelfDescribeText('')
                } else {
                  onAnswer(option)
                  setSelfDescribeText('')
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                isSelected
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40 hover:text-brand'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
      {/* Self-describe text input */}
      {(answer === question.selfDescribeOption || isSelfDescribe) && (
        <input
          type="text"
          value={selfDescribeText}
          onChange={e => {
            setSelfDescribeText(e.target.value)
            onAnswer(e.target.value || question.selfDescribeOption)
          }}
          placeholder="Please describe…"
          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-brand focus:outline-none bg-gray-50"
          autoFocus
        />
      )}
    </div>
  )
}

function DateInput({ answer, onAnswer }) {
  const now = new Date()
  const currentYear = now.getFullYear()

  const parts = answer ? answer.split('-') : [null, null, null]
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

  return (
    <div className="mt-3 flex gap-2">
      {/* Day */}
      <select
        value={day}
        onChange={e => { setDay(e.target.value); handleChange(year, month, e.target.value) }}
        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:border-brand focus:outline-none text-gray-700"
      >
        <option value="">Day</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Month */}
      <select
        value={month}
        onChange={e => { setMonth(e.target.value); handleChange(year, e.target.value, day) }}
        className="flex-[2] px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:border-brand focus:outline-none text-gray-700"
      >
        <option value="">Month</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>{m}</option>
        ))}
      </select>

      {/* Year */}
      <select
        value={year}
        onChange={e => { setYear(e.target.value); handleChange(e.target.value, month, day) }}
        className="flex-[1.5] px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:border-brand focus:outline-none text-gray-700"
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
  // answer: null = not answered, false = No, string[] = Yes + conditions
  const isYes = Array.isArray(answer)
  const isNo = answer === false
  const selectedConditions = isYes ? answer : []

  const toggleCondition = (condition) => {
    const current = isYes ? answer : []
    const updated = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition]
    onAnswer(updated.length > 0 ? updated : [])
  }

  return (
    <div className="mt-3 space-y-2">
      {/* Yes / No toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onAnswer([])}
          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
            isYes
              ? 'bg-brand text-white border-brand shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer(false)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
            isNo
              ? 'bg-brand text-white border-brand shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40'
          }`}
        >
          No
        </button>
      </div>

      {/* Condition checkboxes (shown when Yes selected) */}
      {isYes && (
        <div className="pl-0.5 space-y-1.5">
          <p className="text-xs text-gray-400 mb-2">Select all that apply:</p>
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
                    checked
                      ? 'bg-brand border-brand'
                      : 'bg-white border-gray-300 group-hover:border-brand/50'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 12 10" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 5 4.5 8.5 11 1" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => toggleCondition(condition)}
                  className="text-sm text-gray-700"
                >
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

// ── Main PersonalisationCard ─────────────────────────────────────────

export default function PersonalisationCard({ question, onSave, onDismiss }) {
  const [answer, setAnswer] = useState(null)
  const [isExiting, setIsExiting] = useState(false)
  const exitTimer = useRef(null)

  const canSave = () => {
    if (answer === null) return false
    if (question.type === 'choice') {
      // Has a selection, and if self-describe it needs text
      return !!answer && answer !== question.selfDescribeOption
    }
    if (question.type === 'date') return !!answer
    if (question.type === 'health') {
      // false = No, or array (even empty = selected Yes but no specific conditions)
      return answer === false || Array.isArray(answer)
    }
    return false
  }

  const handleSave = () => {
    if (!canSave()) return
    setIsExiting(true)
    exitTimer.current = setTimeout(() => {
      onSave(question.id, answer)
    }, 480)
  }

  const handleDismiss = () => {
    onDismiss(question.id)
  }

  return (
    <div
      className={`bg-white rounded-3xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-brand/30 transition-all duration-450 ease-in-out ${
        isExiting
          ? 'opacity-0 scale-y-0 origin-top max-h-0 py-0 mb-0 overflow-hidden'
          : 'opacity-100 scale-y-100 max-h-[600px]'
      }`}
      style={{ transitionDuration: '450ms' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 text-xl">
            {question.icon}
          </div>
          {/* Text */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 leading-snug">
              {question.title}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{question.subtitle}</p>
          </div>
        </div>
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0 mt-0.5"
          aria-label="Dismiss question"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Answer input */}
      {question.type === 'choice' && (
        <ChoiceInput question={question} answer={answer} onAnswer={setAnswer} />
      )}
      {question.type === 'date' && (
        <DateInput answer={answer} onAnswer={setAnswer} />
      )}
      {question.type === 'health' && (
        <HealthInput question={question} answer={answer} onAnswer={setAnswer} />
      )}

      {/* Save CTA */}
      <div className="mt-4">
        <button
          onClick={handleSave}
          disabled={!canSave()}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
            canSave()
              ? 'bg-brand text-white hover:bg-brand/90 active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save answer
        </button>
      </div>
    </div>
  )
}
