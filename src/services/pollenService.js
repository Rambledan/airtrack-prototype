// ── Google Pollen API service ─────────────────────────────────────────────────
// Docs: https://developers.google.com/maps/documentation/pollen/reference/rest
//
// Requires VITE_GOOGLE_POLLEN_API_KEY in .env.local
// Falls back to mock data when the key is absent or the request fails.

const API_BASE = 'https://pollen.googleapis.com/v1/forecast:lookup'

// ── Normalised shape returned by this module ─────────────────────────────────
// {
//   source: 'api' | 'mock',
//   date: { year, month, day },
//   types: [
//     {
//       code: 'TREE' | 'GRASS' | 'WEED',
//       displayName: string,
//       inSeason: boolean,
//       value: 0–5,
//       category: string,
//       healthRecommendations: string[],
//       plants: [            // species within this type
//         {
//           code: string,    // e.g. 'BIRCH', 'OAK'
//           displayName: string,
//           inSeason: boolean,
//           value: 0–5,
//           category: string,
//           family: string,  // botanical family, e.g. 'Betulaceae'
//           season: string,  // e.g. 'February to April'
//           crossReactivity: string,
//         }
//       ]
//     }
//   ]
// }

// ── Mock plant species (London, late April — realistic seasonal profile) ──────
const MOCK_PLANTS = {
  TREE: [
    {
      code: 'BIRCH',
      displayName: 'Birch',
      inSeason: true,
      value: 4,
      category: 'Very High',
      family: 'Betulaceae',
      season: 'March to May',
      crossReactivity: 'May cause reactions in people allergic to Alder or Hazel pollen.',
    },
    {
      code: 'OAK',
      displayName: 'Oak',
      inSeason: true,
      value: 3,
      category: 'High',
      family: 'Fagaceae',
      season: 'April to June',
      crossReactivity: 'Cross-reactivity with Beech and Chestnut pollen reported.',
    },
    {
      code: 'PLANE',
      displayName: 'London Plane',
      inSeason: true,
      value: 3,
      category: 'High',
      family: 'Platanaceae',
      season: 'April to May',
      crossReactivity: 'Limited cross-reactivity with other species.',
    },
    {
      code: 'ASH',
      displayName: 'Ash',
      inSeason: true,
      value: 2,
      category: 'Moderate',
      family: 'Oleaceae',
      season: 'March to May',
      crossReactivity: 'Cross-reactivity with Olive pollen reported.',
    },
    {
      code: 'ALDER',
      displayName: 'Alder',
      inSeason: false,
      value: 0,
      category: 'None',
      family: 'Betulaceae',
      season: 'January to April',
      crossReactivity: 'Cross-reactivity with Birch and Hazel pollen.',
    },
  ],
  GRASS: [
    {
      code: 'TIMOTHY',
      displayName: 'Timothy',
      inSeason: true,
      value: 2,
      category: 'Moderate',
      family: 'Poaceae',
      season: 'May to August',
      crossReactivity: 'High cross-reactivity with most other grass species.',
    },
    {
      code: 'RYEGRASS',
      displayName: 'Ryegrass',
      inSeason: true,
      value: 1,
      category: 'Very Low',
      family: 'Poaceae',
      season: 'May to August',
      crossReactivity: 'Cross-reactive with most other temperate grasses.',
    },
  ],
  WEED: [
    {
      code: 'MUGWORT',
      displayName: 'Mugwort',
      inSeason: false,
      value: 0,
      category: 'None',
      family: 'Asteraceae',
      season: 'July to September',
      crossReactivity: 'Cross-reactivity with Ragweed and some food allergens reported.',
    },
    {
      code: 'NETTLE',
      displayName: 'Nettle',
      inSeason: false,
      value: 0,
      category: 'None',
      family: 'Urticaceae',
      season: 'May to September',
      crossReactivity: 'Limited cross-reactivity with other weed species.',
    },
  ],
}

// ── Mock data (London spring — realistic seasonal profile) ───────────────────
const MOCK_DATA = {
  source: 'mock',
  date: (() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
  })(),
  types: [
    {
      code: 'TREE',
      displayName: 'Tree',
      inSeason: true,
      value: 3,
      category: 'High',
      healthRecommendations: [
        'Wear sunglasses outdoors to protect your eyes from pollen.',
        'Shower and change clothes after spending time outside.',
        'Keep windows closed during peak pollen hours (5am–10am).',
      ],
      plants: MOCK_PLANTS.TREE,
    },
    {
      code: 'GRASS',
      displayName: 'Grass',
      inSeason: true,
      value: 2,
      category: 'Moderate',
      healthRecommendations: [
        'Take antihistamines before heading outdoors if you are sensitive.',
        'Avoid mowing lawns or being near freshly cut grass.',
      ],
      plants: MOCK_PLANTS.GRASS,
    },
    {
      code: 'WEED',
      displayName: 'Weed',
      inSeason: false,
      value: 0,
      category: 'None',
      healthRecommendations: [],
      plants: MOCK_PLANTS.WEED,
    },
  ],
}

// ── Parser: Google API response → normalised shape ───────────────────────────
function parsePlant(p) {
  return {
    code: p.code,
    displayName: p.displayName || p.code,
    inSeason: !!p.inSeason,
    value: p.indexInfo?.value ?? 0,
    category: p.indexInfo?.category || 'None',
    family: p.plantDescription?.family || '',
    season: p.plantDescription?.season || '',
    crossReactivity: p.plantDescription?.crossReactivity || '',
  }
}

function parseResponse(json) {
  const dayInfo = json?.dailyInfo?.[0]
  if (!dayInfo) throw new Error('No daily info in pollen response')

  const { date, pollenTypeInfo = [], plantInfo = [] } = dayInfo

  const types = ['TREE', 'GRASS', 'WEED'].map((code) => {
    const info = pollenTypeInfo.find((p) => p.code === code)

    // Plants belonging to this type
    const plants = plantInfo
      .filter((p) => p.plantDescription?.type === code)
      .map(parsePlant)
      .sort((a, b) => b.value - a.value)

    if (!info) {
      return {
        code, displayName: code, inSeason: false,
        value: 0, category: 'None',
        healthRecommendations: [], plants,
      }
    }

    return {
      code,
      displayName: info.displayName || code,
      inSeason: !!info.inSeason,
      value: info.indexInfo?.value ?? 0,
      category: info.indexInfo?.category || 'None',
      healthRecommendations: info.healthRecommendations || [],
      plants,
    }
  })

  return { source: 'api', date, types }
}

// ── Public fetch function ─────────────────────────────────────────────────────
export async function fetchPollenData(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_POLLEN_API_KEY

  if (!apiKey) {
    console.info('[Pollen] No API key — using mock data')
    return MOCK_DATA
  }

  try {
    // plantsDescription=true adds plantInfo[] to the response
    const url = `${API_BASE}?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}&days=1&plantsDescription=true`
    const response = await fetch(url)

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.warn('[Pollen] API error', response.status, err?.error?.message)
      return { ...MOCK_DATA, source: 'mock' }
    }

    const json = await response.json()
    return parseResponse(json)
  } catch (err) {
    console.warn('[Pollen] Fetch failed', err.message)
    return { ...MOCK_DATA, source: 'mock' }
  }
}
