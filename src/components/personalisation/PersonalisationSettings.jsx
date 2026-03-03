import { useState } from 'react'
import { PERSONALISATION_QUESTIONS, formatPersonalisationAnswer } from '../../data/personalisationQuestions'
import PersonalisationCard from './PersonalisationCard'

function EditableRow({ question, value, isDismissed, onSave, onDismiss, onRestore }) {
  const [isEditing, setIsEditing] = useState(false)

  const formattedAnswer = formatPersonalisationAnswer(question, value)
  const isAnswered = value !== null && value !== undefined

  const handleSave = (id, newValue) => {
    onSave(id, newValue)
    setIsEditing(false)
  }

  const handleDismiss = (id) => {
    onDismiss(id)
    setIsEditing(false)
  }

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Row header */}
      <div className="flex items-center gap-3 py-3.5">
        {/* Icon */}
        <span className="text-base w-7 text-center">{question.icon}</span>

        {/* Label + answer */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500">{question.title.split('?')[0]}?</p>
          {isAnswered && !isDismissed ? (
            <p className="text-sm text-gray-900 mt-0.5 font-medium">{formattedAnswer}</p>
          ) : isDismissed ? (
            <p className="text-sm text-gray-400 mt-0.5 italic">Dismissed from feed</p>
          ) : (
            <p className="text-sm text-gray-400 mt-0.5">Not set</p>
          )}
        </div>

        {/* Action button */}
        {isDismissed ? (
          <button
            onClick={() => onRestore(question.id)}
            className="text-xs font-medium text-brand hover:text-brand/70 transition-colors shrink-0"
          >
            Restore
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(e => !e)}
            className="text-xs font-medium text-brand hover:text-brand/70 transition-colors shrink-0 flex items-center gap-1"
          >
            {isAnswered ? (
              <>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add
              </>
            )}
          </button>
        )}
      </div>

      {/* Inline edit form */}
      {isEditing && (
        <div className="pb-3">
          <PersonalisationCard
            question={question}
            onSave={handleSave}
            onDismiss={handleDismiss}
          />
        </div>
      )}
    </div>
  )
}

export default function PersonalisationSettings({ personalization, onSave, onDismiss, onRestore }) {
  const dismissed = personalization?.dismissed || []

  return (
    <div className="w-full mt-6 mb-2">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1 px-1">
        <h3 className="text-sm font-semibold text-gray-700">Your Details</h3>
        <span className="text-xs text-gray-400">· personalises your experience</span>
      </div>

      {/* Questions list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-1">
        {PERSONALISATION_QUESTIONS.map(question => {
          const isDismissed = dismissed.includes(question.id)
          const value = personalization?.[question.id] ?? null
          return (
            <EditableRow
              key={question.id}
              question={question}
              value={value}
              isDismissed={isDismissed}
              onSave={onSave}
              onDismiss={onDismiss}
              onRestore={onRestore}
            />
          )
        })}
      </div>

      {/* Privacy note */}
      <p className="text-[11px] text-gray-400 mt-2 px-1 leading-relaxed">
        Your details are stored locally on your device and used only to personalise your AirTrack experience.
      </p>
    </div>
  )
}
