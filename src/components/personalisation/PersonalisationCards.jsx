import { PERSONALISATION_QUESTIONS } from '../../data/personalisationQuestions'
import PersonalisationCard from './PersonalisationCard'

export default function PersonalisationCards({ personalization, onSave, onDismiss, daysWithApp = 0 }) {
  // Only show feed cards after 48 hours (2 days) with the app
  if (daysWithApp < 2) return null

  const dismissed = personalization?.dismissed || []

  const pending = PERSONALISATION_QUESTIONS.filter(q => {
    const isDismissed = dismissed.includes(q.id)
    const value = personalization?.[q.id]
    // Answered = any non-null value (including false for health "No")
    const isAnswered = value !== null && value !== undefined
    return !isDismissed && !isAnswered
  })

  if (pending.length === 0) return null

  return (
    <div className="space-y-3 mb-1">
      {pending.map(question => (
        <PersonalisationCard
          key={question.id}
          question={question}
          onSave={onSave}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
