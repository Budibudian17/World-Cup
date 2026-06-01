import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamName: string }> }
) {
  try {
    const { teamName } = await params
    const apiKey = process.env.NEXT_PUBLIC_ZAFRONIX_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 500 })
    }

    const response = await fetch(
      `https://api.zafronix.com/fifa/worldcup/v1/teams/${encodeURIComponent(teamName)}/roster?year=2026`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: 'Failed to fetch team roster' }, { status: response.status })
    }
  } catch (error) {
    console.error('Error fetching team roster:', error)
    return NextResponse.json({ error: 'Failed to fetch team roster' }, { status: 500 })
  }
}
