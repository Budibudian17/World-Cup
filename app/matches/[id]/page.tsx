'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { LineupField } from '@/components/lineup-field'
import { MapPin, Calendar, Clock, Lock } from 'lucide-react'
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

  // Calculate isWithinH1 from matchData for lineups query (H-1 = 1 day before match)
  const isWithinH1 = matchData ? (() => {
    const [datePart, timePart] = matchData.local_date.split(' ')
    const [month, day, year] = datePart.split('/')
    const [hours, minutes] = timePart.split(':')
    const matchDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`)
    const now = new Date()
    const hoursUntilMatch = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilMatch <= 24 && hoursUntilMatch > -48 // Within 24 hours before or 48 hours after
  })() : false

  // Fetch lineups
  const { data: lineups } = useQuery({
    queryKey: ['lineups', resolvedParams.id],
    queryFn: async () => {
      const lineupsRes = await fetch(`/api/lineups?fixtureId=${resolvedParams.id}`)
      const data = await lineupsRes.json()
      console.log('Lineups data:', data)
      return data
    },
    enabled: isWithinH1,
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

  // Fetch H2H data using FIFA codes
  const { data: h2hData } = useQuery({
    queryKey: ['h2h', matchData?.home_team_name_en, matchData?.away_team_name_en],
    queryFn: async () => {
      console.log('H2H query called for:', matchData?.home_team_name_en, 'vs', matchData?.away_team_name_en)
      
      if (!matchData || !teamsData?.teams) {
        console.log('H2H query skipped: missing matchData or teamsData')
        return null
      }

      // Get FIFA codes from teams data by matching team names
      const homeTeam = teamsData.teams.find((t: any) => t.name_en === matchData.home_team_name_en)
      const awayTeam = teamsData.teams.find((t: any) => t.name_en === matchData.away_team_name_en)

      console.log('Home team found:', homeTeam?.name_en, 'FIFA code:', homeTeam?.fifa_code)
      console.log('Away team found:', awayTeam?.name_en, 'FIFA code:', awayTeam?.fifa_code)

      if (!homeTeam?.fifa_code || !awayTeam?.fifa_code) {
        console.log('H2H query skipped: missing FIFA codes')
        return null
      }

      // Search API-Football for team IDs using FIFA codes
      const homeSearch = await fetch(`/api/test-search?q=${homeTeam.fifa_code}`)
      const homeSearchData = await homeSearch.json()
      let homeApiTeam = homeSearchData.response?.find((t: any) => t.team?.national === true)

      // Fallback: search by team name if FIFA code doesn't find national team
      if (!homeApiTeam) {
        console.log('Home team not found by FIFA code, trying team name:', homeTeam.name_en)
        const homeNameSearch = await fetch(`/api/test-search?q=${homeTeam.name_en}`)
        const homeNameSearchData = await homeNameSearch.json()
        homeApiTeam = homeNameSearchData.response?.find((t: any) => t.team?.national === true)
      }

      const awaySearch = await fetch(`/api/test-search?q=${awayTeam.fifa_code}`)
      const awaySearchData = await awaySearch.json()
      let awayApiTeam = awaySearchData.response?.find((t: any) => t.team?.national === true)

      // Fallback: search by team name if FIFA code doesn't find national team
      if (!awayApiTeam) {
        console.log('Away team not found by FIFA code, trying team name:', awayTeam.name_en)
        const awayNameSearch = await fetch(`/api/test-search?q=${awayTeam.name_en}`)
        const awayNameSearchData = await awayNameSearch.json()
        awayApiTeam = awayNameSearchData.response?.find((t: any) => t.team?.national === true)
      }

      console.log('Home API team ID:', homeApiTeam?.team?.id)
      console.log('Away API team ID:', awayApiTeam?.team?.id)

      if (!homeApiTeam?.team?.id || !awayApiTeam?.team?.id) {
        console.log('H2H query skipped: missing API team IDs')
        return null
      }

      // Fetch H2H using API-Football team IDs
      const h2hRes = await fetch(`/api/test-h2h?team1=${homeApiTeam.team.id}&team2=${awayApiTeam.team.id}`)
      const h2hData = await h2hRes.json()
      console.log('H2H data:', h2hData)

      // Fetch stadium images from Unsplash
      const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      if (unsplashKey && h2hData.response) {
        const stadiumImageMap: Record<string, string> = {}
        const uniqueStadiums = new Set(h2hData.response.map((m: any) => m.fixture.venue?.name).filter(Boolean))

        const imagePromises = Array.from(uniqueStadiums).map(async (stadiumName: unknown) => {
          const name = String(stadiumName)
          try {
            const query = encodeURIComponent(`${name} stadium`)
            const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashKey}&per_page=1&orientation=landscape`)
            if (unsplashResponse.ok) {
              const unsplashData = await unsplashResponse.json()
              if (unsplashData.results?.[0]?.urls?.regular) {
                stadiumImageMap[name] = unsplashData.results[0].urls.regular
              }
            }
          } catch (error) {
            console.error(`Error fetching Unsplash image for ${name}:`, error)
          }
        })

        await Promise.all(imagePromises)

        // Add stadium images to H2H data
        h2hData.response = h2hData.response.map((match: any) => ({
          ...match,
          stadiumImageUrl: match.fixture.venue?.name ? stadiumImageMap[match.fixture.venue.name] : null
        }))
      }

      // Calculate win percentages from H2H data and filter to finished matches only
      if (h2hData.response && h2hData.response.length > 0) {
        // Filter to only finished matches
        const finishedMatches = h2hData.response.filter((match: any) => match.fixture.status.short === 'FT')
        h2hData.response = finishedMatches

        let homeWins = 0
        let awayWins = 0
        let draws = 0

        finishedMatches.forEach((match: any) => {
          if (match.teams.home.winner) {
            homeWins++
          } else if (match.teams.away.winner) {
            awayWins++
          } else {
            draws++
          }
        })

        const total = homeWins + awayWins + draws
        const homeWinPercent = total > 0 ? Math.round((homeWins / total) * 100) : 0
        const awayWinPercent = total > 0 ? Math.round((awayWins / total) * 100) : 0
        const drawPercent = total > 0 ? Math.round((draws / total) * 100) : 0

        h2hData.winPercentages = {
          home: homeWinPercent,
          away: awayWinPercent,
          draw: drawPercent,
          total
        }
      }

      return h2hData
    },
    enabled: !!matchData && !!teamsData?.teams,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

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

    // Check if match is within H-1 (1 day before match)
    const now = new Date()
    const hoursUntilMatch = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    const isWithinH1 = hoursUntilMatch <= 24 && hoursUntilMatch > -48 // Within 24 hours before or 48 hours after

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
      isWithinH1: isWithinH1,
      hoursUntilMatch: hoursUntilMatch,
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

  // Show message if match is not within H-1
  if (!match.isWithinH1) {
    const hoursUntil = Math.ceil(match.hoursUntilMatch || 0)
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
              </div>
            </div>
          </section>

          {/* Restricted Access Message */}
          <section className="py-20">
            <div className="max-w-xl mx-auto px-4 text-center">
              <div className="bg-card border border-border rounded-lg p-6">
                <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground mb-2">
                  Match Details Coming Soon
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Detailed information will be available 1 day before the match.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-wc-gold/10 rounded-md">
                  <Clock className="w-3 h-3 text-wc-gold" />
                  <span className="text-xs font-semibold text-wc-gold">
                    Available in {hoursUntil > 0 ? `${Math.ceil(hoursUntil / 24)} day${Math.ceil(hoursUntil / 24) > 1 ? 's' : ''}` : 'less than a day'}
                  </span>
                </div>
              </div>
            </div>
          </section>
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
                        style={{ width: `${h2hData?.winPercentages?.home || predictions?.response?.[0]?.predictions?.percentage?.home || 33}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {h2hData?.winPercentages?.home || predictions?.response?.[0]?.predictions?.percentage?.home || 33}%
                        </span>
                      </div>
                      <div
                        className="bg-gray-400 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${h2hData?.winPercentages?.draw || predictions?.response?.[0]?.predictions?.percentage?.draw || 34}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {h2hData?.winPercentages?.draw || predictions?.response?.[0]?.predictions?.percentage?.draw || 34}%
                        </span>
                      </div>
                      <div
                        className="bg-blue-400 transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${h2hData?.winPercentages?.away || predictions?.response?.[0]?.predictions?.percentage?.away || 33}%` }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {h2hData?.winPercentages?.away || predictions?.response?.[0]?.predictions?.percentage?.away || 33}%
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
              />
            ) : null}

            {/* H2H History */}
            {h2hData === undefined ? (
              <div className="mt-6">
                <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground mb-4">
                  Head to Head History
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-lg p-4 min-w-[280px] shrink-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-3 bg-secondary rounded animate-pulse" />
                          <div className="w-3 h-3 bg-secondary rounded animate-pulse" />
                          <div className="w-16 h-3 bg-secondary rounded animate-pulse" />
                        </div>
                        <div className="w-8 h-5 bg-secondary rounded animate-pulse" />
                      </div>
                      <div className="w-full h-3 bg-secondary rounded animate-pulse mb-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-secondary rounded animate-pulse" />
                          <div className="w-16 h-3 bg-secondary rounded animate-pulse" />
                        </div>
                        <div className="w-12 h-6 bg-secondary rounded animate-pulse" />
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-3 bg-secondary rounded animate-pulse" />
                          <div className="w-5 h-5 bg-secondary rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : h2hData && h2hData.response && h2hData.response.length > 0 ? (
              <div className="mt-6">
                <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground mb-4">
                  Head to Head History
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[...h2hData.response]
                    .sort((a: any, b: any) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
                    .slice(0, 5)
                    .map((match: any) => (
                    <div key={match.fixture.id} className="bg-card border border-border rounded-lg overflow-hidden min-w-[280px] shrink-0">
                      {match.stadiumImageUrl ? (
                        <div className="h-32 relative">
                          <img 
                            src={match.stadiumImageUrl} 
                            alt={match.fixture.venue?.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      ) : null}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">{new Date(match.fixture.date).toLocaleDateString()}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{match.league.name}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            match.fixture.status.short === 'FT' ? 'bg-green-500/20 text-green-400' :
                            match.fixture.status.short === 'NS' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {match.fixture.status.short}
                          </span>
                        </div>
                        {match.fixture.venue && (
                          <div className="text-xs text-muted-foreground mb-2">
                            {match.fixture.venue.name}, {match.fixture.venue.city}
                            {match.fixture.referee && ` • Ref: ${match.fixture.referee}`}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={match.teams.home.logo} 
                              alt={match.teams.home.name}
                              className="w-5 h-5 object-contain"
                            />
                            <span className={`font-semibold text-sm ${match.teams.home.winner ? 'text-wc-gold' : ''}`}>
                              {match.teams.home.name}
                            </span>
                          </div>
                          <span className="font-bold text-lg px-3">
                            {match.goals.home ?? '-'} - {match.goals.away ?? '-'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${match.teams.away.winner ? 'text-blue-400' : ''}`}>
                              {match.teams.away.name}
                            </span>
                            <img 
                              src={match.teams.away.logo} 
                              alt={match.teams.away.name}
                              className="w-5 h-5 object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : h2hData && h2hData.results === 0 ? (
              <div className="mt-6">
                <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground mb-4">
                  Head to Head History
                </h4>
                <p className="text-muted-foreground text-sm">
                  No head-to-head data available for these teams.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
