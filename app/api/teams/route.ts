import { NextResponse } from 'next/server'
import { getTeams } from '@/lib/wc26-client'

export async function GET() {
  try {
    const data = await getTeams()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching teams:', error)
    
    // Return fallback data if API fails
    const fallbackData = {
      teams: [
        { name_en: "United States", flag: "https://flagcdn.com/w80/us.png", fifa_code: "USA", iso2: "US", groups: "A", id: "1" },
        { name_en: "Canada", flag: "https://flagcdn.com/w80/ca.png", fifa_code: "CAN", iso2: "CA", groups: "A", id: "2" },
        { name_en: "Mexico", flag: "https://flagcdn.com/w80/mx.png", fifa_code: "MEX", iso2: "MX", groups: "A", id: "3" },
        { name_en: "Brazil", flag: "https://flagcdn.com/w80/br.png", fifa_code: "BRA", iso2: "BR", groups: "C", id: "4" },
        { name_en: "Argentina", flag: "https://flagcdn.com/w80/ar.png", fifa_code: "ARG", iso2: "AR", groups: "C", id: "5" },
        { name_en: "France", flag: "https://flagcdn.com/w80/fr.png", fifa_code: "FRA", iso2: "FR", groups: "B", id: "6" },
        { name_en: "Germany", flag: "https://flagcdn.com/w80/de.png", fifa_code: "GER", iso2: "DE", groups: "B", id: "7" },
        { name_en: "Spain", flag: "https://flagcdn.com/w80/es.png", fifa_code: "ESP", iso2: "ES", groups: "B", id: "8" },
        { name_en: "England", flag: "https://flagcdn.com/w80/gb-eng.png", fifa_code: "ENG", iso2: "GB-ENG", groups: "B", id: "9" },
        { name_en: "Portugal", flag: "https://flagcdn.com/w80/pt.png", fifa_code: "POR", iso2: "PT", groups: "B", id: "10" },
      ]
    }
    
    return NextResponse.json(fallbackData)
  }
}
