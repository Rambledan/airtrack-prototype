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
//       category: string,   // 'None' | 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High'
//       healthRecommendations: string[],
//     }
//   ]
// }

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
    },
    {
      code: 'WEED',
      displayName: 'Weed',
      inSeason: false,
      value: 0,
      category: 'None',
      healthRecommendations: [],
    },
  ],
}

// ── Parser: Google API response → normalised shape ───────────────────────────
function parseResponse(json) {
  const dayInfo = json?.dailyInfo?.[0]
  if (!dayInfo) throw new Error('No daily info in pollen response')

  const { date, pollenTypeInfo = [] } = dayInfo

  const types = ['TREE', 'GRASS', 'WEED'].map((code) => {
    const info = pollenTypeInfo.find((p) => p.code === code)
    if (!info) {
      return { code, displayName: code, inSeason: false, value: 0, category: 'None', healthRecommendations: [] }
    }
    return {
      code,
      displayName: info.displayName || code,
      inSeason: !!info.inSeason,
      value: info.indexInfo?.value ?? 0,
      category: info.indexInfo?.category || 'None',
      healthRecommendations: info.healthRecommendations || [],
    }
  })

  return { source: 'api', date, types }
}

// ── Public fetch function ─────────────────────────────────────────────────────
// Returns normalised pollen data for the given coordinates.
// Always resolves — never rejects. Falls back to mock on any error.
export async function fetchPollenData(lat, lng) {
  const apiKey = import.meta.env.VITE_GOOGLE_POLLEN_API_KEY

  if (!apiKey) {
    console.info('[Pollen] No API key — using mock data')
    return MOCK_DATA
  }

  try {
    const url = `${API_BASE}?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}&days=1`
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
