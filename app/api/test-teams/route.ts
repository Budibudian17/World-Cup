import { NextResponse } from 'next/server'
import { getNationalTeams } from '@/lib/api-football-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filterNational = searchParams.get('national') === 'true'

    const results = await getNationalTeams()
    
    // Filter for national teams if requested
    const teams = filterNational 
      ? results.response?.filter((team: any) => team.team?.national === true)
      : results.response

    return NextResponse.json({
      total: results.results,
      nationalCount: results.response?.filter((team: any) => team.team?.national === true).length,
      teams: teams?.slice(0, 50) // Return first 50 teams
    })
  } catch (error) {
    console.error('Error getting teams:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
