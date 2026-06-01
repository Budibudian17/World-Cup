import { generateText } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export async function POST(request: Request) {
  try {
    const { teamA, teamB } = await request.json()

    if (!teamA || !teamB) {
      return Response.json({ error: 'Both teams are required' }, { status: 400 })
    }

    const { text } = await generateText({
      model: gateway('anthropic/claude-sonnet-4-20250514'),
      system: 'You are a FIFA football analyst. Respond ONLY in valid JSON. No markdown, no backticks.',
      prompt: `Analyse a FIFA World Cup 2026 match between ${teamA} and ${teamB}.
Return JSON with: { "predictedScore": string (format "X - Y"), "teamAWin": number (percentage 0-100), "draw": number (percentage 0-100), "teamBWin": number (percentage 0-100), "teamAxG": number (expected goals, 0-5), "teamBxG": number (expected goals, 0-5), "teamAShotsOnTarget": number (0-15), "teamBShotsOnTarget": number (0-15), "teamAPossession": number (percentage, ensure both teams add to 100), "teamBPossession": number (percentage), "teamAKeyPlayer": string (full player name), "teamBKeyPlayer": string (full player name), "tacticalSummary": string (2-3 sentences of tactical analysis) }

Make sure teamAWin + draw + teamBWin = 100 and teamAPossession + teamBPossession = 100.`,
    })

    const result = JSON.parse(text)
    
    return Response.json(result)
  } catch (error) {
    console.error('Prediction error:', error)
    return Response.json({ error: 'Failed to generate prediction' }, { status: 500 })
  }
}
