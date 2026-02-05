const HOUR_DATA = [
  { time: 'Now', aqi: 42 },
  { time: '1PM', aqi: 48 },
  { time: '2PM', aqi: 55 },
  { time: '3PM', aqi: 62 },
  { time: '4PM', aqi: 58 },
  { time: '5PM', aqi: 71 },
  { time: '6PM', aqi: 65 },
  { time: '7PM', aqi: 52 },
]

function getBarColor(aqi) {
  if (aqi <= 50) return 'var(--color-aqi-good)'
  if (aqi <= 100) return 'var(--color-aqi-moderate)'
  if (aqi <= 150) return 'var(--color-aqi-unhealthy-sensitive)'
  return 'var(--color-aqi-unhealthy)'
}

export default function ForecastBar() {
  const maxAqi = Math.max(...HOUR_DATA.map((d) => d.aqi))

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Hourly Forecast</h3>
      <div className="flex items-end justify-between gap-2 h-28">
        {HOUR_DATA.map((d) => (
          <div key={d.time} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[10px] font-medium text-gray-500">{d.aqi}</span>
            <div
              className="w-full rounded-lg transition-all duration-500"
              style={{
                height: `${(d.aqi / maxAqi) * 100}%`,
                backgroundColor: getBarColor(d.aqi),
                minHeight: '8px',
              }}
            />
            <span className="text-[10px] text-gray-400 font-medium">{d.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
