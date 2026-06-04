import { NextResponse } from 'next/server'
import { getFixturePredictions } from '@/lib/api-football-client'

// Cache for 24 hours
export const revalidate = 86400

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fixtureId = searchParams.get('fixtureId')

    if (!fixtureId) {
      return NextResponse.json({ error: 'fixtureId is required' }, { status: 400 })
    }

    const predictions = await getFixturePredictions(fixtureId)
    return NextResponse.json(predictions)
  } catch (error) {
    console.error('Error fetching predictions:', error)
    
    // Return fallback data
    const fallbackData = {
      response: [{
        teams: {
          home: {
            id: 0,
            name: 'TBA',
            winner: null
          },
          away: {
            id: 0,
            name: 'TBA',
            winner: null
          }
        },
        comparison: {
          form: {
            home: 50,
            away: 50
          },
          att: {
            home: 50,
            away: 50
          },
          def: {
            home: 50,
            away: 50
          },
          h2h: {
            home: 50,
            away: 50
          },
          goals: {
            home: 50,
            away: 50
          }
        },
        predictions: {
          winner: {
            id: 0,
            name: 'Draw',
            comment: 'Prediction not available'
          },
          win_or_draw: {
            home: 33,
            draw: 34,
            away: 33
          },
          under_over: {
            over: 50,
            under: 50
          },
          goals: {
            home: 1,
            away: 1,
            total: 2
          },
          percentage: {
            home: 33,
            draw: 34,
            away: 33
          }
        }
      }]
    }
    
    return NextResponse.json(fallbackData)
  }
}
