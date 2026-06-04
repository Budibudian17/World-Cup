import { NextResponse } from 'next/server'
import { getGames } from '@/lib/wc26-client'

export async function GET() {
  try {
    const data = await getGames()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching games:', error)
    
    // nge Return data fallback kalo API gagal
    const fallbackData = {
      games: [
        {
          id: "1",
          home_team_id: "1",
          away_team_id: "2",
          home_score: null,
          away_score: null,
          home_scorers: "null",
          away_scorers: "null",
          group: "A",
          matchday: "1",
          local_date: "06/11/2026 18:00",
          persian_date: "1405-03-21 18:00",
          stadium_id: "1",
          finished: "FALSE",
          time_elapsed: "notstarted",
          type: "group",
          home_team_name_en: "United States",
          home_team_name_fa: "ایالات متحده",
          away_team_name_en: "Morocco",
          away_team_name_fa: "مراکش"
        },
        {
          id: "2",
          home_team_id: "3",
          away_team_id: "4",
          home_score: null,
          away_score: null,
          home_scorers: "null",
          away_scorers: "null",
          group: "A",
          matchday: "1",
          local_date: "06/12/2026 15:00",
          persian_date: "1405-03-22 15:00",
          stadium_id: "2",
          finished: "FALSE",
          time_elapsed: "notstarted",
          type: "group",
          home_team_name_en: "Mexico",
          home_team_name_fa: "مکزیک",
          away_team_name_en: "Canada",
          away_team_name_fa: "کانادا"
        },
        {
          id: "3",
          home_team_id: "5",
          away_team_id: "6",
          home_score: null,
          away_score: null,
          home_scorers: "null",
          away_scorers: "null",
          group: "B",
          matchday: "1",
          local_date: "06/13/2026 18:00",
          persian_date: "1405-03-23 18:00",
          stadium_id: "3",
          finished: "FALSE",
          time_elapsed: "notstarted",
          type: "group",
          home_team_name_en: "Brazil",
          home_team_name_fa: "برزیل",
          away_team_name_en: "Argentina",
          away_team_name_fa: "آرژانتین"
        }
      ]
    }
    
    return NextResponse.json(fallbackData)
  }
}
