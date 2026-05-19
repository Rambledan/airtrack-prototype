// Asset URLs from Figma design (valid for 7 days)
const ASSETS = {
  airtrackLogo: 'https://www.figma.com/api/mcp/asset/17a45a62-3649-46fd-b10a-70d41b2bcfeb',
  locationIcon: 'https://www.figma.com/api/mcp/asset/c5ed90b6-8eee-46e7-9621-c81813e3dfcd',
  runIcon: 'https://www.figma.com/api/mcp/asset/5e4369de-651b-4197-bb8b-2b40a9b6552a',
  trendingIcon: 'https://www.figma.com/api/mcp/asset/4bfeca18-f973-47a8-8353-5b7da08b166c',
  routeIcon: 'https://www.figma.com/api/mcp/asset/8224c8c3-9d68-43a3-9292-6daa40906761',
  heartIcon: 'https://www.figma.com/api/mcp/asset/6d33036f-4442-4c78-bf78-7771ef397ddb',
  monitorIcon: 'https://www.figma.com/api/mcp/asset/e3c71215-f2fb-4478-8ff4-5e54d0ee0715',
  homeNavIcon: 'https://www.figma.com/api/mcp/asset/3bea4dec-1872-435d-b194-d6907e384ab3',
  analyticsNavIcon: 'https://www.figma.com/api/mcp/asset/9181584a-4b2b-4a73-9770-8151a805c340',
  groupsNavIcon: 'https://www.figma.com/api/mcp/asset/6884af51-68a1-4076-a2eb-5ee1ddf8a5c7',
  settingsNavIcon: 'https://www.figma.com/api/mcp/asset/102471cd-9f34-4ede-a0ac-8dceccede3b5',
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

// Cleanest time tile
function CleanestTimeTile() {
  return (
    <Tile className="flex flex-col gap-[19px] h-[185px] w-full">
      <TileTitle>Cleanest time</TileTitle>
      <div className="flex flex-col items-center gap-[4px] flex-1 justify-center">
        <img src={ASSETS.runIcon} alt="Run" className="w-[52px] h-[52px] object-contain" />
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
        <img src={ASSETS.heartIcon} alt="Health" className="w-[37px] h-[32px] object-contain" />
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
        <img src={ASSETS.runIcon} alt="Run" className="w-[40px] h-[40px] object-contain" />
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
    { id: 'home', label: 'HOME', icon: ASSETS.homeNavIcon },
    { id: 'analytics', label: 'ANALYTICS', icon: ASSETS.analyticsNavIcon },
    { id: 'groups', label: 'GROUPS', icon: ASSETS.groupsNavIcon },
    { id: 'settings', label: 'SETTINGS', icon: ASSETS.settingsNavIcon },
  ]
  return (
    <div className="bg-[#fafafa] rounded-tl-[32px] rounded-tr-[32px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.15)] h-[72px] flex items-center justify-around px-2 overflow-hidden">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className="flex flex-col items-center gap-[2px] pt-[8px] flex-1 h-full"
          >
            <img src={tab.icon} alt={tab.label} className="w-[32px] h-[32px] object-contain" />
            <span
              className="font-['DM_Sans',sans-serif] font-normal text-[11px] tracking-wide"
              style={{ color: isActive ? '#ff610a' : '#263238' }}
            >
              {tab.label}
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
      <div className="flex items-center justify-between px-[10px] pt-[12px] pb-[8px] shrink-0">
        <img src={ASSETS.airtrackLogo} alt="Airtrack" className="w-[36px] h-[33px] object-contain" />
        <div className="flex items-center gap-[4px]">
          <img src={ASSETS.locationIcon} alt="" className="w-[18px] h-[18px] object-contain" />
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#607d8b] text-[14px]">
            {DUMMY.location}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="bg-white rounded-[28px] shadow-[0px_-4px_5.45px_0px_rgba(0,0,0,0.06)] px-[10px] pt-[20px] pb-[12px] mx-[-2px]">

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
