import { NextResponse } from 'next/server'
import { getGroups } from '@/lib/wc26-client'

export async function GET() {
  try {
    const groupsData = await getGroups()
    
    // Ambil data team buat dapetin nama dan flag
    const teamsResponse = await fetch('https://worldcup26.ir/get/teams')
    const teamsData = teamsResponse.ok ? await teamsResponse.json() : { teams: [] }
    
    // Buat map team untuk join
    const teamMap: Record<string, { name: string; flag: string }> = {}
    teamsData.teams.forEach((team: any) => {
      if (team.id && team.name_en) {
        teamMap[team.id] = {
          name: team.name_en,
          flag: typeof team.flag === 'string' ? team.flag : team.flag?.flagUrl || null
        }
      }
    })
    
    // nge Join groups dengan team data
    const enrichedGroups = groupsData.groups.map((group: any) => ({
      name: group.name,
      teams: group.teams.map((team: any) => {
        const teamInfo = teamMap[team.team_id]
        return {
          ...team,
          team_name: teamInfo?.name || team.team_id,
          flag: teamInfo?.flag || null
        }
      })
    }))
    
    return NextResponse.json({ groups: enrichedGroups })
  } catch (error) {
    console.error('Error fetching groups:', error)
    
    // nge Return data fallback
    const fallbackData = {
      groups: [
        {
          name: 'A',
          teams: [
            { team_id: '1', team_name: 'Mexico', flag: 'https://flagcdn.com/w80/mx.png', mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
            { team_id: '2', team_name: 'United States', flag: 'https://flagcdn.com/w80/us.png', mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
            { team_id: '3', team_name: 'Canada', flag: 'https://flagcdn.com/w80/ca.png', mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
            { team_id: '4', team_name: 'TBA', flag: null, mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
          ]
        },
        {
          name: 'B',
          teams: [
            { team_id: '5', team_name: 'Spain', flag: 'https://flagcdn.com/w80/es.png', mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
            { team_id: '6', team_name: 'Netherlands', flag: 'https://flagcdn.com/w80/nl.png', mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
            { team_id: '7', team_name: 'TBA', flag: null, mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
            { team_id: '8', team_name: 'TBA', flag: null, mp: '0', w: '0', d: '0', l: '0', gf: '0', ga: '0', gd: '0', pts: '0' },
          ]
        }
      ]
    }
    
    return NextResponse.json(fallbackData)
  }
}
