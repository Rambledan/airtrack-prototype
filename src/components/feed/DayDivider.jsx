export default function DayDivider({ date }) {
  const formatDayLabel = (date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const diffDays = Math.round((today - targetDate) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'

    // For this week, show day name
    if (diffDays < 7) {
      return date.toLocaleDateString('en-GB', { weekday: 'long' })
    }

    // For older dates, show full date
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2">
        {formatDayLabel(date)}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent" />
    </div>
  )
}
