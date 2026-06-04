import { NextResponse } from 'next/server'
import { getFixtureLineups } from '@/lib/api-football-client'

// Cache for 24 hours
export const revalidate = 86400

// Helper function to generate TBA players with horizontal field positions
function generateTBAPlayers(teamName: string, isHome: boolean, fixtureId: string) {
  const positions = ['G', 'D', 'D', 'D', 'D', 'M', 'M', 'M', 'F', 'F', 'F']
  const baseId = isHome ? 1 : 100
  
  // Use fixtureId hash for yOffset so both teams have the same vertical alignment
  const fixtureHash = fixtureId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const yOffset = (fixtureHash % 8) + 5  // Offset between 5-12 to move players down
  
  // Horizontal field positions (goals left/right)
  // Home team: goalkeeper at left (x: 5), facing right
  // Away team: goalkeeper at right (x: 95), facing left
  // Y positions moved down by adding yOffset, capped at 95
  const homePositions = [
    { x: 5, y: Math.min(50 + yOffset, 95) },   // GK
    { x: 25, y: Math.min(20 + yOffset, 95) },  // LB
    { x: 25, y: Math.min(40 + yOffset, 95) },  // CB
    { x: 25, y: Math.min(60 + yOffset, 95) },  // CB
    { x: 25, y: Math.min(80 + yOffset, 95) },  // RB
    { x: 40, y: Math.min(35 + yOffset, 95) },  // CM
    { x: 40, y: Math.min(50 + yOffset, 95) },  // CM
    { x: 40, y: Math.min(65 + yOffset, 95) },  // CM
    { x: 45, y: Math.min(25 + yOffset, 95) },  // LW
    { x: 45, y: Math.min(50 + yOffset, 95) },  // ST
    { x: 45, y: Math.min(75 + yOffset, 95) },  // RW
  ]
  
  const awayPositions = [
    { x: 95, y: Math.min(50 + yOffset, 95) },  // GK
    { x: 75, y: Math.min(20 + yOffset, 95) },  // LB
    { x: 75, y: Math.min(40 + yOffset, 95) },  // CB
    { x: 75, y: Math.min(60 + yOffset, 95) },  // CB
    { x: 75, y: Math.min(80 + yOffset, 95) },  // RB
    { x: 60, y: Math.min(35 + yOffset, 95) },  // CM
    { x: 60, y: Math.min(50 + yOffset, 95) },  // CM
    { x: 60, y: Math.min(65 + yOffset, 95) },  // CM
    { x: 55, y: Math.min(25 + yOffset, 95) },  // LW
    { x: 55, y: Math.min(50 + yOffset, 95) },  // ST
    { x: 55, y: Math.min(75 + yOffset, 95) },  // RW
  ]
  
  return positions.map((pos, index) => ({
    player: {
      id: baseId + index,
      name: `TBA Player ${index + 1}`,
      number: index + 1,
      photo: null,
      pos: pos
    },
    position: isHome ? homePositions[index] : awayPositions[index]
  }))
}

function generateTBASubstitutes(teamName: string, isHome: boolean) {
  const positions = ['G', 'D', 'M', 'F']
  const baseId = isHome ? 12 : 112
  
  return positions.map((pos, index) => ({
    player: {
      id: baseId + index,
      name: `TBA Sub ${index + 1}`,
      number: 12 + index,
      photo: null,
      pos: pos
    }
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fixtureId = searchParams.get('fixtureId')

  if (!fixtureId) {
    return NextResponse.json({ error: 'fixtureId is required' }, { status: 400 })
  }

  try {
    const data = await getFixtureLineups(fixtureId)
    
    // Check if API returned empty or invalid data
    if (!data || !data.response || data.response.length === 0) {
      console.log('API returned empty lineup data, using fallback')
      throw new Error('Empty lineup data from API')
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching lineups:', error)
    
    // Fetch match data to get actual team names
    let homeTeamName = "Home Team"
    let awayTeamName = "Away Team"
    let homeTeamFlag = null
    let awayTeamFlag = null
    
    try {
      const gamesRes = await fetch('https://worldcup26.ir/get/games')
      const gamesData = gamesRes.ok ? await gamesRes.json() : { games: [] }
      const matchData = gamesData.games.find((m: any) => m.id === fixtureId)
      
      if (matchData) {
        homeTeamName = matchData.home_team_name_en || "Home Team"
        awayTeamName = matchData.away_team_name_en || "Away Team"
        
        // Get team flags
        const teamsRes = await fetch('https://worldcup26.ir/get/teams')
        const teamsData = teamsRes.ok ? await teamsRes.json() : { teams: [] }
        const homeTeam = teamsData.teams.find((t: any) => t.name_en === homeTeamName)
        const awayTeam = teamsData.teams.find((t: any) => t.name_en === awayTeamName)
        
        if (homeTeam) {
          homeTeamFlag = typeof homeTeam.flag === 'string' ? homeTeam.flag : homeTeam.flag?.flagUrl
        }
        if (awayTeam) {
          awayTeamFlag = typeof awayTeam.flag === 'string' ? awayTeam.flag : awayTeam.flag?.flagUrl
        }
      }
    } catch (fetchError) {
      console.error('Error fetching match data:', fetchError)
    }
    
    // Return dynamic fallback data based on actual match
    const fallbackData = {
      response: [
        {
          team: {
            id: 1,
            name: homeTeamName,
            logo: homeTeamFlag || "https://flagcdn.com/w80/us.png"
          },
          coach: {
            id: 1,
            name: "TBA Coach",
            photo: null
          },
          formation: "4-3-3",
          startXI: generateTBAPlayers(homeTeamName, true, fixtureId),
          substitutes: generateTBASubstitutes(homeTeamName, true)
        },
        {
          team: {
            id: 2,
            name: awayTeamName,
            logo: awayTeamFlag || "https://flagcdn.com/w80/ma.png"
          },
          coach: {
            id: 2,
            name: "TBA Coach",
            photo: null
          },
          formation: "4-3-3",
          startXI: generateTBAPlayers(awayTeamName, false, fixtureId),
          substitutes: generateTBASubstitutes(awayTeamName, false)
        }
      ]
    }
    
    return NextResponse.json(fallbackData)
  }
}
