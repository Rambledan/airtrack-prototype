import { useState } from 'react'

const ASSETS = {
  airtrackLogo: '/AirtrackA.png',
  trendingIcon: '/noun-trending-8169830.png',
  routeIcon: '/noun-route-41620.png',
  monitorIcon: '/noun-oxygen-sensor-8080122.png',
}

// Dummy data — all editable for prototype demos
const DUMMY = {
  location: 'Brixton',
  airQuality: {
    score: 76,
    bars: [31, 36, 39, 42, 42, 42, 36, 22],
    barColors: ['#a17880', '#a078a1', '#8778a1', '#5579ff', '#5579ff', '#5579ff', '#8778a1', '#c74375'],
  },
  pollen: {
    tree: { level: 'HIGH', color: '#f94138' },
    grass: { level: 'MED', color: '#8a38f5' },
  },
  cleanestTime: '11:05',
  windows: { open: '11:05', close: '19:05' },
  tracked: {
    outdoor: { score: 79, label: 'Good', color: '#5378e8' },
    indoor: { score: 82, label: 'Excellent', color: '#53a3e8' },
    insight: 'Your air has been cleaner than usual due to transport choices, and good indoor air quality',
  },
  cleanRoutes: [
    { name: 'Park Lane', improvement: '+13%' },
    { name: 'North Road', improvement: '+5%' },
  ],
  health: 'Your Heart Rate Variability appears to trend higher during sleep in cleaner air',
  performance: 'Your Wednesday run with elevated pollution may have felt higher effort for similar pace',
  leaderboard: { rank: '23rd', change: 'You moved up 2 places in 24hrs' },
}

// Hourly AQ data for Brixton — 0:00 to 23:00
// Higher = cleaner. Rush hours dip, midday peaks.
const HOURLY_AQ = [
  52, 48, 51, 54, 56, 50, 42, 38, 35, 44, 62, 76,
  78, 75, 72, 74, 71, 68, 62, 55, 50, 46, 44, 42,
]
const NOW_HOUR = 11

// ─── Shared SVG / Icon components ───────────────────────────────────────────

function RunIcon({ size = 48 }) {
  return <img src="/Run.png" alt="Run" style={{ width: size, height: size }} className="object-contain" />
}

function HeartIcon({ size = 36, color = '#263238' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function LocationIcon({ size = 18, color = '#607d8b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ScoreRing({ score, label, color, size = 92 }) {
  const r = 38
  const cx = size / 2
  const circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e8f0fe" strokeWidth="6" />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: -4 }}>
        <span className="font-['DM_Sans',sans-serif] font-normal leading-tight" style={{ color, fontSize: 22 }}>{score}%</span>
        <span className="font-['DM_Sans',sans-serif] font-normal" style={{ color, fontSize: 11 }}>{label}</span>
      </div>
    </div>
  )
}

// Nav icons
function HomeNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}
function AnalyticsNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
}
function GroupsNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function SettingsNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}

// ─── Hourly AQ bar chart (shared by detail panels) ───────────────────────────

function HourlyChart({ highlightFrom = null, highlightTo = null, nowHour = NOW_HOUR }) {
  const maxVal = Math.max(...HOURLY_AQ)
  const chartH = 80
  const labels = ['00:00', '06:00', '12:00', '18:00', '23:00']
  const labelHours = [0, 6, 12, 18, 23]

  function barColor(i, val) {
    if (highlightFrom !== null && i >= highlightFrom && i <= highlightTo) return '#5579ff'
    if (val >= 70) return '#a8c4f8'
    if (val >= 50) return '#b8b8e8'
    return '#d4a8c4'
  }

  return (
    <div className="w-full">
      {/* Bars */}
      <div className="flex items-end gap-[3px] px-[2px]" style={{ height: chartH }}>
        {HOURLY_AQ.map((val, i) => {
          const h = Math.round((val / maxVal) * chartH)
          const isNow = i === nowHour
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end relative">
              <div
                className="w-full rounded-t-[4px] rounded-b-[4px] transition-all"
                style={{ height: h, background: barColor(i, val), opacity: isNow ? 1 : 0.85 }}
              />
              {isNow && (
                <div className="absolute -bottom-[18px] flex flex-col items-center">
                  <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '5px solid #ff610a' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Now label */}
      <div className="relative h-[22px]">
        <div
          className="absolute flex items-center gap-[3px]"
          style={{ left: `${(nowHour / 23) * 94}%` }}
        >
          <span className="font-['DM_Sans',sans-serif] text-[11px] text-[#ff610a] font-medium">Now</span>
        </div>
      </div>
      {/* Time labels */}
      <div className="flex justify-between px-[2px] mt-[2px]">
        {labels.map((l) => (
          <span key={l} className="font-['DM_Sans',sans-serif] text-[10px] text-[#90a4ae]">{l}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Detail sheet backdrop + container ───────────────────────────────────────

function DetailSheet({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="relative bg-white rounded-t-[28px] shadow-xl overflow-y-auto"
        style={{ maxHeight: '82%' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-[12px] pb-[4px]">
          <div className="w-[40px] h-[4px] rounded-full bg-[#cfd8dc]" />
        </div>
        <div className="px-[20px] pb-[32px]">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Day selector (used in Air Quality detail) ───────────────────────────────

const DAYS = ['Today', 'Tmrw', 'Thu', 'Fri']

function DaySelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-[6px]">
      {DAYS.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className="rounded-[12px] py-[10px] font-['DM_Sans',sans-serif] font-medium text-[14px] transition-colors"
          style={{
            background: selected === d ? '#ff610a' : '#f0f0f0',
            color: selected === d ? '#fff' : '#263238',
          }}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

// ─── Detail content: Air Quality ─────────────────────────────────────────────

function AirQualityDetail() {
  const [day, setDay] = useState('Today')
  const [activity, setActivity] = useState('Running')
  const activities = ['Running', 'Cycling', 'Walking']

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Header */}
      <div className="flex items-center gap-[10px] pt-[4px]">
        <img src={ASSETS.airtrackLogo} alt="" className="w-[28px] h-[28px] object-contain" />
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[20px]">Air quality forecast</p>
      </div>

      <DaySelector selected={day} onSelect={setDay} />

      {/* Location + activity row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <LocationIcon size={16} color="#607d8b" />
          <span className="font-['DM_Sans',sans-serif] text-[14px] text-[#607d8b]">{DUMMY.location}</span>
        </div>
        <div className="flex gap-[6px]">
          {activities.map((a) => (
            <button
              key={a}
              onClick={() => setActivity(a)}
              className="px-[10px] py-[5px] rounded-[10px] font-['DM_Sans',sans-serif] text-[12px] transition-colors"
              style={{
                background: activity === a ? '#263238' : '#f0f0f0',
                color: activity === a ? '#fff' : '#607d8b',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <HourlyChart highlightFrom={9} highlightTo={14} />

      {/* Score badges */}
      <div className="flex gap-[8px]">
        <div className="flex-1 bg-[#5579ff] rounded-[16px] py-[10px] px-[12px] flex items-center justify-center">
          <span className="font-['DM_Sans',sans-serif] font-medium text-white text-[14px]">Air quality Good · 76%</span>
        </div>
        <div className="flex-1 bg-[#facc15] rounded-[16px] py-[10px] px-[12px] flex items-center justify-center">
          <span className="font-['DM_Sans',sans-serif] font-medium text-[#263238] text-[14px]">Pollen · High ↑</span>
        </div>
      </div>

      {/* Performance insight */}
      <div className="bg-[#f0f4ff] rounded-[16px] p-[14px] flex flex-col gap-[8px]">
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[14px]">Your data</p>
        <p className="font-['DM_Sans',sans-serif] text-[13px] text-[#455a64] leading-snug">
          Your tracked runs show pace drops ~6% on days with AQI below 50. Today stays clean until 19:00 — your Brixton loop at 11:05 is your best training window this week.
        </p>
      </div>

      {/* Comparison */}
      <div className="bg-[#fafafa] rounded-[16px] p-[14px] flex flex-col gap-[6px]">
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[14px]">vs your 7am slot</p>
        <div className="flex items-center justify-between">
          <span className="font-['DM_Sans',sans-serif] text-[13px] text-[#607d8b]">7:00 air quality</span>
          <span className="font-['DM_Sans',sans-serif] font-medium text-[#f94138] text-[13px]">35% — Poor</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-['DM_Sans',sans-serif] text-[13px] text-[#607d8b]">11:05 air quality</span>
          <span className="font-['DM_Sans',sans-serif] font-medium text-[#5579ff] text-[13px]">76% — Good</span>
        </div>
        <div className="h-[1px] bg-[#e8edf0] my-[2px]" />
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#263238]">
          Shifting your run <span className="font-bold">saves 34% NO₂ exposure</span> vs your usual morning slot.
        </p>
      </div>
    </div>
  )
}

// ─── Detail content: Cleanest Time ───────────────────────────────────────────

function CleanestTimeDetail() {
  const [activity, setActivity] = useState('Running')
  const activities = ['Running', 'Cycling', 'Walking']

  const activityInsight = {
    Running: 'Based on your Brixton route data, 11:05–13:00 gives you the cleanest window for a training run. Your tracked pace on clean-air runs averages 5:42/km vs 6:05/km on high-pollution days.',
    Cycling: 'Your Brixton–Clapham cycle route is 28% cleaner between 11:00–13:00 than during your usual 8am commute window. NO₂ on Coldharbour Lane drops from 68µg to 41µg.',
    Walking: 'An 11:05 walk through Brockwell Park avoids the morning diesel peak entirely. Park-routed walks at this time score consistently above 80% — your best air of the week.',
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[10px] pt-[4px]">
        <RunIcon size={28} />
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[20px]">Cleanest time</p>
      </div>

      {/* Big time display */}
      <div className="bg-[#f0f4ff] rounded-[20px] p-[20px] flex flex-col items-center gap-[4px]">
        <span className="font-['DM_Sans',sans-serif] text-[48px] font-light text-[#1e88e5] leading-none">11:05</span>
        <span className="font-['DM_Sans',sans-serif] text-[13px] text-[#607d8b]">Today · {DUMMY.location}</span>
        <div className="mt-[4px] bg-[#5579ff] rounded-[12px] px-[14px] py-[4px]">
          <span className="font-['DM_Sans',sans-serif] font-medium text-white text-[13px]">Peak clean window 11:05 – 13:00</span>
        </div>
      </div>

      {/* Chart — highlight the clean window */}
      <div>
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#90a4ae] mb-[8px]">Hourly forecast — highlighted = cleanest window</p>
        <HourlyChart highlightFrom={11} highlightTo={13} />
      </div>

      {/* Activity selector */}
      <div>
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[14px] mb-[8px]">Your activity</p>
        <div className="flex gap-[6px]">
          {activities.map((a) => (
            <button
              key={a}
              onClick={() => setActivity(a)}
              className="flex-1 py-[8px] rounded-[12px] font-['DM_Sans',sans-serif] text-[13px] transition-colors"
              style={{
                background: activity === a ? '#263238' : '#f0f0f0',
                color: activity === a ? '#fff' : '#607d8b',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Activity-specific insight */}
      <div className="bg-[#fafafa] rounded-[16px] p-[14px]">
        <p className="font-['DM_Sans',sans-serif] text-[13px] text-[#455a64] leading-snug">
          {activityInsight[activity]}
        </p>
      </div>

      {/* Health context */}
      <div className="border border-[#e8f0fe] rounded-[16px] p-[14px] flex flex-col gap-[6px]">
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[13px]">Why it matters for your training</p>
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#607d8b] leading-snug">
          PM2.5 and NO₂ at your usual 7am levels increase breathing resistance and reduce oxygen uptake efficiency. Training in clean air means the effort you put in actually converts — your VO₂ max adaptations accumulate faster on clean-air days.
        </p>
      </div>
    </div>
  )
}

// ─── Detail content: Windows ─────────────────────────────────────────────────

function WindowsDetail() {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[10px] pt-[4px]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#263238" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[20px]">Window ventilation</p>
      </div>

      {/* Open / close summary */}
      <div className="grid grid-cols-2 gap-[8px]">
        <div className="bg-[#e8f5e9] rounded-[16px] p-[14px] flex flex-col items-center gap-[4px]">
          <span className="font-['DM_Sans',sans-serif] text-[11px] text-[#607d8b] uppercase tracking-wide">Open</span>
          <span className="font-['DM_Sans',sans-serif] text-[32px] font-light text-[#1e88e5] leading-none">11:05</span>
          <span className="font-['DM_Sans',sans-serif] text-[11px] text-[#43a047]">AQ reaches 76% ✓</span>
        </div>
        <div className="bg-[#fff3e0] rounded-[16px] p-[14px] flex flex-col items-center gap-[4px]">
          <span className="font-['DM_Sans',sans-serif] text-[11px] text-[#607d8b] uppercase tracking-wide">Close</span>
          <span className="font-['DM_Sans',sans-serif] text-[32px] font-light text-[#ff610a] leading-none">19:05</span>
          <span className="font-['DM_Sans',sans-serif] text-[11px] text-[#ef6c00]">Traffic rises after 19:00</span>
        </div>
      </div>

      {/* Chart — highlight ventilation window */}
      <div>
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#90a4ae] mb-[8px]">Clean air window — highlighted</p>
        <HourlyChart highlightFrom={11} highlightTo={19} />
      </div>

      {/* Indoor vs outdoor */}
      <div className="bg-[#fafafa] rounded-[16px] p-[14px] flex flex-col gap-[10px]">
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[14px]">Indoor vs outdoor today</p>
        <div className="flex items-center gap-[10px]">
          <div className="flex-1">
            <div className="flex justify-between mb-[4px]">
              <span className="font-['DM_Sans',sans-serif] text-[12px] text-[#607d8b]">Outdoor (11:05)</span>
              <span className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[#5579ff]">76%</span>
            </div>
            <div className="h-[8px] bg-[#e8edf0] rounded-full overflow-hidden">
              <div className="h-full bg-[#5579ff] rounded-full" style={{ width: '76%' }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="flex-1">
            <div className="flex justify-between mb-[4px]">
              <span className="font-['DM_Sans',sans-serif] text-[12px] text-[#607d8b]">Indoor (current)</span>
              <span className="font-['DM_Sans',sans-serif] font-medium text-[12px] text-[#53a3e8]">82%</span>
            </div>
            <div className="h-[8px] bg-[#e8edf0] rounded-full overflow-hidden">
              <div className="h-full bg-[#53a3e8] rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#607d8b] leading-snug">
          Your indoor air is already good. Opening at 11:05 maintains that quality through the afternoon — the clean outdoor air reinforces rather than degrades it.
        </p>
      </div>

      {/* Sleep/HRV insight — persona-relevant */}
      <div className="bg-[#f0f4ff] rounded-[16px] p-[14px] flex flex-col gap-[6px]">
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[13px]">Sleep & recovery</p>
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#455a64] leading-snug">
          Your tracked data shows a <span className="font-bold text-[#263238]">12% higher HRV readiness score</span> on nights following good daytime ventilation. Closing windows before 19:05 keeps NO₂ out during the evening — when your body transitions into recovery.
        </p>
      </div>

      {/* Why evening matters */}
      <div className="border border-[#ffe0cc] rounded-[16px] p-[14px]">
        <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[13px] mb-[4px]">Why close at 19:05?</p>
        <p className="font-['DM_Sans',sans-serif] text-[12px] text-[#607d8b] leading-snug">
          Evening rush hour on Coldharbour Lane and Brixton Road lifts NO₂ to 68–74µg/m³ between 17:30–20:00. Closing at 19:05 locks in the clean air you've built up all afternoon before the pollution peak arrives.
        </p>
      </div>
    </div>
  )
}

// ─── Tile components ──────────────────────────────────────────────────────────

function Tile({ children, className = '', style = {}, onClick }) {
  return (
    <div
      className={`bg-[#fafafa] rounded-[25px] px-[15px] py-[12px] ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

function TileTitle({ children }) {
  return (
    <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[18px] leading-snug mb-0 text-center w-full">
      {children}
    </p>
  )
}

function TapHint() {
  return (
    <div className="flex justify-center mt-auto pt-[4px]">
      <span className="font-['DM_Sans',sans-serif] text-[10px] text-[#b0bec5] tracking-wide">tap for detail</span>
    </div>
  )
}

function AirQualityTile({ onTap }) {
  const { score, bars, barColors } = DUMMY.airQuality
  return (
    <Tile className="flex flex-col gap-[10px] h-[185px] w-full" onClick={onTap}>
      <TileTitle>Air quality</TileTitle>
      <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[24px] leading-snug">
        {score}%
      </p>
      <div className="flex items-end gap-[4px] h-[46px]">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-full" style={{ height: h, background: barColors[i] }} />
        ))}
      </div>
      <div className="flex justify-between text-[12px] font-['DM_Sans',sans-serif]">
        <span className="text-[#ff610a]">Now</span>
        <span className="text-[#263238]">+48hrs</span>
      </div>
    </Tile>
  )
}

function PollenTile() {
  const { tree, grass } = DUMMY.pollen
  return (
    <Tile className="flex flex-col gap-[17px] h-[185px] w-full">
      <TileTitle>Pollen</TileTitle>
      <div className="flex flex-col items-center gap-[3px]">
        <span className="font-['DM_Sans',sans-serif] font-normal text-[#fafafa] text-[16px] px-[12px] py-[2px] rounded-[16px]" style={{ background: tree.color }}>{tree.level}</span>
        <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center">Tree pollen</span>
      </div>
      <div className="flex flex-col items-center gap-[3px]">
        <span className="font-['DM_Sans',sans-serif] font-normal text-[#fafafa] text-[16px] px-[12px] py-[2px] rounded-[16px]" style={{ background: grass.color }}>{grass.level}</span>
        <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center">Grass pollen</span>
      </div>
    </Tile>
  )
}

function CleanestTimeTile({ onTap }) {
  return (
    <Tile className="flex flex-col gap-[8px] h-[185px] w-full" onClick={onTap}>
      <TileTitle>Cleanest time</TileTitle>
      <div className="flex flex-col items-center gap-[4px] flex-1 justify-center">
        <RunIcon size={48} />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#1e88e5] text-[24px] leading-snug text-center">
          {DUMMY.cleanestTime}
        </p>
      </div>
      <TapHint />
    </Tile>
  )
}

function WindowsTile({ onTap }) {
  return (
    <Tile className="flex flex-col gap-[7px] h-[185px] w-full" onClick={onTap}>
      <TileTitle>Windows</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[10px]">
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center">Ventilate with clean air</p>
        <div className="flex items-baseline justify-center gap-[4px]">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[14px]">OPEN</span>
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#1e88e5] text-[24px]">{DUMMY.windows.open}</span>
        </div>
        <div className="flex items-baseline justify-center gap-[4px]">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[14px]">CLOSE</span>
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#1e88e5] text-[24px]">{DUMMY.windows.close}</span>
        </div>
      </div>
      <TapHint />
    </Tile>
  )
}

function TrackedAirTile() {
  const { outdoor, indoor, insight } = DUMMY.tracked
  return (
    <div className="bg-[#fafafa] rounded-[25px] px-[20px] pb-[15px] pt-[17px] flex flex-col gap-[22px] w-full">
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-[10px]">
          <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[18px]">Outdoor</p>
          <div className="relative">
            <ScoreRing score={outdoor.score} label={outdoor.label} color={outdoor.color} />
            <img src={ASSETS.trendingIcon} alt="" className="absolute top-[6px] left-[50%] -translate-x-[130%] w-[18px] h-[18px] object-contain" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-[10px]">
          <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[18px]">Indoor</p>
          <ScoreRing score={indoor.score} label={indoor.label} color={indoor.color} />
        </div>
      </div>
      <p className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[#263238] text-center leading-snug">{insight}</p>
    </div>
  )
}

function CleanRoutesTile() {
  return (
    <Tile className="flex flex-col gap-[8px] h-[185px] w-full">
      <TileTitle>Clean routes</TileTitle>
      <div className="flex flex-col gap-[10px] flex-1 justify-center">
        {DUMMY.cleanRoutes.map((route) => (
          <div key={route.name} className="flex items-center justify-between">
            <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[14px]">{route.name}</span>
            <span className="font-['DM_Sans',sans-serif] font-normal text-[#fafafa] text-[14px] bg-[#1e88e5] px-[12px] py-[2px] rounded-[16px]">{route.improvement}</span>
          </div>
        ))}
      </div>
    </Tile>
  )
}

function RouteSearchTile() {
  return (
    <div className="rounded-[25px] px-[15px] py-[12px] flex flex-col gap-[12px] h-[185px] w-full" style={{ background: 'linear-gradient(180deg, #648cd2 0%, #dfecf9 100%)' }}>
      <p className="font-['DM_Sans',sans-serif] font-bold text-[#fafafa] text-[18px] text-center">Route search</p>
      <div className="flex flex-col items-center gap-[20px] flex-1 justify-center">
        <img src={ASSETS.routeIcon} alt="Route" className="w-[89px] h-[69px] object-contain" />
        <div className="bg-white rounded-[11px] w-full py-[6px] px-[13px] flex items-center justify-between">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px]">Find a clean route</span>
          <span className="font-['DM_Sans',sans-serif] text-[#263238] text-[18px] leading-none">›</span>
        </div>
      </div>
    </div>
  )
}

function HealthTile() {
  return (
    <Tile className="flex flex-col gap-[10px] h-[185px] w-full">
      <TileTitle>Health</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[10px]">
        <HeartIcon size={36} color="#263238" />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center leading-snug">{DUMMY.health}</p>
      </div>
    </Tile>
  )
}

function PerformanceTile() {
  return (
    <Tile className="flex flex-col gap-[10px] h-[185px] w-full">
      <TileTitle>Performance</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[8px]">
        <RunIcon size={44} />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center leading-snug">{DUMMY.performance}</p>
      </div>
    </Tile>
  )
}

function LeaderboardTile() {
  return (
    <Tile className="flex flex-col h-[185px] w-full">
      <TileTitle>Leaderboard</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[4px]">
        <div className="bg-[#dfecf9] rounded-[23px] w-[93px] py-[8px] flex items-center justify-center">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[36px] leading-tight">{DUMMY.leaderboard.rank}</span>
        </div>
        <img src={ASSETS.trendingIcon} alt="" className="w-[24px] h-[18px] object-contain" />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center leading-snug">{DUMMY.leaderboard.change}</p>
      </div>
    </Tile>
  )
}

function AirMonitorTile() {
  return (
    <div className="rounded-[25px] px-[15px] py-[12px] flex flex-col gap-[12px] h-[185px] w-full" style={{ background: 'linear-gradient(180deg, #ff610a 0%, #ff8b00 100%)' }}>
      <p className="font-['DM_Sans',sans-serif] font-bold text-[#fafafa] text-[18px] text-center">Air monitor</p>
      <div className="flex flex-col items-center gap-[20px] flex-1 justify-center">
        <img src={ASSETS.monitorIcon} alt="Monitor" className="w-[57px] h-[69px] object-contain" />
        <div className="bg-white rounded-[11px] w-full py-[6px] px-[13px] flex items-center justify-between">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px]">Add air monitor</span>
          <span className="font-['DM_Sans',sans-serif] text-[#263238] text-[18px] leading-none">›</span>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNavNew({ activeTab = 'home', onTabChange }) {
  const tabs = [
    { id: 'home', label: 'HOME', Icon: HomeNavIcon },
    { id: 'analytics', label: 'ANALYTICS', Icon: AnalyticsNavIcon },
    { id: 'groups', label: 'GROUPS', Icon: GroupsNavIcon },
    { id: 'settings', label: 'SETTINGS', Icon: SettingsNavIcon },
  ]
  return (
    <div className="bg-[#fafafa] rounded-tl-[32px] rounded-tr-[32px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.15)] h-[72px] flex items-center justify-around px-2 overflow-hidden">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = id === activeTab
        return (
          <button key={id} onClick={() => onTabChange?.(id)} className="flex flex-col items-center gap-[2px] pt-[8px] flex-1 h-full">
            <Icon active={isActive} />
            <span className="font-['DM_Sans',sans-serif] font-normal text-[11px] tracking-wide" style={{ color: isActive ? '#ff610a' : '#263238' }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function NewHomeDashboard({ activeNavTab = 'home', onNavTabChange }) {
  const [activeDetail, setActiveDetail] = useState(null) // 'airQuality' | 'cleanestTime' | 'windows'

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between px-[27px] pt-[18px] pb-[10px] shrink-0">
        <img src={ASSETS.airtrackLogo} alt="Airtrack" className="w-[36px] h-[33px] object-contain" />
        <div className="flex items-center gap-[4px]">
          <LocationIcon />
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#607d8b] text-[14px]">{DUMMY.location}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-[12px] pt-[15px]">
        <div className="bg-white rounded-[28px] shadow-[0px_-4px_5.45px_0px_rgba(0,0,0,0.06)] px-[10px] pt-[20px] pb-[12px]">

          <h2 className="font-['DM_Sans',sans-serif] font-extralight text-black text-[32px] leading-snug px-[5px] mb-[10px]">
            Today's air
          </h2>

          <div className="grid grid-cols-2 gap-[6px] mb-[6px]">
            <AirQualityTile onTap={() => setActiveDetail('airQuality')} />
            <PollenTile />
            <CleanestTimeTile onTap={() => setActiveDetail('cleanestTime')} />
            <WindowsTile onTap={() => setActiveDetail('windows')} />
          </div>

          <h2 className="font-['DM_Sans',sans-serif] font-extralight text-[#263238] text-[32px] leading-snug px-[5px] mt-[10px] mb-[10px]">
            Tracked air
          </h2>

          <div className="mb-[6px]">
            <TrackedAirTile />
          </div>

          <div className="grid grid-cols-2 gap-[6px]">
            <CleanRoutesTile />
            <RouteSearchTile />
            <HealthTile />
            <PerformanceTile />
            <LeaderboardTile />
            <AirMonitorTile />
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 px-[12px]">
        <BottomNavNew activeTab={activeNavTab} onTabChange={onNavTabChange} />
      </div>

      {/* Detail sheets */}
      <DetailSheet open={activeDetail === 'airQuality'} onClose={() => setActiveDetail(null)}>
        <AirQualityDetail />
      </DetailSheet>
      <DetailSheet open={activeDetail === 'cleanestTime'} onClose={() => setActiveDetail(null)}>
        <CleanestTimeDetail />
      </DetailSheet>
      <DetailSheet open={activeDetail === 'windows'} onClose={() => setActiveDetail(null)}>
        <WindowsDetail />
      </DetailSheet>
    </div>
  )
}
