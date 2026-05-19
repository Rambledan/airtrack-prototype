import { useState } from 'react'

// ─── Pollution data per waypoint ───────────────────────────────────────────
const LEVEL_CONFIG = {
  LOW:       { bg: '#5CB85C', text: '#fff',    label: 'LOW' },
  MEDIUM:    { bg: '#F5C518', text: '#5a3e00', label: 'MEDIUM' },
  HIGH:      { bg: '#FB923C', text: '#7c2d12', label: 'HIGH' },
  VERY_HIGH: { bg: '#F87171', text: '#7f1d1d', label: 'VERY HIGH' },
}

const WAYPOINTS = [
  {
    id: 'blackheath',
    label: 'Start',
    sublabel: 'Blackheath',
    mile: 0,
    x: 365, y: 55,
    pollution: {
      no2:  { level: 'LOW',    value: '8μg/m³ NO₂' },
      pm25: { level: 'LOW',    value: '6μg/m³ PM2.5' },
      o3:   { level: 'LOW',    value: '42μg/m³ O₃' },
    },
  },
  {
    id: 'greenwich',
    label: 'Mile 3',
    sublabel: 'Greenwich',
    mile: 3,
    x: 328, y: 92,
    pollution: {
      no2:  { level: 'LOW',    value: '11μg/m³ NO₂' },
      pm25: { level: 'LOW',    value: '9μg/m³ PM2.5' },
      o3:   { level: 'MEDIUM', value: '54μg/m³ O₃' },
    },
  },
  {
    id: 'bermondsey',
    label: 'Mile 9',
    sublabel: 'Bermondsey',
    mile: 9,
    x: 282, y: 140,
    pollution: {
      no2:  { level: 'MEDIUM', value: '19μg/m³ NO₂' },
      pm25: { level: 'MEDIUM', value: '14μg/m³ PM2.5' },
      o3:   { level: 'MEDIUM', value: '61μg/m³ O₃' },
    },
  },
  {
    id: 'tower-bridge',
    label: 'Mile 13',
    sublabel: 'Tower Bridge',
    mile: 13,
    x: 248, y: 153,
    pollution: {
      no2:  { level: 'MEDIUM', value: '22μg/m³ NO₂' },
      pm25: { level: 'MEDIUM', value: '16μg/m³ PM2.5' },
      o3:   { level: 'LOW',    value: '45μg/m³ O₃' },
    },
  },
  {
    id: 'canary-wharf',
    label: 'Mile 17',
    sublabel: 'Canary Wharf',
    mile: 17,
    x: 298, y: 208,
    pollution: {
      no2:  { level: 'LOW',    value: '13μg/m³ NO₂' },
      pm25: { level: 'MEDIUM', value: '15μg/m³ PM2.5' },
      o3:   { level: 'MEDIUM', value: '58μg/m³ O₃' },
    },
  },
  {
    id: 'embankment',
    label: 'Mile 21',
    sublabel: 'Embankment',
    mile: 21,
    x: 165, y: 147,
    pollution: {
      no2:  { level: 'HIGH',   value: '34μg/m³ NO₂' },
      pm25: { level: 'MEDIUM', value: '18μg/m³ PM2.5' },
      o3:   { level: 'LOW',    value: '41μg/m³ O₃' },
    },
  },
  {
    id: 'westminster',
    label: 'Mile 24',
    sublabel: 'Westminster',
    mile: 24,
    x: 100, y: 148,
    pollution: {
      no2:  { level: 'HIGH',   value: '38μg/m³ NO₂' },
      pm25: { level: 'HIGH',   value: '24μg/m³ PM2.5' },
      o3:   { level: 'LOW',    value: '39μg/m³ O₃' },
    },
  },
  {
    id: 'the-mall',
    label: 'Finish',
    sublabel: 'The Mall',
    mile: 26.2,
    x: 58, y: 133,
    pollution: {
      no2:  { level: 'MEDIUM', value: '21μg/m³ NO₂' },
      pm25: { level: 'MEDIUM', value: '15μg/m³ PM2.5' },
      o3:   { level: 'LOW',    value: '44μg/m³ O₃' },
    },
  },
]

// Smooth SVG path connecting all waypoints (includes the Canary Wharf loop)
// The route: Start → Greenwich → Bermondsey → Tower Bridge → Canary Wharf loop → Embankment → Westminster → Finish
const ROUTE_PATH = `
  M 365,55
  C 352,68 342,80 328,92
  C 315,108 298,126 282,140
  C 268,147 255,151 248,153
  C 258,162 278,183 298,208
  C 310,226 300,238 283,234
  C 268,230 262,212 248,168
  C 232,159 200,153 165,147
  C 143,142 120,144 100,148
  C 84,148 68,138 58,133
`

// Colour the waypoint dot by the worst pollution level present
function worstLevel(pollution) {
  const order = ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW']
  const levels = Object.values(pollution).map(p => p.level)
  return order.find(l => levels.includes(l)) || 'LOW'
}

// ─── Icons ──────────────────────────────────────────────────────────────────
function CarIcon() {
  return (
    <svg viewBox="0 0 40 30" fill="currentColor" className="w-8 h-6">
      <path d="M6 20 Q2 20 2 16 L2 12 L5 6 Q6 4 9 4 L28 4 Q31 4 32 6 L36 12 L38 16 Q38 20 34 20 L6 20Z"/>
      <circle cx="10" cy="22" r="4" fill="currentColor" opacity="0.9"/>
      <circle cx="30" cy="22" r="4" fill="currentColor" opacity="0.9"/>
      {/* exhaust */}
      <circle cx="2" cy="14" r="1.5" fill="currentColor" opacity="0.7"/>
      <circle cx="-1" cy="11" r="1.2" fill="currentColor" opacity="0.5"/>
      <circle cx="-3" cy="8" r="1" fill="currentColor" opacity="0.3"/>
    </svg>
  )
}

function DotsIcon() {
  const dots = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      dots.push(<circle key={`${row}-${col}`} cx={6 + col * 9} cy={6 + row * 9} r="3" fill="currentColor" />)
    }
  }
  return <svg viewBox="0 0 40 40" className="w-7 h-7">{dots}</svg>
}

function SunIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className="w-8 h-8">
      <circle cx="20" cy="20" r="7"/>
      {[0,45,90,135,180,225,270,315].map(angle => {
        const rad = (angle * Math.PI) / 180
        const x1 = 20 + Math.cos(rad) * 11
        const y1 = 20 + Math.sin(rad) * 11
        const x2 = 20 + Math.cos(rad) * 18
        const y2 = 20 + Math.sin(rad) * 18
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      })}
    </svg>
  )
}

// ─── Pollution card ──────────────────────────────────────────────────────────
function PollutantCard({ type, data, index }) {
  const cfg = LEVEL_CONFIG[data.level]
  const typeConfig = {
    no2:  { name: 'TOXIC FUMES', Icon: CarIcon },
    pm25: { name: 'PARTICULATES', Icon: DotsIcon },
    o3:   { name: 'OZONE', Icon: SunIcon },
  }[type]

  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-5 py-4 animate-fade-in-up"
      style={{ backgroundColor: cfg.bg, animationDelay: `${index * 80}ms` }}
    >
      <div style={{ color: cfg.text }} className="shrink-0">
        <typeConfig.Icon />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: cfg.text, opacity: 0.85 }}>
          {typeConfig.name}
        </p>
        <p className="text-2xl font-black leading-none tracking-tight" style={{ color: cfg.text }}>
          {cfg.label}
        </p>
        <p className="text-xs mt-1 font-medium" style={{ color: cfg.text, opacity: 0.75 }}>
          {data.value}
        </p>
      </div>
    </div>
  )
}

// ─── Marathon route map ──────────────────────────────────────────────────────
function MarathonMap({ selectedId, onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#e8eff7]" style={{ aspectRatio: '430/270' }}>
      {/* Thames river */}
      <svg
        viewBox="0 0 430 270"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Background: streets / city blocks suggestion */}
        <rect width="430" height="270" fill="#e8eff7"/>

        {/* City blocks - subtle */}
        {[
          [30,25,60,35],[100,20,50,30],[165,18,70,28],[240,22,55,30],[310,15,65,30],
          [30,75,45,30],[85,70,55,25],[210,65,60,25],[285,60,55,28],[345,58,60,28],
          [30,175,55,30],[95,178,50,28],[175,175,60,28],[240,172,55,28],
          [30,215,60,28],[110,218,55,25],[175,215,60,25],[245,212,50,25],[310,220,55,25],
        ].map(([x,y,w,h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#d4dde8" opacity="0.6"/>
        ))}

        {/* Thames river */}
        <path
          d="M 0,162 C 40,158 80,160 130,160 C 170,160 200,158 240,162 C 270,165 305,175 340,168 C 370,162 400,162 430,162"
          fill="none" stroke="#93c5e8" strokeWidth="14" strokeLinecap="round" opacity="0.7"
        />
        {/* Thames fill */}
        <path
          d="M 0,156 C 40,153 80,154 130,154 C 170,154 200,153 240,156 C 270,159 305,168 340,162 C 370,156 400,157 430,156 L 430,270 L 0,270Z"
          fill="#b8d8ee" opacity="0.35"
        />
        {/* THAMES label */}
        <text x="70" y="175" fill="#7aa8c5" fontSize="8" fontFamily="Arial" fontWeight="600" letterSpacing="2" opacity="0.8">T H A M E S</text>

        {/* Route line */}
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="#FF610A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Route direction arrows (subtle) */}
        <path d={ROUTE_PATH} fill="none" stroke="#FF610A" strokeWidth="1.5" strokeDasharray="3,12" strokeLinecap="round" opacity="0.4"/>

        {/* Start flag */}
        <text x="368" y="48" fill="#FF610A" fontSize="13">🏁</text>
        {/* Finish flag */}
        <text x="38" y="126" fill="#FF610A" fontSize="13">🏆</text>

        {/* Waypoint dots */}
        {WAYPOINTS.map(wp => {
          const level = worstLevel(wp.pollution)
          const cfg = LEVEL_CONFIG[level]
          const isSelected = wp.id === selectedId
          const isHovered = wp.id === hovered
          const r = isSelected ? 10 : (isHovered ? 8 : 6)
          return (
            <g
              key={wp.id}
              onClick={() => onSelect(wp.id)}
              onMouseEnter={() => setHovered(wp.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {isSelected && (
                <circle cx={wp.x} cy={wp.y} r={16} fill={cfg.bg} opacity="0.25"/>
              )}
              <circle
                cx={wp.x}
                cy={wp.y}
                r={r}
                fill={cfg.bg}
                stroke={isSelected ? '#1a1a1a' : '#fff'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {isSelected && (
                <circle cx={wp.x} cy={wp.y} r={3} fill="#1a1a1a"/>
              )}
            </g>
          )
        })}
      </svg>

      {/* Map credit */}
      <div className="absolute bottom-2 right-3 text-[9px] text-slate-400 font-medium">
        Indicative route map
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function LondonMarathonPage() {
  const [selectedId, setSelectedId] = useState('blackheath')
  const selected = WAYPOINTS.find(w => w.id === selectedId)

  // Scroll waypoint pill into view when selected
  const handleSelect = (id) => {
    setSelectedId(id)
    setTimeout(() => {
      document.getElementById(`pill-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 50)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f0' }}>

      {/* ── Header ── */}
      <header style={{ background: '#1a1a1a' }} className="px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          {/* TCS London Marathon logo (text-based since SVG is image) */}
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline gap-1.5">
              <span className="text-white font-black text-xl tracking-tighter" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>tcs</span>
              <span className="text-white/60 text-xs font-light tracking-wide">×</span>
              <span style={{ color: '#FF610A' }} className="font-black text-xl tracking-tighter" style={{ fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF610A' }}>AIR</span>
              <span style={{ color: '#FF610A' }} className="font-black text-xl tracking-tighter" style={{ fontFamily: 'Arial Black, Arial, sans-serif', color: '#FF610A' }}>TRACK</span>
            </div>
            <span className="text-white/50 text-[9px] font-medium tracking-[0.15em] uppercase mt-0.5">London Marathon 2026 · Race Day</span>
          </div>

          {/* AirTrack logo */}
          <img
            src="/airtrack-logo-orange.svg"
            alt="AirTrack"
            className="h-7 w-auto shrink-0"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
      </header>

      {/* ── Hero banner ── */}
      <div style={{ background: '#1a1a1a' }} className="px-4 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white font-black text-3xl leading-tight tracking-tight" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
            RACE DAY<br />
            <span style={{ color: '#FF610A' }}>AIR QUALITY</span>
          </h1>
          <p className="text-white/60 text-sm mt-1.5 font-medium">
            Sunday 27 April 2026 · London
          </p>

          {/* Live badge */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0"/>
            <span className="text-white/90 text-xs font-semibold tracking-wide">Live forecast data</span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-5 pb-10 space-y-5">

        {/* Map */}
        <section>
          <MarathonMap selectedId={selectedId} onSelect={handleSelect} />
        </section>

        {/* Route selector pills */}
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2.5 px-1">
            Select a point on the route
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {WAYPOINTS.map(wp => {
              const level = worstLevel(wp.pollution)
              const cfg = LEVEL_CONFIG[level]
              const isSelected = wp.id === selectedId
              return (
                <button
                  key={wp.id}
                  id={`pill-${wp.id}`}
                  onClick={() => handleSelect(wp.id)}
                  className="shrink-0 snap-start flex flex-col items-center rounded-2xl px-4 py-3 transition-all duration-200 min-w-[88px]"
                  style={{
                    background: isSelected ? '#1a1a1a' : '#fff',
                    boxShadow: isSelected ? '0 2px 12px rgba(0,0,0,0.18)' : '0 1px 4px rgba(0,0,0,0.08)',
                    border: `2px solid ${isSelected ? '#1a1a1a' : '#e5e7eb'}`,
                  }}
                >
                  {/* level dot */}
                  <span
                    className="w-3 h-3 rounded-full mb-1.5 shrink-0"
                    style={{ background: cfg.bg }}
                  />
                  <span
                    className="text-[11px] font-bold leading-tight text-center"
                    style={{ color: isSelected ? '#fff' : '#1a1a1a' }}
                  >
                    {wp.label}
                  </span>
                  <span
                    className="text-[9px] font-medium text-center leading-tight mt-0.5"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : '#9ca3af' }}
                  >
                    {wp.sublabel}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Air quality readout */}
        <section>
          <div className="flex items-baseline justify-between mb-3 px-1">
            <h2 className="text-base font-black tracking-tight" style={{ color: '#1a1a1a', fontFamily: 'Arial Black, Arial, sans-serif' }}>
              {selected.sublabel.toUpperCase()}
            </h2>
            <span className="text-xs text-slate-400 font-medium">Mile {selected.mile}</span>
          </div>

          <div className="space-y-2.5">
            <PollutantCard key={`no2-${selectedId}`}  type="no2"  data={selected.pollution.no2}  index={0} />
            <PollutantCard key={`pm25-${selectedId}`} type="pm25" data={selected.pollution.pm25} index={1} />
            <PollutantCard key={`o3-${selectedId}`}   type="o3"   data={selected.pollution.o3}   index={2} />
          </div>

          {/* Health tip */}
          {['HIGH','VERY_HIGH'].some(l => Object.values(selected.pollution).some(p => p.level === l)) && (
            <div className="mt-3 flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Higher pollution levels at this point. Runners with asthma or respiratory conditions may consider wearing a mask through this section.
              </p>
            </div>
          )}
        </section>

        {/* Overall summary bar */}
        <section className="rounded-2xl overflow-hidden" style={{ background: '#1a1a1a' }}>
          <div className="px-5 py-4">
            <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-2">Overall route air quality</p>
            <div className="flex gap-2">
              {WAYPOINTS.map(wp => {
                const level = worstLevel(wp.pollution)
                const cfg = LEVEL_CONFIG[level]
                return (
                  <button
                    key={wp.id}
                    onClick={() => handleSelect(wp.id)}
                    className="flex-1 h-6 rounded-full transition-all"
                    style={{
                      background: cfg.bg,
                      opacity: wp.id === selectedId ? 1 : 0.65,
                      transform: wp.id === selectedId ? 'scaleY(1.3)' : 'scaleY(1)',
                      outline: wp.id === selectedId ? `2px solid #fff` : 'none',
                      outlineOffset: '1px',
                    }}
                    aria-label={wp.sublabel}
                  />
                )
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-white/40 text-[9px] font-medium">Start</span>
              <span className="text-white/40 text-[9px] font-medium">Finish</span>
            </div>
          </div>
        </section>

        {/* AirTrack branding footer */}
        <footer className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Air quality data provided by{' '}
            <span style={{ color: '#FF610A' }} className="font-bold">AirTrack</span>
            {' '}· Updated hourly
          </p>
          <p className="text-[10px] text-slate-300 mt-1">
            Data is indicative. Always follow official race guidance.
          </p>
        </footer>

      </main>
    </div>
  )
}
