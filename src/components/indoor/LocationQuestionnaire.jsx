import { useState } from 'react'
import { LOCATION_TYPES } from '../../data/locationProfiles'

export default function LocationQuestionnaire({ locationType, existingAnswers, onSave, onDismiss }) {
  const [localAnswers, setLocalAnswers] = useState(existingAnswers || {})

  const config = LOCATION_TYPES[locationType] || LOCATION_TYPES.home
  const questions = config.questions

  const allAnswered = questions.every(q => localAnswers[q.id] !== undefined)

  return (
    <div className="bg-white rounded-3xl p-5 border border-brand/20 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">About this location</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5 ml-9">
        Answer a few quick questions so we can estimate your indoor pollution profile more accurately.
      </p>

      <div className="space-y-5">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="text-sm font-medium text-gray-700 mb-2">{q.label}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const isSelected = localAnswers[q.id] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setLocalAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? 'bg-brand text-white border-brand shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40 hover:text-brand'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => onSave(localAnswers)}
          disabled={!allAnswered}
          className="flex-1 py-3 bg-brand text-white rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand/90 transition-colors"
        >
          Save profile
        </button>
        <button
          onClick={onDismiss}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
