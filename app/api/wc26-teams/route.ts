import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
    
    if (!apiKey) {
      throw new Error('RAPIDAPI_KEY not found')
    }

    const response = await fetch('https://world-cup-2026.p.rapidapi.com/world-cup-2026/teams', {
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
    console.error('Error fetching WC26 teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams data' },
      { status: 500 }
    )
  }
}
