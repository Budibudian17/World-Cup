// Simple in-memory cache to avoid repeated failed requests
const photoCache = new Map<string, string | null>()
const failedRequests = new Set<string>()

export async function getPlayerPhoto(playerName: string): Promise<string | null> {
  // Check cache first
  if (photoCache.has(playerName)) {
    return photoCache.get(playerName)!
  }

  // Skip if we already tried and failed
  if (failedRequests.has(playerName)) {
    return null
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(playerName)}&prop=pageimages&pithumbsize=400&format=json&origin=*`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId)

    if (!response.ok) {
      failedRequests.add(playerName)
      return null;
    }

    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      const pages = data.query.pages;
      const page = Object.values(pages)[0] as any;

      if (page?.thumbnail?.source) {
        photoCache.set(playerName, page.thumbnail.source)
        return page.thumbnail.source;
      }
    } catch (jsonError) {
      console.error(`Error parsing JSON for ${playerName}:`, jsonError);
      failedRequests.add(playerName)
      return null;
    }

    failedRequests.add(playerName)
    return null;
  } catch (error) {
    console.error(`Error fetching player photo for ${playerName}:`, error);
    failedRequests.add(playerName)
    return null;
  }
}
