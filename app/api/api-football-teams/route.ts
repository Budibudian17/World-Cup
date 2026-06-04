import { NextResponse } from 'next/server'
import { getTeams } from '@/lib/api-football-client'

// Cache for 24 hours
export const revalidate = 86400

export async function GET() {
  try {
    const teams = await getTeams()
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching API-Football teams:', error)
    return NextResponse.json({ response: [] })
  }
}
