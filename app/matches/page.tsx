'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { MatchCard } from '@/components/match-card'
import { HelpCircle } from 'lucide-react'
import type { Match } from '@/lib/types'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({})

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/games')
        if (response.ok) {
          const data = await response.json()
          
          // Get stadiums
          const stadiumsRes = await fetch('/api/stadiums')
          const stadiumsData = stadiumsRes.ok ? await stadiumsRes.json() : { stadiums: [] }
          const stadiumMap: Record<string, string> = {}
          stadiumsData.stadiums.forEach((stadium: any) => {
            stadiumMap[stadium.id] = stadium.name_en
          })

          // Fetch teams to get flag URLs
          const teamsRes = await fetch('/api/teams')
          const teamsData = teamsRes.ok ? await teamsRes.json() : { teams: [] }
          const flagMap: Record<string, string> = {}
          teamsData.teams.forEach((team: any) => {
            // Handle both API formats: direct string URL or object with flagUrl
            const flagUrl = typeof team.flag === 'string' ? team.flag : team.flag?.flagUrl
            if (flagUrl && team.name_en) {
              flagMap[team.name_en] = flagUrl
            }
          })

          // Transform API data to match Match type
          const transformedMatches = data.games
            .filter((match: any) => match.home_team_name_en !== 'TBA' && match.away_team_name_en !== 'TBA')
            .map((match: any) => {
              const isLive = match.time_elapsed !== 'notstarted' && match.finished === 'FALSE'
              
              // Parse date - API returns format like "06/11/2026 18:00"
              const [datePart, timePart] = match.local_date.split(' ')
              const [month, day, year] = datePart.split('/')
              const [hours, minutes] = timePart.split(':')
              
              // Create Date object (assuming UTC from API)
              const matchDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`)
              
              // Convert to user's local timezone
              const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
              const formattedDate = matchDate.toLocaleDateString('en-CA', { timeZone: userTimezone })
              const formattedTime = matchDate.toLocaleTimeString('en-US', { 
                timeZone: userTimezone,
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })
              
              return {
                id: match.id,
                teamA: { 
                  name: match.home_team_name_en, 
                  code: match.home_team_name_en?.substring(0, 3).toUpperCase() || 'TBA', 
                  flag: '🏳️', 
                  group: match.group || '' 
                },
                teamB: { 
                  name: match.away_team_name_en, 
                  code: match.away_team_name_en?.substring(0, 3).toUpperCase() || 'TBA', 
                  flag: '🏳️', 
                  group: match.group || '' 
                },
                scoreA: match.home_score ? parseInt(match.home_score) : null,
                scoreB: match.away_score ? parseInt(match.away_score) : null,
                venue: stadiumMap[match.stadium_id] || 'TBA',
                date: formattedDate,
                time: formattedTime,
                isLive: isLive,
                minute: isLive && match.time_elapsed !== 'notstarted' ? parseInt(match.time_elapsed) : 0,
                finished: match.finished,
                matchday: match.matchday,
                type: match.type,
                flagUrlA: flagMap[match.home_team_name_en] || null,
                flagUrlB: flagMap[match.away_team_name_en] || null,
              }
            })

          setMatches(transformedMatches)

          // Group matches by stage (group stage by matchday, knockout by round)
          const grouped: Record<string, Match[]> = {}
          transformedMatches.forEach((match: any) => {
            let groupKey: string
            
            if (match.type === 'group') {
              groupKey = `Matchday ${match.matchday}`
            } else {
              // Knockout stages - map to round names
              const roundMap: Record<string, string> = {
                'round_of_16': 'Round of 16',
                'quarter_final': 'Quarter-Finals',
                'semi_final': 'Semi-Finals',
                'final': 'Final'
              }
              groupKey = roundMap[match.type] || match.type
            }
            
            if (!grouped[groupKey]) {
              grouped[groupKey] = []
            }
            grouped[groupKey].push(match)
          })

          setGroupedMatches(grouped)
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 md:py-20 bg-card border-b border-border">
          <div className="max-w-[1280px] mx-auto px-4">
            <SectionTag>Matches</SectionTag>
            <h1 className="mt-3 font-[family-name:var(--font-barlow-condensed)] font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-foreground">
              All Matches
            </h1>
            <p className="mt-4 font-sans text-lg text-muted-foreground">
              Complete schedule of World Cup 2026 matches
            </p>
          </div>
        </section>

        {/* Matches by Matchday */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading matches...</p>
              </div>
            ) : Object.keys(groupedMatches).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No matches available</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedMatches)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([matchday, matches]) => (
                    <div key={matchday}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1 bg-border" />
                        <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-2xl uppercase tracking-wide text-foreground">
                          {matchday}
                        </h2>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="flex flex-wrap justify-center gap-4">
                        {matches.map((match) => (
                          <MatchCard key={match.id} match={match} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
