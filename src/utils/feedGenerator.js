// London-based locations
const LOCATIONS = {
  home: 'Islington',
  office: 'Canary Wharf',
  areas: ['Shoreditch', 'Hackney', 'Victoria Park', 'Regent\'s Park', 'South Bank', 'King\'s Cross', 'Angel'],
}

// London area coordinate anchors for route generation
const LOCATION_COORDS = {
  'Islington':       { lat: 51.5362, lng: -0.1033 },
  'Canary Wharf':    { lat: 51.5054, lng: -0.0235 },
  'Regent\'s Park':  { lat: 51.5313, lng: -0.1570 },
  'Regent\'s Canal': { lat: 51.5369, lng: -0.0870 },
  'Victoria Park':   { lat: 51.5364, lng: -0.0334 },
  'Richmond Park':   { lat: 51.4408, lng: -0.2664 },
  'Thames Path':     { lat: 51.4890, lng: -0.1290 },
  'Hampstead Heath': { lat: 51.5718, lng: -0.1621 },
  'Hyde Park':       { lat: 51.5073, lng: -0.1657 },
  'South Bank':      { lat: 51.5055, lng: -0.1132 },
  'Shoreditch':      { lat: 51.5248, lng: -0.0798 },
  'Hackney':         { lat: 51.5450, lng: -0.0553 },
  'Angel':           { lat: 51.5322, lng: -0.1058 },
  'Camden':          { lat: 51.5392, lng: -0.1426 },
  'default':         { lat: 51.5100, lng: -0.1278 },
}

const COACHING_BETTER_TIME = [
  'Air quality peaks at 7am in this area. Going 30 minutes earlier could improve your score by around 12 points.',
  'Early morning has the cleanest air on this route. A 6:30am start would boost your score by up to 10 points.',
  'Peak hour traffic raises PM2.5 here significantly. Try the same route before 8am for a much cleaner experience.',
  'Wind patterns favour this route in the morning. Starting before 7:30am typically adds 8–14 points to your score.',
]

const COACHING_BETTER_ROUTE = [
  'The canal path 200m north had 18% cleaner air yesterday. A small detour would significantly boost your score.',
  'The park route via the east gate avoids the main road. It adds 4 minutes but cuts pollution exposure by 22%.',
  'Cutting through the residential streets here reduces traffic pollution. This alternative typically scores 15 points higher.',
  'The river path runs parallel to your route with far cleaner air. It\'s the same distance with a noticeably better score.',
]

const ROUTES = [
  { from: 'Islington', to: 'Canary Wharf', via: 'Jubilee Line' },
  { from: 'Canary Wharf', to: 'Victoria Park', via: 'Limehouse Cut' },
  { from: 'Islington', to: 'Regent\'s Park', via: 'Camden' },
  { from: 'Angel', to: 'Shoreditch', via: 'Old Street' },
]

const PARTNER_PRODUCTS = [
  { partner: 'Dyson', product: 'Purifier Cool', headline: 'Clean air, delivered', cta: 'Shop Now' },
  { partner: 'Blueair', product: 'Blue 3210', headline: 'Breathe easier at home', cta: 'Learn More' },
  { partner: 'Philips', product: 'Air Purifier 800', headline: 'Remove 99.5% of particles', cta: 'Get 15% Off' },
]

const NEW_LOCATIONS = [
  { name: 'Edinburgh, Scotland', distance: 332 },
  { name: 'Paris, France', distance: 283 },
  { name: 'Amsterdam, Netherlands', distance: 358 },
  { name: 'Dublin, Ireland', distance: 291 },
  { name: 'Barcelona, Spain', distance: 708 },
]

const DAILY_SUMMARIES = [
  'Yesterday you spent 7 hours indoors with good air quality. Your evening run along the canal had moderate PM2.5.',
  'A productive day! 8 hours at the office in Canary Wharf with excellent filtration. Your walk home had slightly elevated levels.',
  'Mixed exposure yesterday. Morning Tube commute had high pollution but your indoor time balanced it out nicely.',
  'Great air day! All outdoor activities were in the green zone. Total exposure score was your best this week.',
  'Your Northern Line commute had the highest exposure yesterday. Consider the 7:45am train for 20% better air quality.',
]

const RECOMMENDATIONS = [
  'Consider staying indoors until conditions improve.',
  'Limit outdoor exercise to early morning hours.',
  'Air quality expected to improve by evening.',
  'Sensitive groups should avoid prolonged outdoor activity.',
  'Close windows and use air purification if available.',
]

// Realistic daily activity templates (no activities 11pm-5am)
const DAY_TEMPLATES = [
  // Weekday - office worker
  [
    { type: 'indoor', start: 6, duration: 60, location: 'Home' },
    { type: 'walking', start: 7, duration: 10, location: 'Angel' },
    { type: 'train', start: 7.17, duration: 35, location: 'Northern Line' },
    { type: 'walking', start: 8, duration: 8, location: 'Canary Wharf' },
    { type: 'indoor', start: 8.15, duration: 240, location: 'Office' },
    { type: 'walking', start: 12.25, duration: 20, location: 'Canary Wharf' },
    { type: 'indoor', start: 13, duration: 270, location: 'Office' },
    { type: 'walking', start: 17.5, duration: 8, location: 'Canary Wharf' },
    { type: 'train', start: 17.65, duration: 40, location: 'Jubilee Line' },
    { type: 'walking', start: 18.35, duration: 10, location: 'Islington' },
    { type: 'running', start: 19, duration: 35, location: 'Regent\'s Canal' },
    { type: 'indoor', start: 20, duration: 180, location: 'Home' },
  ],
  // Weekday - cycling commuter
  [
    { type: 'indoor', start: 6.5, duration: 45, location: 'Home' },
    { type: 'cycling', start: 7.25, duration: 40, location: 'Cycle Superhighway 3' },
    { type: 'indoor', start: 8.25, duration: 255, location: 'Office' },
    { type: 'walking', start: 12.5, duration: 25, location: 'South Bank' },
    { type: 'indoor', start: 13, duration: 240, location: 'Office' },
    { type: 'cycling', start: 17.25, duration: 45, location: 'Cycle Superhighway 3' },
    { type: 'indoor', start: 18.25, duration: 60, location: 'Home' },
    { type: 'walking', start: 19.5, duration: 40, location: 'Victoria Park' },
    { type: 'indoor', start: 20.25, duration: 150, location: 'Home' },
  ],
  // Weekday - bus commuter with gym
  [
    { type: 'indoor', start: 5.5, duration: 30, location: 'Home' },
    { type: 'walking', start: 6, duration: 5, location: 'Islington' },
    { type: 'bus', start: 6.1, duration: 25, location: '38 Bus' },
    { type: 'indoor', start: 6.5, duration: 60, location: 'PureGym Angel' },
    { type: 'walking', start: 7.5, duration: 15, location: 'King\'s Cross' },
    { type: 'train', start: 7.75, duration: 30, location: 'Northern Line' },
    { type: 'indoor', start: 8.25, duration: 480, location: 'Office' },
    { type: 'train', start: 16.5, duration: 35, location: 'Northern Line' },
    { type: 'walking', start: 17.15, duration: 12, location: 'Angel' },
    { type: 'indoor', start: 17.5, duration: 210, location: 'Home' },
  ],
  // Weekend - leisure day
  [
    { type: 'indoor', start: 8, duration: 120, location: 'Home' },
    { type: 'running', start: 10, duration: 45, location: 'Regent\'s Park' },
    { type: 'walking', start: 11, duration: 30, location: 'Camden' },
    { type: 'indoor', start: 11.5, duration: 90, location: 'Café' },
    { type: 'walking', start: 13.5, duration: 60, location: 'South Bank' },
    { type: 'indoor', start: 14.75, duration: 120, location: 'Tate Modern' },
    { type: 'walking', start: 17, duration: 20, location: 'Southwark' },
    { type: 'train', start: 17.5, duration: 25, location: 'Northern Line' },
    { type: 'indoor', start: 18, duration: 240, location: 'Home' },
  ],
  // Weekend - active day
  [
    { type: 'indoor', start: 7, duration: 60, location: 'Home' },
    { type: 'cycling', start: 8, duration: 90, location: 'Richmond Park' },
    { type: 'indoor', start: 10, duration: 60, location: 'Café' },
    { type: 'cycling', start: 11.25, duration: 75, location: 'Thames Path' },
    { type: 'indoor', start: 13, duration: 120, location: 'Home' },
    { type: 'walking', start: 15.5, duration: 45, location: 'Hampstead Heath' },
    { type: 'indoor', start: 16.5, duration: 270, location: 'Home' },
  ],
]

// Helper functions
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convert AQI (0-500) to percentage score (100% = perfect, 5% = worst)
 * AQI 0-25 = 100-90%, AQI 25-50 = 90-75%, AQI 50-100 = 75-50%, AQI 100-150 = 50-25%, AQI 150+ = 25-5%
 */
function aqiToScore(aqi) {
  if (aqi <= 25) return Math.round(100 - (aqi / 25) * 10)
  if (aqi <= 50) return Math.round(90 - ((aqi - 25) / 25) * 15)
  if (aqi <= 100) return Math.round(75 - ((aqi - 50) / 50) * 25)
  if (aqi <= 150) return Math.round(50 - ((aqi - 100) / 50) * 25)
  return Math.max(5, Math.round(25 - ((aqi - 150) / 100) * 20))
}

/**
 * Get score level based on percentage (inverted from AQI)
 * 100% = excellent (green), 5% = hazardous (red)
 */
function getScoreLevel(score) {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 55) return 'moderate'
  if (score >= 40) return 'poor'
  if (score >= 25) return 'bad'
  return 'hazardous'
}

// Generate synthetic route waypoints for outdoor activity segments
function generateRouteWaypoints(location, durationMinutes) {
  const anchor = LOCATION_COORDS[location] || LOCATION_COORDS['default']
  // Scale route spread loosely with duration
  const spread = Math.min(0.012, 0.003 + durationMinutes * 0.00015)

  const points = [{ lat: anchor.lat, lng: anchor.lng }]
  const numMid = randomBetween(3, 5)
  let curLat = anchor.lat
  let curLng = anchor.lng

  for (let i = 0; i < numMid; i++) {
    curLat += (Math.random() - 0.45) * spread
    curLng += (Math.random() - 0.35) * spread
    points.push({ lat: curLat, lng: curLng })
  }

  // End point close to start (loop/out-and-back feel)
  points.push({
    lat: anchor.lat + (Math.random() - 0.5) * spread * 0.4,
    lng: anchor.lng + (Math.random() - 0.5) * spread * 0.4,
  })

  return points
}

// Route star rating: how close was this route to the cleanest available? (1–5)
function generateRouteRating(score) {
  if (score >= 85) return 5
  if (score >= 75) return 4
  if (score >= 60) return 3
  if (score >= 45) return 2
  return 1
}

// Time star rating: how close was the activity time to the cleanest window? (1–5)
function generateTimeRating(startTime, score) {
  const hour = new Date(startTime).getHours()
  const isOptimalTime = (hour >= 6 && hour <= 8) || (hour >= 20 && hour <= 22)
  const isOkTime = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 19)
  if (isOptimalTime && score >= 70) return 5
  if (isOptimalTime || score >= 75) return 4
  if (isOkTime) return 3
  if (hour >= 12 && hour <= 16) return 2
  return 1
}

// Get realistic AQI based on activity type and time of day
function getRealisticAqi(activityType, hour) {
  let baseAqi = 30
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    baseAqi = 50
  } else if (hour >= 12 && hour <= 14) {
    baseAqi = 40
  }

  const modifiers = {
    indoor: -15 + randomBetween(-5, 5),
    walking: randomBetween(-5, 15),
    running: randomBetween(-5, 20),
    cycling: randomBetween(5, 25),
    car: randomBetween(10, 30),
    bus: randomBetween(15, 35),
    train: randomBetween(20, 45),
  }

  return Math.max(15, Math.min(180, baseAqi + (modifiers[activityType] || 0)))
}

// Generate running-specific data (Strava integration)
function generateRunningData(durationMinutes) {
  const avgPaceMinPerKm = randomBetween(450, 600) / 100 // 4:30 to 6:00 min/km
  const distanceKm = durationMinutes / avgPaceMinPerKm

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    avgPaceMinPerKm: avgPaceMinPerKm,
    hasStrava: Math.random() > 0.3, // 70% chance of Strava integration
  }
}

// Generate potential score for activities
function generatePotentialScore(currentScore, activityType) {
  // Potential improvement varies by activity type
  const improvements = {
    running: randomBetween(5, 15),      // Better timing
    car: randomBetween(8, 20),          // Public transport alternative
    walking: randomBetween(3, 10),      // Cleaner route
    cycling: randomBetween(4, 12),      // Cleaner route
  }

  const improvement = improvements[activityType] || 0
  return Math.min(100, currentScore + improvement)
}

// Generate a full day of segments from a template
function generateDaySegments(date, template) {
  const segments = []

  for (const activity of template) {
    const startHour = Math.floor(activity.start)
    const startMinute = Math.round((activity.start - startHour) * 60)

    const startTime = new Date(date)
    startTime.setHours(startHour, startMinute, 0, 0)

    const endTime = new Date(startTime.getTime() + activity.duration * 60 * 1000)
    const aqi = getRealisticAqi(activity.type, startHour)
    const score = aqiToScore(aqi)

    const segment = {
      id: generateId(),
      type: 'segment',
      activityType: activity.type,
      score,
      scoreLevel: getScoreLevel(score),
      durationMinutes: activity.duration,
      startTime,
      endTime,
      location: activity.location,
      timestamp: endTime,
    }

    // Add route, coaching, and star ratings for all outdoor activities
    if (['running', 'cycling', 'hiking', 'walking'].includes(activity.type)) {
      segment.routePoints = generateRouteWaypoints(activity.location, activity.duration)
      segment.coachingText = Math.random() > 0.5
        ? randomFromArray(COACHING_BETTER_TIME)
        : randomFromArray(COACHING_BETTER_ROUTE)
      segment.routeRating = generateRouteRating(score)
      segment.timeRating = generateTimeRating(startTime, score)
    }

    // Add building data for indoor segments
    if (activity.type === 'indoor') {
      const BUILDING_ERAS = [
        'Pre-1919',
        'Interwar (1919–1945)',
        'Post-war (1945–1979)',
        'Modern (1980–2000)',
        'Contemporary (post-2000)',
      ]
      const CONSTRUCTION_MAP = {
        Home: 'Victorian terraced brick',
        Office: 'Steel & glass curtain wall',
        Café: 'Mixed Victorian conversion',
        Gym: 'Modern concrete frame',
        Tate: 'Historic stone masonry',
      }
      const locKey = Object.keys(CONSTRUCTION_MAP).find(k =>
        activity.location.includes(k)
      ) || 'Home'

      const eraIndex = randomBetween(0, BUILDING_ERAS.length - 1)
      segment.buildingEra = BUILDING_ERAS[eraIndex]
      segment.constructionType = CONSTRUCTION_MAP[locKey]
      // Older eras → higher natural ventilation potential: Pre-1919=5 … Contemporary=1
      segment.ventilationRating = Math.max(1, 5 - eraIndex)
    }

    // A segment is a "10 Star Segment" only when both route and time ratings are 5
    // This means the user picked both the cleanest route AND the optimal time window
    if (segment.routeRating === 5 && segment.timeRating === 5) {
      segment.isStarSegment = true
      const STAR_REASONS = {
        running: [
          'Perfect run! You chose the cleanest route at the optimal time of day.',
          'Flawless timing and routing — you nailed both for maximum clean air.',
          'Best possible conditions: top-rated route and ideal air quality window.',
        ],
        cycling: [
          'Perfect ride! Cleanest route and optimal time — a full 10 stars.',
          'You timed it perfectly and took the cleanest path. Outstanding.',
          'Top-rated route at the best time of day. A genuinely clean commute.',
        ],
        walking: [
          'Perfect walk! Best route and best time of day for clean air.',
          'You chose the cleanest path at the optimal air quality window.',
          'Ideal conditions — route and timing both scored a perfect 5 stars.',
        ],
        hiking: [
          'A perfect hike — cleanest trail and optimal conditions today.',
          'You couldn\'t have chosen better: perfect route and perfect timing.',
          'Top-rated trail at peak clean-air conditions. A rare achievement.',
        ],
      }
      segment.starReason = randomFromArray(
        STAR_REASONS[activity.type] || STAR_REASONS.running
      )
    }

    // Add activity-specific data
    if (activity.type === 'running') {
      const runData = generateRunningData(activity.duration)
      segment.distanceKm = runData.distanceKm
      segment.avgPaceMinPerKm = runData.avgPaceMinPerKm
      segment.hasStrava = runData.hasStrava
      // Only ~30% of runs have optimization suggestions (skip if already a star segment)
      if (!segment.isStarSegment && Math.random() > 0.7) {
        segment.potentialScore = generatePotentialScore(score, 'running')
      }
    } else if (activity.type === 'car') {
      // Only ~40% of car trips show alternatives
      if (Math.random() > 0.6) {
        segment.potentialScore = generatePotentialScore(score, 'car')
      }
    } else if (activity.type === 'walking' || activity.type === 'cycling') {
      // Only ~25% of walks/cycles have cleaner route suggestions (skip if already a star segment)
      if (!segment.isStarSegment && Math.random() > 0.75) {
        segment.potentialScore = generatePotentialScore(score, activity.type)
      }
    }

    segments.push(segment)
  }

  return segments.reverse()
}

// Generate insight items for a specific day
function generateDayInsights(date, dayIndex, daySegments = []) {
  const insights = []
  const isToday = dayIndex === 0

  if (dayIndex > 0) {
    const summaryTime = new Date(date)
    // Set to 00:00:01 to ensure daily summary appears at END of each day's items
    // (feed sorts descending by timestamp, so earliest timestamp = bottom)
    summaryTime.setHours(0, 0, 0, 1)

    // Calculate actual average score from segments
    const avgScore = daySegments.length > 0
      ? Math.round(daySegments.reduce((sum, s) => sum + s.score, 0) / daySegments.length)
      : randomBetween(55, 85)

    // Calculate actual outdoor minutes from segments
    const outdoorActivities = ['walking', 'running', 'cycling', 'hiking']
    const outdoorMins = daySegments
      .filter(s => outdoorActivities.includes(s.activityType))
      .reduce((sum, s) => sum + s.durationMinutes, 0)

    insights.push({
      id: generateId(),
      type: 'daily-summary',
      timestamp: summaryTime,
      summaryDate: date,
      summary: randomFromArray(DAILY_SUMMARIES),
      averageScore: avgScore,
      scoreLevel: getScoreLevel(avgScore),
      totalSegments: daySegments.length || randomBetween(8, 14),
      outdoorMinutes: outdoorMins || randomBetween(45, 150),
      // Include segment data for DayScoreRing visualization
      segments: daySegments.map(s => ({
        durationMinutes: s.durationMinutes,
        score: s.score,
        startTime: s.startTime,
        endTime: s.endTime,
        activityType: s.activityType
      }))
    })
  }

  if (isToday || Math.random() > 0.6) {
    const insightTime = new Date(date)
    insightTime.setHours(7, randomBetween(0, 30), 0, 0)

    const recommendedHour = randomBetween(6, 8)
    const recommendedTime = new Date(date)
    recommendedTime.setHours(recommendedHour, 0, 0, 0)

    const predictedScore = randomBetween(80, 95)
    insights.push({
      id: generateId(),
      type: 'best-time',
      timestamp: insightTime,
      recommendedTime,
      predictedScore,
      scoreLevel: getScoreLevel(predictedScore),
      activitySuggestion: randomFromArray(['running', 'cycling', 'walking']),
    })
  }

  if (Math.random() > 0.7) {
    const alertTime = new Date(date)
    alertTime.setHours(randomBetween(14, 17), randomBetween(0, 59), 0, 0)
    const score = randomBetween(20, 45)

    insights.push({
      id: generateId(),
      type: 'air-quality-alert',
      timestamp: alertTime,
      currentScore: score,
      scoreLevel: getScoreLevel(score),
      recommendation: randomFromArray(RECOMMENDATIONS),
      expectedDurationHours: randomBetween(2, 6),
    })
  }

  if (Math.random() > 0.65) {
    const optimTime = new Date(date)
    optimTime.setHours(randomBetween(8, 9), randomBetween(0, 30), 0, 0)
    const route = randomFromArray(ROUTES)
    const currentScore = randomBetween(45, 70)
    const improvement = randomBetween(10, 25)

    insights.push({
      id: generateId(),
      type: 'route-optimization',
      timestamp: optimTime,
      originalRoute: `${route.from} → ${route.to}`,
      suggestedRoute: `${route.from} → ${route.via} → ${route.to}`,
      currentScore,
      suggestedScore: Math.min(100, currentScore + improvement),
      improvementPercent: improvement,
    })
  }

  if (dayIndex === 1 || (dayIndex > 2 && Math.random() > 0.85)) {
    const ctaTime = new Date(date)
    ctaTime.setHours(12, 0, 0, 0)
    const product = randomFromArray(PARTNER_PRODUCTS)

    insights.push({
      id: generateId(),
      type: 'partnership',
      timestamp: ctaTime,
      partnerName: product.partner,
      productName: product.product,
      headline: product.headline,
      ctaText: product.cta,
      ctaUrl: '#',
    })
  }

  if (dayIndex === 0 || dayIndex === 3) {
    const benchTime = new Date(date)
    benchTime.setHours(20, 0, 0, 0)
    const userScore = randomBetween(60, 85)
    const cityAverage = randomBetween(50, 70)

    insights.push({
      id: generateId(),
      type: 'benchmark',
      timestamp: benchTime,
      userScore,
      cityAverage,
      cityName: 'London',
      percentileBetterThan: userScore > cityAverage ? randomBetween(62, 88) : randomBetween(30, 48),
    })
  }

  if (dayIndex === 4 && Math.random() > 0.5) {
    const travelTime = new Date(date)
    travelTime.setHours(14, 0, 0, 0)
    const location = randomFromArray(NEW_LOCATIONS)
    const localScore = randomBetween(50, 90)

    insights.push({
      id: generateId(),
      type: 'new-location',
      timestamp: travelTime,
      locationName: location.name,
      distanceFromHomeMiles: location.distance,
      localScore,
      localScoreLevel: getScoreLevel(localScore),
    })
  }

  return insights
}

function mergeFeedItems(segments, insights) {
  const allItems = [...segments, ...insights]
  allItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return allItems
}

export function generateDaysFeed(numDays, startDate = new Date()) {
  const allItems = []
  let currentDate = new Date(startDate)

  for (let dayIndex = 0; dayIndex < numDays; dayIndex++) {
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
    const templatePool = isWeekend ? DAY_TEMPLATES.slice(3) : DAY_TEMPLATES.slice(0, 3)
    const template = randomFromArray(templatePool)

    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)

    const segments = generateDaySegments(dayStart, template)
    const insights = generateDayInsights(dayStart, dayIndex, segments)

    let dayItems = mergeFeedItems(segments, insights)
    if (dayIndex === 0) {
      const now = new Date()
      dayItems = dayItems.filter(item => new Date(item.timestamp) <= now)
    }

    if (dayItems.length > 0) {
      allItems.push({
        id: `day-${dayStart.toISOString()}`,
        type: 'day-divider',
        date: new Date(dayStart),
        timestamp: new Date(dayStart.setHours(23, 59, 59, 999)),
      })
      allItems.push(...dayItems)
    }

    currentDate.setDate(currentDate.getDate() - 1)
  }

  return {
    items: allItems,
    lastDate: currentDate,
  }
}

export function loadMoreDays(beforeDate, numDays = 2) {
  const startDate = new Date(beforeDate)
  startDate.setDate(startDate.getDate() - 1)
  return generateDaysFeed(numDays, startDate)
}

export function generateUserStarStats() {
  return {
    totalRouteStars: randomBetween(28, 72),
    totalTimeStars: randomBetween(22, 68),
    totalSegments: randomBetween(18, 45),
    avgRouteRating: randomBetween(28, 45) / 10,
    avgTimeRating: randomBetween(25, 42) / 10,
  }
}

export { getScoreLevel, aqiToScore }
