// WC26 API Client with caching

const CACHE_DURATION = 3600000 // 1 hour in milliseconds
const STADIUMS_CACHE_DURATION = 172800000 // 48 hours in milliseconds

interface CacheEntry {
  data: any
  timestamp: number
}

const cache = new Map<string, CacheEntry>()

async function fetchWithCache(url: string, key: string, customCacheDuration?: number): Promise<any> {
  const now = Date.now()
  const cached = cache.get(key)
  const cacheDuration = customCacheDuration || CACHE_DURATION
  
  // Return cached data if still valid
  if (cached && now - cached.timestamp < cacheDuration) {
    return cached.data
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`)
    }
    
    const data = await response.json()
    
    // Cache the data
    cache.set(key, {
      data,
      timestamp: now,
    })
    
    return data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    
    // Return cached data even if expired if available
    if (cached) {
      return cached.data
    }
    
    throw error
  }
}

export async function getTeams() {
  return fetchWithCache('https://worldcup26.ir/get/teams', 'teams')
}

export async function getStadiums() {
  return fetchWithCache('https://worldcup26.ir/get/stadiums', 'stadiums', STADIUMS_CACHE_DURATION)
}

export async function getGames() {
  return fetchWithCache('https://worldcup26.ir/get/games', 'games')
}

export async function getGroups() {
  return fetchWithCache('https://worldcup26.ir/get/groups', 'groups')
}
