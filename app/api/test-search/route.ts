import { NextResponse } from 'next/server'
import { searchTeams } from '@/lib/api-football-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'q parameter is required' }, { status: 400 })
    }

    const results = await searchTeams(query)
    
    return NextResponse.json({
      query,
      results: results.results,
      response: results.response
    })
  } catch (error) {
    console.error('Error searching teams:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
