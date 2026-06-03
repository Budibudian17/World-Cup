import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
    
    if (!apiKey) {
      throw new Error('RAPIDAPI_KEY not found')
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')

    const url = teamId 
      ? `https://world-cup-2026.p.rapidapi.com/world-cup-2026/players?teamId=${teamId}`
      : 'https://world-cup-2026.p.rapidapi.com/world-cup-2026/players'

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'world-cup-2026.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching WC26 players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players data' },
      { status: 500 }
    )
  }
}
