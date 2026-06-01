import { NextResponse } from 'next/server'
import wcHistory from '@/lib/data/worldcup-history.json'

interface WorldCupMatch {
  round: string
  team1: string
  team2: string
  score: {
    ft: number[]
    ht: number[]
    et?: number[]
    p?: number[]
  }
  goals1: Array<{ name: string; minute: number; penalty?: boolean }>
  goals2: Array<{ name: string; minute: number; penalty?: boolean }>
}

interface WorldCupData {
  name: string
  matches: WorldCupMatch[]
}

// Type assertion for the imported JSON
const wcHistoryData = wcHistory as unknown as Record<string, WorldCupData>

// Map of country names to their variations in the OpenFootball data
const countryNameMap: Record<string, string[]> = {
  'United States': ['USA', 'United States'],
  'Brazil': ['Brazil', 'Brasil'],
  'Argentina': ['Argentina'],
  'France': ['France'],
  'Germany': ['Germany', 'West Germany', 'FRG'],
  'Spain': ['Spain'],
  'England': ['England'],
  'Portugal': ['Portugal'],
  'Canada': ['Canada'],
  'Mexico': ['Mexico'],
  'Netherlands': ['Netherlands', 'Holland'],
  'Italy': ['Italy'],
  'Uruguay': ['Uruguay'],
  'Belgium': ['Belgium'],
  'Croatia': ['Croatia'],
  'Poland': ['Poland'],
  'Sweden': ['Sweden'],
  'Switzerland': ['Switzerland'],
  'Denmark': ['Denmark'],
  'Norway': ['Norway'],
  'Austria': ['Austria'],
  'Czech Republic': ['Czech Republic', 'Czechoslovakia'],
  'Slovakia': ['Slovakia'],
  'Serbia': ['Serbia', 'Yugoslavia'],
  'Russia': ['Russia', 'Soviet Union', 'USSR'],
  'Ukraine': ['Ukraine'],
  'Turkey': ['Turkey'],
  'Greece': ['Greece'],
  'Romania': ['Romania'],
  'Bulgaria': ['Bulgaria'],
  'Hungary': ['Hungary'],
  'Wales': ['Wales'],
  'Scotland': ['Scotland'],
  'Northern Ireland': ['Northern Ireland'],
  'Ireland': ['Ireland', 'Republic of Ireland'],
  'Iceland': ['Iceland'],
  'Finland': ['Finland'],
  'South Korea': ['South Korea', 'Korea Republic'],
  'Japan': ['Japan'],
  'Saudi Arabia': ['Saudi Arabia'],
  'Australia': ['Australia'],
  'New Zealand': ['New Zealand'],
  'Iran': ['Iran'],
  'Iraq': ['Iraq'],
  'United Arab Emirates': ['United Arab Emirates', 'UAE'],
  'Qatar': ['Qatar'],
  'Morocco': ['Morocco'],
  'Egypt': ['Egypt'],
  'Tunisia': ['Tunisia'],
  'Algeria': ['Algeria'],
  'Nigeria': ['Nigeria'],
  'Ghana': ['Ghana'],
  'Ivory Coast': ['Ivory Coast', "Côte d'Ivoire"],
  'Senegal': ['Senegal'],
  'Cameroon': ['Cameroon'],
  'South Africa': ['South Africa'],
  'Angola': ['Angola'],
  'Togo': ['Togo'],
  'Costa Rica': ['Costa Rica'],
  'Panama': ['Panama'],
  'Jamaica': ['Jamaica'],
  'Trinidad and Tobago': ['Trinidad and Tobago'],
  'Honduras': ['Honduras'],
  'El Salvador': ['El Salvador'],
  'Colombia': ['Colombia'],
  'Ecuador': ['Ecuador'],
  'Peru': ['Peru'],
  'Paraguay': ['Paraguay'],
  'Chile': ['Chile'],
  'Bolivia': ['Bolivia'],
  'Venezuela': ['Venezuela'],
  'China': ['China', 'PR China'],
  'North Korea': ['North Korea', 'Korea DPR'],
  'Indonesia': ['Indonesia', 'Dutch East Indies'],
  'Philippines': ['Philippines'],
  'Israel': ['Israel'],
  'Cuba': ['Cuba'],
  'Haiti': ['Haiti'],
  'Curaçao': ['Curaçao', 'Netherlands Antilles'],
}

function getCountryVariations(country: string): string[] {
  return countryNameMap[country] || [country]
}

function findTeamInMatch(match: WorldCupMatch, countryVariations: string[]): boolean {
  return countryVariations.includes(match.team1) || countryVariations.includes(match.team2)
}

function getTeamResult(match: WorldCupMatch, countryVariations: string[]): string {
  const isTeam1 = countryVariations.includes(match.team1)
  const isTeam2 = countryVariations.includes(match.team2)
  
  if (!isTeam1 && !isTeam2) return 'Unknown'
  
  const teamScore = isTeam1 ? match.score.ft[0] : match.score.ft[1]
  const opponentScore = isTeam1 ? match.score.ft[1] : match.score.ft[0]
  
  // Check for penalty shootout
  if (match.score.p && match.score.p.length > 0) {
    const teamPenalties = isTeam1 ? match.score.p[0] : match.score.p[1]
    const opponentPenalties = isTeam1 ? match.score.p[1] : match.score.p[0]
    
    if (teamPenalties > opponentPenalties) {
      return 'Won on penalties'
    } else {
      return 'Lost on penalties'
    }
  }
  
  // Check for extra time
  if (match.score.et && match.score.et.length > 0) {
    const teamScoreET = isTeam1 ? match.score.et[0] : match.score.et[1]
    const opponentScoreET = isTeam1 ? match.score.et[1] : match.score.et[0]
    
    if (teamScoreET > opponentScoreET) {
      return 'Won after extra time'
    } else if (teamScoreET < opponentScoreET) {
      return 'Lost after extra time'
    }
  }
  
  // Regular time result
  if (teamScore > opponentScore) {
    return 'Won'
  } else if (teamScore < opponentScore) {
    return 'Lost'
  } else {
    return 'Draw'
  }
}

function getRoundResult(roundName: string, matches: WorldCupMatch[], countryVariations: string[]): string {
  const teamMatches = matches.filter((m: WorldCupMatch) => findTeamInMatch(m, countryVariations))
  
  if (teamMatches.length === 0) return 'Did not participate'
  
  // Group stages (Matchday 1-3)
  if (roundName.includes('Matchday')) {
    return 'Group Stage'
  }
  
  // Final
  if (roundName === 'Final') {
    const finalMatch = teamMatches[0]
    const result = getTeamResult(finalMatch, countryVariations)
    if (result === 'Won' || result === 'Won on penalties' || result === 'Won after extra time') {
      return 'Champion ⭐'
    } else {
      return 'Runner-up'
    }
  }
  
  // Third-place match
  if (roundName === 'Third-place match') {
    const match = teamMatches[0]
    const result = getTeamResult(match, countryVariations)
    if (result === 'Won' || result === 'Won on penalties' || result === 'Won after extra time') {
      return 'Third Place'
    } else {
      return 'Fourth Place'
    }
  }
  
  if (roundName.includes('Semi-finals') || roundName === 'Semi-finals') {
    return 'Semi-finals'
  }
  
  if (roundName.includes('Quarter-finals') || roundName === 'Quarter-finals') {
    return 'Quarter-finals'
  }
  
  if (roundName.includes('Round of 16') || roundName === 'Round of 16') {
    return 'Round of 16'
  }
  
  return roundName
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params
    const decodedCountry = decodeURIComponent(country)
    console.log('Fetching World Cup history for:', decodedCountry)
    const countryVariations = getCountryVariations(decodedCountry)
    console.log('Country variations:', countryVariations)
    
    const history: Array<{ year: number; result: string }> = []
    
    // Use local combined data instead of fetching from GitHub
    const years = Object.keys(wcHistoryData).map(Number).sort()
    console.log('Available years:', years)
    
    for (const year of years) {
      try {
        const data: WorldCupData = wcHistoryData[year.toString()]
        
        if (!data) continue
        
        // Find if country participated in this World Cup
        let participated = false
        let result = 'Did not participate'
        
        // Group matches by round
        const matchesByRound: Record<string, WorldCupMatch[]> = {}
        for (const match of data.matches) {
          const round = match.round || 'Unknown'
          if (!matchesByRound[round]) {
            matchesByRound[round] = []
          }
          matchesByRound[round].push(match)
        }
        
        // Find the furthest round the country reached
        for (const [roundName, roundMatches] of Object.entries(matchesByRound)) {
          const teamMatches = roundMatches.filter((m: WorldCupMatch) => findTeamInMatch(m, countryVariations))
          
          if (teamMatches.length > 0) {
            participated = true
            result = getRoundResult(roundName, roundMatches, countryVariations)
            // Don't break, we want the furthest round
          }
        }
        
        if (participated) {
          console.log(`${decodedCountry} participated in ${year}: ${result}`)
          history.push({ year, result })
        }
      } catch (error) {
        console.error(`Error processing ${year} data:`, error)
        continue
      }
    }
    
    console.log('Final history for', decodedCountry, ':', history)
    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching World Cup history:', error)
    return NextResponse.json({ error: 'Failed to fetch World Cup history' }, { status: 500 })
  }
}
