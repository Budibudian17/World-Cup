// API-Football Client for lineups and player data
// Using free plan for static data (lineups, player photos, detailed stats)

const API_BASE_URL = 'https://v3.football.api-sports.io'
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || ''

interface CacheEntry {
  data: any
  timestamp: number
}

// Global cache that persists across requests
declare global {
  var apiFootballCache: Map<string, CacheEntry> | undefined
}

const cache = global.apiFootballCache || new Map<string, CacheEntry>()

if (process.env.NODE_ENV !== 'production') {
  global.apiFootballCache = cache
}

// Cache durations (in milliseconds)
const LINEUP_CACHE_DURATION = 86400000 // 24 hours - lineups don't change
const PLAYER_CACHE_DURATION = 86400000 // 24 hours - player data static
const TEAM_CACHE_DURATION = 86400000 // 24 hours - team data static

async function fetchWithCache(
  url: string,
  cacheDuration: number = LINEUP_CACHE_DURATION
): Promise<any> {
  const now = Date.now()
  const cached = cache.get(url)
  
  // Return cached data if still valid
  if (cached && now - cached.timestamp < cacheDuration) {
    console.log(`Cache hit for ${url}`)
    return cached.data
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    console.log(`Fetching from API: ${url}`)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'x-apisports-key': API_KEY
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Cache the data
    cache.set(url, {
      data,
      timestamp: now,
    })
    
    return data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    
    // Return cached data even if expired if available
    if (cached) {
      console.log(`Using expired cache for ${url}`)
      return cached.data
    }
    
    throw error
  }
}

// Get lineups for a specific fixture
export async function getFixtureLineups(fixtureId: string) {
  return fetchWithCache(
    `${API_BASE_URL}/fixtures/lineups?fixture=${fixtureId}`,
    LINEUP_CACHE_DURATION
  )
}

// Get player statistics
export async function getPlayerStatistics(playerId: number, season: number = 2026) {
  return fetchWithCache(
    `${API_BASE_URL}/players/statistics?player=${playerId}&season=${season}`,
    PLAYER_CACHE_DURATION
  )
}

// Get player details with photo
export async function getPlayerDetails(playerId: number) {
  return fetchWithCache(
    `${API_BASE_URL}/players?id=${playerId}`,
    PLAYER_CACHE_DURATION
  )
}

// Get team squad
export async function getTeamSquad(teamId: number, season: number = 2026) {
  return fetchWithCache(
    `${API_BASE_URL}/players/squads?team=${teamId}&season=${season}`,
    PLAYER_CACHE_DURATION
  )
}

// Get fixture statistics
export async function getFixtureStatistics(fixtureId: string) {
  return fetchWithCache(
    `${API_BASE_URL}/fixtures/statistics?fixture=${fixtureId}`,
    LINEUP_CACHE_DURATION
  )
}

// Get fixture events (goals, cards, substitutions)
export async function getFixtureEvents(fixtureId: string) {
  return fetchWithCache(
    `${API_BASE_URL}/fixtures/events?fixture=${fixtureId}`,
    300000 // 5 minutes - events can change during match
  )
}

// Get predictions for a fixture
export async function getFixturePredictions(fixtureId: string) {
  return fetchWithCache(
    `${API_BASE_URL}/predictions?fixture=${fixtureId}`,
    LINEUP_CACHE_DURATION
  )
}

// Get head-to-head between two teams
export async function getHeadToHead(team1Id: number, team2Id: number) {
  return fetchWithCache(
    `${API_BASE_URL}/fixtures/headtohead?h2h=${team1Id}-${team2Id}`,
    LINEUP_CACHE_DURATION
  )
}

// Get all teams to map team names to IDs
export async function getTeams() {
  return fetchWithCache(
    `${API_BASE_URL}/teams`,
    TEAM_CACHE_DURATION
  )
}
