import { useMemo } from 'react'

const AQI_LEVELS = [
  { max: 50, label: 'Good', color: 'var(--color-aqi-good)', textColor: '#166534' },
  { max: 100, label: 'Moderate', color: 'var(--color-aqi-moderate)', textColor: '#854d0e' },
  { max: 150, label: 'Unhealthy for Sensitive Groups', color: 'var(--color-aqi-unhealthy-sensitive)', textColor: '#9a3412' },
  { max: 200, label: 'Unhealthy', color: 'var(--color-aqi-unhealthy)', textColor: '#991b1b' },
  { max: 300, label: 'Very Unhealthy', color: 'var(--color-aqi-very-unhealthy)', textColor: '#581c87' },
  { max: 500, label: 'Hazardous', color: 'var(--color-aqi-hazardous)', textColor: '#fff' },
]

function getAqiLevel(value) {
  return AQI_LEVELS.find((l) => value <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1]
}

export default function AqiGauge({ value = 0 }) {
  const level = useMemo(() => getAqiLevel(value), [value])
  const percentage = Math.min((value / 500) * 100, 100)

  // Arc parameters
  const radius = 80
  const strokeWidth = 14
  const startAngle = 135
  const endAngle = 405
  const totalAngle = endAngle - startAngle
  const circumference = (totalAngle / 360) * 2 * Math.PI * radius

  const filledLength = (percentage / 100) * circumference

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function describeArc(cx, cy, r, start, end) {
    const s = polarToCartesian(cx, cy, r, start)
    const e = polarToCartesian(cx, cy, r, end)
    const largeArc = end - start > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  const bgArc = describeArc(100, 100, radius, startAngle, endAngle)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 180" className="w-56 h-auto">
        {/* Background arc */}
        <path
          d={bgArc}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={bgArc}
          fill="none"
          stroke={level.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${circumference}`}
          className="transition-all duration-700 ease-out"
        />
        {/* AQI value */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="font-bold"
          style={{ fontSize: '42px', fill: level.color }}
        >
          {value}
        </text>
        <text
          x="100"
          y="115"
          textAnchor="middle"
          className="font-medium"
          style={{ fontSize: '11px', fill: '#6b7280' }}
        >
          US AQI
        </text>
      </svg>
      <div
        className="mt-1 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: level.color, color: level.textColor }}
      >
        {level.label}
      </div>
    </div>
  )
}
