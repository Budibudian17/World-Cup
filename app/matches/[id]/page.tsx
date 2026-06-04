'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { LineupField } from '@/components/lineup-field'
import { MapPin, Calendar, Clock } from 'lucide-react'
import type { Match } from '@/lib/types'

interface LineupData {
  response: Array<{
    team: {
      id: number
      name: string
      logo: string
    }
    coach: {
      id: number
      name: string
      photo: string | null
    }
    formation: string
    startXI: Array<{
      player: {
        id: number
        name: string
        number: number
        photo: string
        pos: string
      }
      position?: {
        x: number
        y: number
      }
    }>
    substitutes: Array<{
      player: {
        id: number
        name: string
        number: number
        photo: string
        pos: string
      }
    }>
  }>
}

interface PredictionData {
  response: Array<{
    teams: {
      home: {
        id: number
        name: string
        winner: string | null
      }
      away: {
        id: number
        name: string
        winner: string | null
      }
    }
    predictions: {
      winner: {
        id: number
        name: string
        comment: string
      }
      win_or_draw: {
        home: number
        draw: number
        away: number
      }
      percentage: {
        home: number
        draw: number
        away: number
      }
    }
  }>
}

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  // Fetch match data
  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ['match', resolvedParams.id],
    queryFn: async () => {
      const gamesRes = await fetch('/api/games')
      const gamesData = gamesRes.ok ? await gamesRes.json() : { games: [] }
      return gamesData.games.find((m: any) => m.id === resolvedParams.id)
    },
  })

  // Fetch stadiums
  const { data: stadiumsData } = useQuery({
    queryKey: ['stadiums'],
    queryFn: async () => {
      const stadiumsRes = await fetch('/api/stadiums')
      return stadiumsRes.ok ? await stadiumsRes.json() : { stadiums: [] }
    },
  })

  // Fetch teams
  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const teamsRes = await fetch('/api/teams')
      return teamsRes.ok ? await teamsRes.json() : { teams: [] }
    },
  })

  // Fetch API-Football teams for mapping
  const { data: apiFootballTeams } = useQuery({
    queryKey: ['api-football-teams'],
    queryFn: async () => {
      const teamsRes = await fetch('/api/api-football-teams')
      return teamsRes.ok ? await teamsRes.json() : { response: [] }
    },
  })

  // Fetch lineups
  const { data: lineups } = useQuery({
    queryKey: ['lineups', resolvedParams.id],
    queryFn: async () => {
      const lineupsRes = await fetch(`/api/lineups?fixtureId=${resolvedParams.id}`)
      const data = await lineupsRes.json()
      console.log('Lineups data:', data)
      return data
    },
  })

  // Fetch predictions
  const { data: predictions } = useQuery({
    queryKey: ['predictions', resolvedParams.id],
    queryFn: async () => {
      const predictionsRes = await fetch(`/api/predictions?fixtureId=${resolvedParams.id}`)
      const data = await predictionsRes.json()
      console.log('Predictions data:', data)
      return data
    },
  })

  // Fetch head-to-head data
  const { data: h2h } = useQuery({
    queryKey: ['h2h', matchData?.home_team_name_en, matchData?.away_team_name_en],
    queryFn: async () => {
      if (!matchData?.home_team_name_en || !matchData?.away_team_name_en) return null

      // Map team names to API-Football team IDs
      const teamMap: Record<string, number> = {}
      apiFootballTeams?.response?.forEach((team: any) => {
        teamMap[team.name.toLowerCase()] = team.id
      })

      const homeTeamId = teamMap[matchData.home_team_name_en.toLowerCase()]
      const awayTeamId = teamMap[matchData.away_team_name_en.toLowerCase()]

      if (!homeTeamId || !awayTeamId) {
        console.log('Could not map team names to IDs:', matchData.home_team_name_en, matchData.away_team_name_en)
        return null
      }

      const h2hRes = await fetch(`/api/headtohead?team1Id=${homeTeamId}&team2Id=${awayTeamId}`)
      const data = await h2hRes.json()
      console.log('H2H data:', data)
      console.log('Mapped team IDs:', homeTeamId, awayTeamId)
      return data
    },
    enabled: !!matchData?.home_team_name_en && !!matchData?.away_team_name_en && !!apiFootballTeams?.response,
  })

  // Calculate percentages from H2H data if API predictions is empty
  const calculatedPercentages = (() => {
    // Use API predictions if available
    if (predictions?.response?.[0]?.predictions?.percentage) {
      return predictions.response[0].predictions.percentage
    }

    // Calculate from H2H data
    if (h2h?.response && h2h.response.length > 0) {
      let homeWins = 0
      let awayWins = 0
      let draws = 0

      h2h.response.forEach((match: any) => {
        if (match.teams.home.winner === 'home') homeWins++
        else if (match.teams.home.winner === 'away') awayWins++
        else draws++
      })

      const total = homeWins + awayWins + draws
      if (total > 0) {
        return {
          home: Math.round((homeWins / total) * 100),
          draw: Math.round((draws / total) * 100),
          away: Math.round((awayWins / total) * 100)
        }
      }
    }

    // Fallback to default values
    return { home: 33, draw: 34, away: 33 }
  })()

  // Process match data
  const match = matchData ? (() => {
    const stadiumMap: Record<string, string> = {}
    stadiumsData?.stadiums?.forEach((stadium: any) => {
      stadiumMap[stadium.id] = stadium.name_en
    })

    const flagMap: Record<string, string> = {}
    teamsData?.teams?.forEach((team: any) => {
      const flagUrl = typeof team.flag === 'string' ? team.flag : team.flag?.flagUrl
      if (flagUrl && team.name_en) {
        flagMap[team.name_en] = flagUrl
      }
    })

    const [datePart, timePart] = matchData.local_date.split(' ')
    const [month, day, year] = datePart.split('/')
    const [hours, minutes] = timePart.split(':')
    const matchDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`)
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const formattedDate = matchDate.toLocaleDateString('en-CA', { timeZone: userTimezone })
    const formattedTime = matchDate.toLocaleTimeString('en-US', { 
      timeZone: userTimezone,
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })

    const isLive = matchData.time_elapsed !== 'notstarted' && matchData.finished === 'FALSE'

    return {
      id: matchData.id,
      teamA: { 
        name: matchData.home_team_name_en, 
        code: matchData.home_team_name_en?.substring(0, 3).toUpperCase() || 'TBA', 
        flag: '🏳️', 
        group: matchData.group || '' 
      },
      teamB: { 
        name: matchData.away_team_name_en, 
        code: matchData.away_team_name_en?.substring(0, 3).toUpperCase() || 'TBA', 
        flag: '🏳️', 
        group: matchData.group || '' 
      },
      scoreA: matchData.home_score ? parseInt(matchData.home_score) : null,
      scoreB: matchData.away_score ? parseInt(matchData.away_score) : null,
      venue: stadiumMap[matchData.stadium_id] || 'TBA',
      date: formattedDate,
      time: formattedTime,
      isLive: isLive,
      minute: isLive && matchData.time_elapsed !== 'notstarted' ? parseInt(matchData.time_elapsed) : 0,
      finished: matchData.finished,
      matchday: matchData.matchday,
      flagUrlA: flagMap[matchData.home_team_name_en] || null,
      flagUrlB: flagMap[matchData.away_team_name_en] || null,
    }
  })() : null

  if (matchLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!match) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Match not found</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 md:py-12 bg-card border-b border-border">
          <div className="max-w-[1280px] mx-auto px-4">
            <h1 className="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground text-center">
              {match.teamA.name} vs {match.teamB.name}
            </h1>
          </div>
        </section>

        {/* Match Info */}
        <section className="py-6 bg-card/50 border-b border-border">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{match.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{match.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{match.venue}</span>
              </div>
              {match.isLive && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-wc-live-red animate-pulse-live" />
                  <span className="text-wc-live-red font-bold">Live {match.minute}'</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Lineups */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border" />
              <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-2xl uppercase tracking-wide text-foreground">
                Lineups
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            {lineups && lineups.response && lineups.response.length >= 2 ? (
              <LineupField 
                homeTeam={lineups.response[0]} 
                awayTeam={lineups.response[1]}
                homeFlagUrl={match.flagUrlA}
                awayFlagUrl={match.flagUrlB}
                homeTeamName={match.teamA.name}
                awayTeamName={match.teamB.name}
                betweenFieldAndSubstitutes={
                  <div className="w-full">
                    {/* Combined percentage bar - full width, thinner */}
                    <div className="h-4 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-wc-gold transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${calculatedPercentages.home}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {calculatedPercentages.home}%
                        </span>
                      </div>
                      <div 
                        className="bg-gray-400 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${calculatedPercentages.draw}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {calculatedPercentages.draw}%
                        </span>
                      </div>
                      <div 
                        className="bg-blue-400 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${calculatedPercentages.away}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {calculatedPercentages.away}%
                        </span>
                      </div>
                    </div>

                    {/* Team labels with flags */}
                    <div className="flex justify-between items-center text-sm mt-2">
                      <div className="flex items-center gap-2">
                        {match.flagUrlA && (
                          <img 
                            src={match.flagUrlA} 
                            alt={match.teamA.name}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span className="font-semibold">{match.teamA.name}</span>
                      </div>
                      <span className="font-semibold text-muted-foreground">Draw</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{match.teamB.name}</span>
                        {match.flagUrlB && (
                          <img 
                            src={match.flagUrlB} 
                            alt={match.teamB.name}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                }
                belowSubstitutes={
                  h2h?.response && h2h.response.length > 0 ? (
                    <div className="mt-8">
                      <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xl uppercase text-foreground mb-4">
                          Head to Head History
                        </h3>
                        <div className="space-y-3">
                          {h2h.response.slice(0, 5).map((match: any) => (
                            <div key={match.fixture.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(match.fixture.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="font-semibold text-sm">{match.teams.home.name}</span>
                                <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg">
                                  {match.goals.home} - {match.goals.away}
                                </span>
                                <span className="font-semibold text-sm">{match.teams.away.name}</span>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                match.teams.home.winner === 'home' ? 'bg-wc-gold/20 text-wc-gold' :
                                match.teams.home.winner === 'away' ? 'bg-blue-400/20 text-blue-400' :
                                'bg-gray-400/20 text-gray-400'
                              }`}>
                                {match.teams.home.winner === 'home' ? 'Home Win' :
                                 match.teams.home.winner === 'away' ? 'Away Win' : 'Draw'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null
                }
              />
            ) : null}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
