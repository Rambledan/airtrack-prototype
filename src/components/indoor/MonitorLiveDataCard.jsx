import { useState, useEffect } from 'react'

function seededVal(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000
  const r = x - Math.floor(x)
  return min + r * (max - min)
}

function charSum(str) {
  return str.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
}

function pm25Status(val) {
  if (val < 12) return { label: 'Good', color: '#22c55e', bg: 'bg-green-50', text: 'text-green-700' }
  if (val < 35) return { label: 'Moderate', color: '#eab308', bg: 'bg-yellow-50', text: 'text-yellow-700' }
  return { label: 'Poor', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700' }
}

export default function MonitorLiveDataCard({ locationName, monitorCode }) {
  const seed = charSum(locationName || 'Home')

  const [readings, setReadings] = useState({
    pm25: parseFloat(seededVal(seed, 4, 28).toFixed(1)),
    voc:  Math.round(seededVal(seed + 1, 60, 180)),
    co2:  Math.round(seededVal(seed + 2, 420, 800)),
  })

  useEffect(() => {
    const id = setInterval(() => {
      setReadings(prev => ({
        pm25: parseFloat(Math.max(1, Math.min(80, prev.pm25 + (Math.random() - 0.5))).toFixed(1)),
        voc:  Math.round(Math.max(30, Math.min(600, prev.voc + (Math.random() - 0.5) * 4))),
        co2:  Math.round(Math.max(400, Math.min(2000, prev.co2 + (Math.random() - 0.5) * 10))),
      }))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const status = pm25Status(readings.pm25)

  const metrics = [
    { label: 'PM2.5', value: readings.pm25, unit: 'µg/m³', good: readings.pm25 < 12, warn: readings.pm25 >= 35 },
    { label: 'VOC',   value: readings.voc,  unit: 'ppb',   good: readings.voc < 100,  warn: readings.voc >= 300 },
    { label: 'CO₂',  value: readings.co2,  unit: 'ppm',   good: readings.co2 < 600,  warn: readings.co2 >= 1000 },
  ]

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Live Air Quality</h3>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs font-semibold text-green-600">Live</span>
        </div>
      </div>

      {/* Status chip */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 ${status.bg}`}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
        <span className={`text-xs font-semibold ${status.text}`}>{status.label}</span>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className={`rounded-2xl p-3 text-center ${
            m.warn ? 'bg-red-50' : m.good ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className={`text-lg font-bold tabular-nums ${
              m.warn ? 'text-red-700' : m.good ? 'text-green-700' : 'text-amber-700'
            }`}>
              {m.value}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">{m.unit}</div>
            <div className="text-[10px] font-semibold text-gray-600 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400">
        Replaces estimated score · Monitor {monitorCode}
      </p>
    </div>
  )
}
