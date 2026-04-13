// ── Location type config for indoor segments ─────────────────────────────────

export const LOCATION_NAME_TO_TYPE = {
  'Home': 'home',
  'Office': 'office',
  'PureGym Angel': 'gym',
  'Gym': 'gym',
  'Café': 'eatery',
  'Tate Modern': 'entertainment',
  'Tate': 'entertainment',
  'Warehouse': 'industrial',
}

// London locations used for deterministic Street View / Static Map selection
export const EXAMPLE_LOCATIONS = [
  { name: 'Islington',      lat: 51.5362, lng: -0.1033 },
  { name: 'Canary Wharf',   lat: 51.5054, lng: -0.0235 },
  { name: 'Shoreditch',     lat: 51.5227, lng: -0.0785 },
  { name: 'Camden',         lat: 51.5390, lng: -0.1426 },
  { name: 'Hackney',        lat: 51.5450, lng: -0.0554 },
  { name: 'South Bank',     lat: 51.5074, lng: -0.1130 },
]

// Base indoor AQ forecast score per hour (0 = midnight, 23 = 11pm)
// Lower score = worse air quality = shorter bar
const HOME_SHAPE = [
  85, 85, 85, 85, 85, 85, // 00–05 overnight (clean)
  80,                      // 06 rising
  52, 50, 52,              // 07–09 morning cooking / getting ready
  68, 70, 70,              // 10–12 midday
  70, 68, 68,              // 13–15
  65,                      // 16 pre-dinner
  48, 46, 50,              // 17–19 dinner cooking
  62, 70, 78,              // 20–22 evening settling
  82,                      // 23
]

const OFFICE_SHAPE = [
  80, 80, 80, 80, 80, 80, // 00–05
  78, 75,                  // 06–07 building warms up
  65, 65, 65, 65,          // 08–11 working hours
  62,                      // 12 lunch activity
  65, 65, 65, 65, 65,      // 13–17 working hours
  72, 78,                  // 18–19 quieter
  82, 82, 82, 82,          // 20–23
]

const GYM_SHAPE = [
  82, 82, 82, 82, 82,      // 00–04
  75,                      // 05 early openers
  50, 48, 50,              // 06–08 morning rush
  62, 70, 74,              // 09–11
  72, 70, 70,              // 12–14
  68,                      // 15
  50, 48, 50,              // 16–18 evening rush
  55, 62,                  // 19–20
  72, 78, 80,              // 21–23
]

const EATERY_SHAPE = [
  82, 82, 82, 82, 82, 82, // 00–05
  80, 78,                  // 06–07
  72, 70,                  // 08–09 breakfast
  75, 75,                  // 10–11
  52, 50, 52,              // 12–14 lunch peak
  68, 72, 70,              // 15–17
  48, 46, 48,              // 18–20 dinner peak
  58, 65,                  // 21–22
  72,                      // 23
]

const INDUSTRIAL_SHAPE = [
  75, 75, 75, 75, 75, 75, // 00–05
  60,                      // 06 start up
  50, 48, 46, 48, 50,      // 07–11 work hours
  52,                      // 12
  48, 46, 46, 48, 50,      // 13–17
  55,                      // 18
  68, 72, 75, 75,          // 19–22
  75,                      // 23
]

const ENTERTAINMENT_SHAPE = [
  75, 75, 75, 75, 75, 75, // 00–05
  78, 78, 78,              // 06–08
  75, 74, 74,              // 09–11
  72, 70, 70,              // 12–14 daytime visitors
  72, 74,                  // 15–16
  68, 65,                  // 17–18 filling up
  50, 48, 46, 50,          // 19–22 evening peak
  60,                      // 23
]

export const LOCATION_TYPES = {
  home: {
    label: 'Home',
    icon: 'home',
    questions: [
      {
        id: 'hobFuel',
        label: 'Hob fuel type',
        type: 'choice',
        options: ['Gas', 'Electric', 'Induction', 'None'],
      },
      {
        id: 'cookingFrequency',
        label: 'How often do you cook?',
        type: 'choice',
        options: ['Daily', 'A few times a week', 'Rarely'],
      },
      {
        id: 'petCount',
        label: 'Pets in the home',
        type: 'choice',
        options: ['0', '1', '2', '3+'],
      },
    ],
    forecastShape: HOME_SHAPE,
    tips: (answers) => {
      const tips = []
      if (answers.hobFuel === 'Gas') {
        tips.push('Run your extractor fan 10 min before cooking and keep it on 10 min after — gas combustion produces NO₂ and ultrafine particles.')
        tips.push('Open a window opposite the kitchen when cooking to create cross-ventilation.')
      } else if (answers.hobFuel === 'Electric') {
        tips.push('Electric hobs still generate PM2.5 from cooking fumes — use your extractor fan consistently.')
      } else if (answers.hobFuel === 'Induction') {
        tips.push('Induction is the cleanest hob type — cooking fumes from food are still your main indoor source.')
      }
      if (answers.petCount && answers.petCount !== '0') {
        tips.push('A HEPA air purifier significantly reduces pet dander, which is a major PM2.5 source in homes with animals.')
      }
      if (answers.cookingFrequency === 'Daily') {
        tips.push('Daily cooking is the top source of indoor PM2.5 spikes. An air quality monitor near the kitchen can alert you in real time.')
      }
      if (tips.length < 3) {
        tips.push('Vacuum regularly with a HEPA-filter vacuum to reduce settled particulate matter becoming airborne.')
        tips.push('Keep indoor plants — they absorb VOCs and CO₂ while adding humidity that helps settle dust.')
      }
      return tips.slice(0, 4)
    },
  },

  office: {
    label: 'Office',
    icon: 'office',
    questions: [
      {
        id: 'floorLevel',
        label: 'Floor level',
        type: 'choice',
        options: ['Ground', '1–5', '6–15', '16+'],
      },
      {
        id: 'ventilationType',
        label: 'Ventilation type',
        type: 'choice',
        options: ['Openable windows', 'Mechanical only', 'Mixed', 'Unsure'],
      },
      {
        id: 'printersNearby',
        label: 'Laser printers nearby?',
        type: 'choice',
        options: ['Yes', 'No', 'Unsure'],
      },
    ],
    forecastShape: OFFICE_SHAPE,
    tips: (answers) => {
      const tips = []
      if (answers.printersNearby === 'Yes') {
        tips.push('Laser printers emit ultrafine particles during printing — position yourself at least 3m away and ensure good ventilation near them.')
      }
      if (answers.ventilationType === 'Mechanical only') {
        tips.push('Mechanical-only ventilation relies on filter maintenance. Ask facilities how often HVAC filters are changed — ideally every 3–6 months.')
      }
      if (answers.floorLevel === 'Ground') {
        tips.push('Ground-floor offices near roads are more exposed to traffic pollution through openable windows during rush hours — keep windows closed 7–9am and 5–7pm.')
      }
      tips.push('Indoor CO₂ rises quickly in crowded meeting rooms. If you feel drowsy after a long meeting, CO₂ build-up is often the cause — crack a window.')
      tips.push('Desk plants (spider plant, peace lily) can modestly reduce VOC levels from office furniture off-gassing.')
      return tips.slice(0, 4)
    },
  },

  gym: {
    label: 'Gym',
    icon: 'gym',
    questions: [
      {
        id: 'facilityType',
        label: 'Facility type',
        type: 'choice',
        options: ['Budget chain', 'Premium chain', 'Independent', 'Hotel / corp'],
      },
      {
        id: 'crowdLevel',
        label: 'Typical crowd level',
        type: 'choice',
        options: ['Quiet', 'Moderate', 'Busy', 'Very busy'],
      },
    ],
    forecastShape: GYM_SHAPE,
    tips: (_answers) => [
      'Gyms generate high CO₂ levels during busy periods — if you feel lightheaded, air quality is likely the cause, not just effort.',
      'Rubber flooring and cleaning chemicals are significant VOC sources in gyms. Ventilation quality varies widely — budget chains often have poorer airflow.',
      'Early morning or late evening sessions typically coincide with lower crowd density and better ventilation. Check our forecast for the best window.',
      'If you have asthma, avoid peak hours when CO₂ and PM2.5 from foot traffic are highest.',
    ],
  },

  eatery: {
    label: 'Eatery',
    icon: 'eatery',
    questions: [
      {
        id: 'eateryType',
        label: 'Type of venue',
        type: 'choice',
        options: ['Café', 'Restaurant', 'Fast food', 'Bar / pub'],
      },
      {
        id: 'seatingType',
        label: 'Seating preference',
        type: 'choice',
        options: ['Indoor', 'Outdoor / terrace', 'Mixed'],
      },
    ],
    forecastShape: EATERY_SHAPE,
    tips: (answers) => {
      const tips = []
      if (answers.eateryType === 'Bar / pub') {
        tips.push('Bars and pubs can have significantly elevated PM2.5 from cooking, candles, and historically tobacco residue in soft furnishings.')
      }
      if (answers.eateryType === 'Fast food') {
        tips.push('Fast food kitchens are major PM2.5 sources due to high-temperature frying. Seating away from the kitchen counter reduces your exposure significantly.')
      }
      if (answers.seatingType === 'Outdoor / terrace') {
        tips.push('Outdoor terrace seating typically gives 40–60% lower PM2.5 exposure than indoor seating — a good default choice on busy lunch or dinner services.')
      }
      tips.push('Lunch and dinner service peaks (12–2pm, 6–9pm) have the highest indoor pollution from cooking. Earlier or later sittings are cleaner.')
      tips.push('Candles used on tables are a meaningful source of ultrafine particles and soot — request a non-candle table if you\'re sensitive.')
      return tips.slice(0, 4)
    },
  },

  industrial: {
    label: 'Industrial Site',
    icon: 'industrial',
    questions: [
      {
        id: 'workType',
        label: 'Work type',
        type: 'choice',
        options: ['Office / admin', 'Light industrial', 'Heavy industrial', 'Warehousing'],
      },
      {
        id: 'ppeWorn',
        label: 'Respiratory PPE worn?',
        type: 'choice',
        options: ['Full PPE', 'Partial', 'None required'],
      },
    ],
    forecastShape: INDUSTRIAL_SHAPE,
    tips: (answers) => {
      const tips = []
      if (answers.workType === 'Heavy industrial') {
        tips.push('Heavy industrial environments often exceed WHO PM2.5 guidelines. Even with PPE, accumulated daily exposure is a long-term health concern.')
      }
      if (answers.ppeWorn === 'None required' && answers.workType !== 'Office / admin') {
        tips.push('Consider requesting an air quality assessment from your employer — many industrial spaces exceed safe particulate thresholds without formal monitoring.')
      }
      tips.push('Forklift and pallet truck exhaust in enclosed warehouses is a significant NO₂ and CO source — ensure ventilation doors remain open during operations.')
      tips.push('Regular nasal washing after industrial shifts can help clear accumulated particulate matter from the upper respiratory tract.')
      return tips.slice(0, 4)
    },
  },

  entertainment: {
    label: 'Entertainment Venue',
    icon: 'entertainment',
    questions: [
      {
        id: 'venueType',
        label: 'Venue type',
        type: 'choice',
        options: ['Cinema', 'Theatre', 'Music venue', 'Museum / gallery', 'Sports arena'],
      },
      {
        id: 'typicalDuration',
        label: 'Typical visit duration',
        type: 'choice',
        options: ['Under 1h', '1–2h', '2–4h', '4h+'],
      },
    ],
    forecastShape: ENTERTAINMENT_SHAPE,
    tips: (answers) => {
      const tips = []
      if (answers.venueType === 'Music venue') {
        tips.push('Music venues — especially smaller ones — can have very high CO₂ and PM2.5 from crowd density, fog machines, and candles. Near-stage areas are worst.')
      }
      if (answers.venueType === 'Cinema') {
        tips.push('Cinemas maintain relatively good air quality through mechanical ventilation. Popcorn cooking near the entrance is the main local pollution source.')
      }
      if (answers.typicalDuration === '4h+') {
        tips.push('Long visits in enclosed venues lead to significant CO₂ accumulation. Step outside for 5–10 minutes every 90 minutes if you feel fatigued.')
      }
      tips.push('Museum and gallery spaces with old textiles, books, or restoration work can have elevated VOC and particulate levels — main galleries are typically better ventilated than storage areas.')
      tips.push('Evening events in enclosed spaces have higher occupancy and worse air quality than daytime visits — check the Indoor AQ forecast for this location.')
      return tips.slice(0, 4)
    },
  },
}

// Format a saved profile into a human-readable summary string
export function formatLocationProfileSummary(type, answers) {
  if (!answers) return ''
  const parts = []

  if (type === 'home') {
    if (answers.hobFuel) parts.push(`${answers.hobFuel} hob`)
    if (answers.cookingFrequency) parts.push(`Cooks ${answers.cookingFrequency.toLowerCase()}`)
    if (answers.petCount && answers.petCount !== '0') parts.push(`${answers.petCount} pet${answers.petCount === '1' ? '' : 's'}`)
  } else if (type === 'office') {
    if (answers.floorLevel) parts.push(`Floor ${answers.floorLevel}`)
    if (answers.ventilationType) parts.push(answers.ventilationType)
    if (answers.printersNearby === 'Yes') parts.push('Printers nearby')
  } else if (type === 'gym') {
    if (answers.facilityType) parts.push(answers.facilityType)
    if (answers.crowdLevel) parts.push(`${answers.crowdLevel} crowd`)
  } else if (type === 'eatery') {
    if (answers.eateryType) parts.push(answers.eateryType)
    if (answers.seatingType) parts.push(answers.seatingType)
  } else if (type === 'industrial') {
    if (answers.workType) parts.push(answers.workType)
    if (answers.ppeWorn) parts.push(answers.ppeWorn)
  } else if (type === 'entertainment') {
    if (answers.venueType) parts.push(answers.venueType)
    if (answers.typicalDuration) parts.push(answers.typicalDuration)
  }

  return parts.join(' · ')
}
