export async function getPlayerPhoto(playerName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(playerName)}&prop=pageimages&pithumbsize=400&format=json&origin=*`,
      { 
        next: { revalidate: 86400 } // Cache 24 jam
      }
    );

    const data = await response.json();
    const pages = data.query.pages;
    const page = Object.values(pages)[0] as any;

    if (page?.thumbnail?.source) {
      return page.thumbnail.source;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching player photo for ${playerName}:`, error);
    return null;
  }
}
