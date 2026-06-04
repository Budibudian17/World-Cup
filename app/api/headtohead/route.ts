import { NextResponse } from 'next/server'
import { getHeadToHead } from '@/lib/api-football-client'

// Cache for 24 hours
export const revalidate = 86400

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const team1Id = searchParams.get('team1Id')
    const team2Id = searchParams.get('team2Id')

    if (!team1Id || !team2Id) {
      return NextResponse.json({ error: 'team1Id and team2Id are required' }, { status: 400 })
    }

    const h2h = await getHeadToHead(parseInt(team1Id), parseInt(team2Id))
    return NextResponse.json(h2h)
  } catch (error) {
    console.error('Error fetching head-to-head:', error)
    
    // Return fallback data
    const fallbackData = {
      response: []
    }
    
    return NextResponse.json(fallbackData)
  }
}
