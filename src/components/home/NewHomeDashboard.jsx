const ASSETS = {
  airtrackLogo: '/airtrack-logo-orange.svg',
  trendingIcon: '/noun-trending-8169830.png',
  routeIcon: '/noun-route-41620.png',
  monitorIcon: '/noun-oxygen-sensor-8080122.png',
  // Remaining icons kept as inline SVG below (locationIcon, runIcon, heartIcon, nav icons)
}

// Dummy data — all editable for prototype demos
const DUMMY = {
  location: 'Brixton',
  airQuality: {
    score: 76,
    bars: [31, 36, 39, 42, 42, 42, 36, 22], // relative heights in px
    barColors: ['#a17880', '#a078a1', '#8778a1', '#5579ff', '#5579ff', '#5579ff', '#8778a1', '#c74375'],
  },
  pollen: {
    tree: { level: 'HIGH', color: '#f94138' },
    grass: { level: 'MED', color: '#8a38f5' },
  },
  cleanestTime: '11:05',
  windows: {
    open: '11:05',
    close: '19:05',
  },
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

// Circular score ring using SVG
function ScoreRing({ score, label, color, size = 92 }) {
  const r = 38
  const cx = size / 2
  const circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e8f0fe" strokeWidth="6" />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: -4 }}>
        <span className="font-['DM_Sans',sans-serif] font-normal leading-tight" style={{ color, fontSize: 22 }}>{score}%</span>
        <span className="font-['DM_Sans',sans-serif] font-normal" style={{ color, fontSize: 11 }}>{label}</span>
      </div>
    </div>
  )
}

// Tile wrapper
function Tile({ children, className = '', style = {} }) {
  return (
    <div
      className={`bg-[#fafafa] rounded-[25px] px-[15px] py-[12px] ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function TileTitle({ children }) {
  return (
    <p className="font-['DM_Sans',sans-serif] font-bold text-[#263238] text-[18px] leading-snug mb-0">
      {children}
    </p>
  )
}

// Air Quality tile
function AirQualityTile() {
  const { score, bars, barColors } = DUMMY.airQuality
  const maxH = 46
  return (
    <Tile className="flex flex-col gap-[10px] h-[185px] w-full">
      <TileTitle>Air quality</TileTitle>
      <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[24px] leading-snug">
        {score}%
      </p>
      <div className="flex items-end gap-[4px] h-[46px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-full"
            style={{ height: h, background: barColors[i] }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[12px] font-['DM_Sans',sans-serif]">
        <span className="text-[#ff610a]">Now</span>
        <span className="text-[#263238]">+48hrs</span>
      </div>
    </Tile>
  )
}

// Pollen tile
function PollenTile() {
  const { tree, grass } = DUMMY.pollen
  return (
    <Tile className="flex flex-col gap-[17px] h-[185px] w-full">
      <TileTitle>Pollen</TileTitle>
      <div className="flex flex-col items-center gap-[3px]">
        <span
          className="font-['DM_Sans',sans-serif] font-normal text-[#fafafa] text-[16px] px-[12px] py-[2px] rounded-[16px]"
          style={{ background: tree.color }}
        >
          {tree.level}
        </span>
        <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center">Tree pollen</span>
      </div>
      <div className="flex flex-col items-center gap-[3px]">
        <span
          className="font-['DM_Sans',sans-serif] font-normal text-[#fafafa] text-[16px] px-[12px] py-[2px] rounded-[16px]"
          style={{ background: grass.color }}
        >
          {grass.level}
        </span>
        <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center">Grass pollen</span>
      </div>
    </Tile>
  )
}

// Inline SVG icons
function RunIcon({ size = 48, color = '#263238' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="8" r="4" fill={color}/>
      <path d="M20 16l4 4 6-4 4 8h-6l-2 10-6-4-4 8H8l6-10 4 2 2-6-6-4 6-4z" fill={color}/>
    </svg>
  )
}

function HeartIcon({ size = 36, color = '#263238' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function LocationIcon({ size = 18, color = '#607d8b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

// Nav icons
function HomeNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function AnalyticsNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}
function GroupsNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function SettingsNavIcon({ active }) {
  const c = active ? '#ff610a' : '#263238'
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

// Cleanest time tile
function CleanestTimeTile() {
  return (
    <Tile className="flex flex-col gap-[19px] h-[185px] w-full">
      <TileTitle>Cleanest time</TileTitle>
      <div className="flex flex-col items-center gap-[4px] flex-1 justify-center">
        <RunIcon size={52} color="#263238" />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#1e88e5] text-[24px] leading-snug text-center">
          {DUMMY.cleanestTime}
        </p>
      </div>
    </Tile>
  )
}

// Windows tile
function WindowsTile() {
  return (
    <Tile className="flex flex-col gap-[7px] h-[185px] w-full">
      <TileTitle>Windows</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[12px]">
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center">
          Ventilate with clean air
        </p>
        <div className="flex items-baseline justify-center gap-[4px]">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[14px]">OPEN</span>
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#1e88e5] text-[24px]">{DUMMY.windows.open}</span>
        </div>
        <div className="flex items-baseline justify-center gap-[4px]">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[14px]">CLOSE</span>
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#1e88e5] text-[24px]">{DUMMY.windows.close}</span>
        </div>
      </div>
    </Tile>
  )
}

// Tracked air score tile
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
      <p className="font-['DM_Sans',sans-serif] font-normal text-[14px] text-[#263238] text-center leading-snug">
        {insight}
      </p>
    </div>
  )
}

// Clean routes tile
function CleanRoutesTile() {
  return (
    <Tile className="flex flex-col gap-[8px] h-[185px] w-full">
      <TileTitle>Clean routes</TileTitle>
      <div className="flex flex-col gap-[10px] flex-1 justify-center">
        {DUMMY.cleanRoutes.map((route) => (
          <div key={route.name} className="flex items-center justify-between">
            <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[14px]">{route.name}</span>
            <span className="font-['DM_Sans',sans-serif] font-normal text-[#fafafa] text-[14px] bg-[#1e88e5] px-[12px] py-[2px] rounded-[16px]">
              {route.improvement}
            </span>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// Route search tile
function RouteSearchTile() {
  return (
    <div
      className="rounded-[25px] px-[15px] py-[12px] flex flex-col gap-[12px] h-[185px] w-full"
      style={{ background: 'linear-gradient(180deg, #648cd2 0%, #dfecf9 100%)' }}
    >
      <p className="font-['DM_Sans',sans-serif] font-bold text-[#fafafa] text-[18px]">Route search</p>
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

// Health tile
function HealthTile() {
  return (
    <Tile className="flex flex-col gap-[10px] h-[185px] w-full">
      <TileTitle>Health</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[10px]">
        <HeartIcon size={36} color="#263238" />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center leading-snug">
          {DUMMY.health}
        </p>
      </div>
    </Tile>
  )
}

// Performance tile
function PerformanceTile() {
  return (
    <Tile className="flex flex-col gap-[10px] h-[185px] w-full">
      <TileTitle>Performance</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[8px]">
        <RunIcon size={44} color="#263238" />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center leading-snug">
          {DUMMY.performance}
        </p>
      </div>
    </Tile>
  )
}

// Leaderboard tile
function LeaderboardTile() {
  return (
    <Tile className="flex flex-col h-[185px] w-full">
      <TileTitle>Leaderboard</TileTitle>
      <div className="flex flex-col items-center justify-center flex-1 gap-[4px]">
        <div className="bg-[#dfecf9] rounded-[23px] w-[93px] py-[8px] flex items-center justify-center">
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[36px] leading-tight">
            {DUMMY.leaderboard.rank}
          </span>
        </div>
        <img src={ASSETS.trendingIcon} alt="" className="w-[24px] h-[18px] object-contain" />
        <p className="font-['DM_Sans',sans-serif] font-normal text-[#263238] text-[12px] text-center leading-snug">
          {DUMMY.leaderboard.change}
        </p>
      </div>
    </Tile>
  )
}

// Air monitor CTA tile
function AirMonitorTile() {
  return (
    <div
      className="rounded-[25px] px-[15px] py-[12px] flex flex-col gap-[12px] h-[185px] w-full"
      style={{ background: 'linear-gradient(180deg, #ff610a 0%, #ff8b00 100%)' }}
    >
      <p className="font-['DM_Sans',sans-serif] font-bold text-[#fafafa] text-[18px]">Air monitor</p>
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

// Bottom nav
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
          <button
            key={id}
            onClick={() => onTabChange?.(id)}
            className="flex flex-col items-center gap-[2px] pt-[8px] flex-1 h-full"
          >
            <Icon active={isActive} />
            <span
              className="font-['DM_Sans',sans-serif] font-normal text-[11px] tracking-wide"
              style={{ color: isActive ? '#ff610a' : '#263238' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function NewHomeDashboard({ activeNavTab = 'home', onNavTabChange }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-[27px] pt-[18px] pb-[10px] shrink-0">
        <img src={ASSETS.airtrackLogo} alt="Airtrack" className="w-[36px] h-[33px] object-contain" />
        <div className="flex items-center gap-[4px]">
          <LocationIcon />
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#607d8b] text-[14px]">
            {DUMMY.location}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-[12px] pt-[15px]">
        <div className="bg-white rounded-[28px] shadow-[0px_-4px_5.45px_0px_rgba(0,0,0,0.06)] px-[10px] pt-[20px] pb-[12px]">

          {/* Today's air */}
          <h2 className="font-['DM_Sans',sans-serif] font-extralight text-black text-[32px] leading-snug px-[5px] mb-[10px]">
            Today's air
          </h2>

          <div className="grid grid-cols-2 gap-[6px] mb-[6px]">
            <AirQualityTile />
            <PollenTile />
            <CleanestTimeTile />
            <WindowsTile />
          </div>

          {/* Tracked air */}
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
    </div>
  )
}
