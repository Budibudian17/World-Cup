import { NextResponse } from 'next/server'
import { getStadiums } from '@/lib/wc26-client'

export async function GET() {
  try {
    const data = await getStadiums()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching stadiums:', error)
    
    // Return fallback data if API fails
    const fallbackData = {
      stadiums: [
        { name_en: "Lumen Field", fifa_name: "Seattle Stadium", city_en: "Seattle", country_en: "United States", capacity: 69000, region: "Western" },
        { name_en: "Hard Rock Stadium", fifa_name: "Miami Stadium", city_en: "Miami", country_en: "United States", capacity: 65000, region: "Eastern" },
        { name_en: "BC Place", fifa_name: "Vancouver Stadium", city_en: "Vancouver", country_en: "Canada", capacity: 54000, region: "Western" },
        { name_en: "Levi's Stadium", fifa_name: "San Francisco Stadium", city_en: "Santa Clara", country_en: "United States", capacity: 68000, region: "Western" },
        { name_en: "Estadio BBVA", fifa_name: "Monterrey Stadium", city_en: "Monterrey", country_en: "Mexico", capacity: 51000, region: "Central" },
        { name_en: "Estadio Azteca", fifa_name: "Mexico City Stadium", city_en: "Mexico City", country_en: "Mexico", capacity: 83000, region: "Central" },
        { name_en: "Estadio Akron", fifa_name: "Guadalajara Stadium", city_en: "Guadalajara", country_en: "Mexico", capacity: 46000, region: "Central" },
        { name_en: "NRG Stadium", fifa_name: "Houston Stadium", city_en: "Houston", country_en: "United States", capacity: 72000, region: "Southern" },
        { name_en: "SoFi Stadium", fifa_name: "Los Angeles Stadium", city_en: "Inglewood", country_en: "United States", capacity: 70000, region: "Western" },
        { name_en: "Mercedes-Benz Stadium", fifa_name: "Atlanta Stadium", city_en: "Atlanta", country_en: "United States", capacity: 71000, region: "Eastern" },
        { name_en: "Gillette Stadium", fifa_name: "Boston Stadium", city_en: "Foxborough", country_en: "United States", capacity: 66000, region: "Eastern" },
        { name_en: "Arrowhead Stadium", fifa_name: "Kansas City Stadium", city_en: "Kansas City", country_en: "United States", capacity: 76000, region: "Central" },
        { name_en: "Lincoln Financial Field", fifa_name: "Philadelphia Stadium", city_en: "Philadelphia", country_en: "United States", capacity: 69000, region: "Eastern" },
        { name_en: "AT&T Stadium", fifa_name: "Dallas Stadium", city_en: "Arlington", country_en: "United States", capacity: 80000, region: "Southern" },
        { name_en: "MetLife Stadium", fifa_name: "New York Stadium", city_en: "East Rutherford", country_en: "United States", capacity: 82000, region: "Eastern" },
        { name_en: "BMO Field", fifa_name: "Toronto Stadium", city_en: "Toronto", country_en: "Canada", capacity: 30000, region: "Eastern" },
      ]
    }
    
    return NextResponse.json(fallbackData)
  }
}
