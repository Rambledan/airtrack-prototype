// London-based locations
const LOCATIONS = {
  home: 'Islington',
  office: 'Canary Wharf',
  areas: ['Shoreditch', 'Hackney', 'Victoria Park', 'Regent\'s Park', 'South Bank', 'King\'s Cross', 'Angel'],
}

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

// Simplified activity templates - only outdoor activities with Strava
const DAY_TEMPLATES = [
  // Morning run
  [
    { type: 'running', start: 7, duration: 35, location: 'Regent\'s Park' },
  ],
  // Evening run
  [
    { type: 'running', start: 18, duration: 45, location: 'Regent\'s Canal' },
  ],
  // Morning cycle
  [
    { type: 'cycling', start: 7.5, duration: 50, location: 'Richmond Park' },
  ],
  // Evening cycle
  [
    { type: 'cycling', start: 17, duration: 40, location: 'Thames Path' },
  ],
  // Double run day
  [
    { type: 'running', start: 6.5, duration: 40, location: 'Victoria Park' },
    { type: 'running', start: 18, duration: 30, location: 'Regent\'s Canal' },
  ],
  // Run and cycle
  [
    { type: 'running', start: 7, duration: 35, location: 'Hyde Park' },
    { type: 'cycling', start: 17.5, duration: 55, location: 'Cycle Superhighway 3' },
  ],
  // Hiking day
  [
    { type: 'hiking', start: 9, duration: 120, location: 'Hampstead Heath' },
  ],
  // Long hiking
  [
    { type: 'hiking', start: 8, duration: 180, location: 'Box Hill' },
  ],
  // Long run
  [
    { type: 'running', start: 8, duration: 75, location: 'Hyde Park' },
  ],
  // Long cycle
  [
    { type: 'cycling', start: 8, duration: 120, location: 'Richmond Park Loop' },
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

// Get realistic AQI based on activity type and time of day
function getRealisticAqi(activityType, hour) {
  let baseAqi = 30
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    baseAqi = 50
  } else if (hour >= 12 && hour <= 14) {
    baseAqi = 40
  }

  const modifiers = {
    running: randomBetween(-10, 15),
    cycling: randomBetween(-5, 20),
    hiking: randomBetween(-20, 5), // Hiking typically has better air quality
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
    hasStrava: true, // Always has Strava
  }
}

// Generate cycling-specific data (Strava integration)
function generateCyclingData(durationMinutes) {
  const avgSpeedKmh = randomBetween(18, 28) // 18-28 km/h
  const distanceKm = (durationMinutes / 60) * avgSpeedKmh

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    avgSpeedKmh: avgSpeedKmh,
    hasStrava: true, // Always has Strava
  }
}

// Generate hiking-specific data (Strava integration)
function generateHikingData(durationMinutes) {
  const avgPaceMinPerKm = randomBetween(800, 1200) / 100 // 8:00 to 12:00 min/km
  const distanceKm = durationMinutes / avgPaceMinPerKm
  const elevationGain = randomBetween(50, 300) // meters

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    avgPaceMinPerKm: avgPaceMinPerKm,
    elevationGain: elevationGain,
    hasStrava: true, // Always has Strava
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

    // Add activity-specific data
    if (activity.type === 'running') {
      const runData = generateRunningData(activity.duration)
      segment.distanceKm = runData.distanceKm
      segment.avgPaceMinPerKm = runData.avgPaceMinPerKm
      segment.hasStrava = runData.hasStrava
      // ~30% of runs have optimization suggestions
      if (Math.random() > 0.7) {
        segment.potentialScore = generatePotentialScore(score, 'running')
      } else if (score >= 80 && Math.random() > 0.6) {
        segment.isStarSegment = true
        segment.starReason = randomFromArray([
          'Perfect timing! You ran during the cleanest air window.',
          'Great choice! This route had 40% less pollution than the main road.',
          'Optimal conditions! Morning air quality was excellent today.',
        ])
      }
    } else if (activity.type === 'cycling') {
      const cycleData = generateCyclingData(activity.duration)
      segment.distanceKm = cycleData.distanceKm
      segment.avgSpeedKmh = cycleData.avgSpeedKmh
      segment.hasStrava = cycleData.hasStrava
      // ~25% of cycles have cleaner route suggestions
      if (Math.random() > 0.75) {
        segment.potentialScore = generatePotentialScore(score, 'cycling')
      } else if (score >= 75 && Math.random() > 0.65) {
        segment.isStarSegment = true
        segment.starReason = randomFromArray([
          'Smart routing! The park path kept you away from traffic pollution.',
          'Well timed! You beat the morning rush hour congestion.',
          'Clean ride! This route scored in the top 10% for air quality.',
        ])
      }
    } else if (activity.type === 'hiking') {
      const hikeData = generateHikingData(activity.duration)
      segment.distanceKm = hikeData.distanceKm
      segment.avgPaceMinPerKm = hikeData.avgPaceMinPerKm
      segment.elevationGain = hikeData.elevationGain
      segment.hasStrava = hikeData.hasStrava
      // Hiking usually has good air quality
      if (score >= 75 && Math.random() > 0.5) {
        segment.isStarSegment = true
        segment.starReason = randomFromArray([
          'Fresh air! Elevation kept you above the city pollution.',
          'Great escape! This trail had excellent air quality throughout.',
          'Clean hiking! Nature at its finest with pristine air.',
        ])
      }
    }

    segments.push(segment)
  }

  return segments.reverse()
}

// Generate insight items for a specific day (disabled - only activity cards)
function generateDayInsights(date, dayIndex) {
  return [] // No insights, only activity cards
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
    // Pick any template randomly
    const template = randomFromArray(DAY_TEMPLATES)

    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)

    const segments = generateDaySegments(dayStart, template)
    const insights = generateDayInsights(dayStart, dayIndex)

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

export { getScoreLevel, aqiToScore }
