import { NextResponse } from 'next/server'
import { getHeadToHead } from '@/lib/api-football-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const team1Id = searchParams.get('team1')
    const team2Id = searchParams.get('team2')

    if (!team1Id || !team2Id) {
      return NextResponse.json({ error: 'team1 and team2 are required' }, { status: 400 })
    }

    const h2h = await getHeadToHead(parseInt(team1Id), parseInt(team2Id))
    
    return NextResponse.json({
      team1Id,
      team2Id,
      results: h2h.results,
      response: h2h.response?.slice(0, 5)
    })
  } catch (error) {
    console.error('Error testing H2H:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
