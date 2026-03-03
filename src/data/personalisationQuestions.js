export const PERSONALISATION_QUESTIONS = [
  {
    id: 'gender',
    icon: '🧬',
    title: 'For health modelling, which applies to you?',
    subtitle: 'Helps us personalise air quality risk for your biology',
    type: 'choice',
    options: ['Female biology', 'Male biology', 'Prefer not to say'],
  },
  {
    id: 'dateOfBirth',
    icon: '🎂',
    title: 'What is your date of birth?',
    subtitle: 'Age affects how air quality impacts your health',
    type: 'date',
    // Renders 3 dropdowns: Day / Month / Year
  },
  {
    id: 'healthConditions',
    icon: '🫁',
    title: 'Do you have any respiratory health conditions?',
    subtitle: "We'll flag higher-risk air quality days for you",
    type: 'health',
    conditions: ['Asthma', 'COPD', 'Allergic rhinitis', 'Heart condition', 'Other'],
  },
]

// Helper: format a saved answer into a human-readable summary string
export function formatPersonalisationAnswer(question, value) {
  if (value === null || value === undefined) return null

  switch (question.type) {
    case 'choice':
      return value

    case 'date': {
      if (!value) return null
      const [year, month, day] = value.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`
    }

    case 'health':
      if (value === false) return 'None'
      if (Array.isArray(value) && value.length > 0) return value.join(', ')
      return 'None'

    default:
      return String(value)
  }
}
