'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import { CountdownBlock } from '@/components/countdown-block'
import { MatchCard } from '@/components/match-card'
import { PlayerCard } from '@/components/player-card'
import { SectionTag } from '@/components/section-tag'
import { AnimatedNumber } from '@/components/animated-number'
import { WorldGlobe } from '@/components/world-globe'
import { liveMatches, tournamentStats, teams } from '@/lib/data'
import topPlayersData from '@/lib/data/wc2026-players.json'
import { getPlayerPhoto } from '@/lib/player-photos'
import type { Match, Player } from '@/lib/types'
import { Trophy, Users, Calendar, MapPin, Globe, Volume2, VolumeX, Twitter, Instagram, Youtube, Facebook } from 'lucide-react'

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true)
  const [matches, setMatches] = useState(liveMatches)
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [playerPhotos, setPlayerPhotos] = useState<Record<string, string>>({})
  const [loadingPlayers, setLoadingPlayers] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/games')
        if (response.ok) {
          const data = await response.json()
          
          // Fetch stadiums to get stadium names
          const stadiumsResponse = await fetch('/api/stadiums')
          const stadiumsData = stadiumsResponse.ok ? await stadiumsResponse.json() : { stadiums: [] }
          const stadiumMap: Record<string, string> = {}
          stadiumsData.stadiums.forEach((stadium: any) => {
            stadiumMap[stadium.id] = stadium.name_en
          })
          
          // Fetch teams to get flag URLs
          const teamsResponse = await fetch('/api/teams')
          const teamsData = teamsResponse.ok ? await teamsResponse.json() : { teams: [] }
          const flagMap: Record<string, string> = {}
          teamsData.teams.forEach((team: any) => {
            // Handle both API formats: direct string URL or object with flagUrl
            const flagUrl = typeof team.flag === 'string' ? team.flag : team.flag?.flagUrl
            if (flagUrl && team.name_en) {
              flagMap[team.name_en] = flagUrl
            }
          })
          console.log('Flag map:', flagMap)
          console.log('Sample game team names:', data.games[0]?.home_team_name_en, data.games[0]?.away_team_name_en)
          
          // Transform API data to match Match type
          const transformedMatches = data.games
            .filter((match: any) => match.home_team_name_en !== 'TBD' && match.away_team_name_en !== 'TBD')
            .sort((a: any, b: any) => {
              // Sort by date, with live matches first
              const aIsLive = a.time_elapsed !== 'notstarted' && a.finished === 'FALSE'
              const bIsLive = b.time_elapsed !== 'notstarted' && b.finished === 'FALSE'
              if (aIsLive && !bIsLive) return -1
              if (!aIsLive && bIsLive) return 1
              return new Date(a.local_date).getTime() - new Date(b.local_date).getTime()
            })
            .slice(0, 6)
            .map((match: any) => {
              const isLive = match.time_elapsed !== 'notstarted' && match.finished === 'FALSE'
              
              return {
                id: match.id,
                teamA: { 
                  name: match.home_team_name_en, 
                  code: match.home_team_name_en?.substring(0, 3).toUpperCase() || 'TBD', 
                  flag: '🏳️', 
                  group: match.group || '' 
                },
                teamB: { 
                  name: match.away_team_name_en, 
                  code: match.away_team_name_en?.substring(0, 3).toUpperCase() || 'TBD', 
                  flag: '🏳️', 
                  group: match.group || '' 
                },
                scoreA: match.home_score ? parseInt(match.home_score) : null,
                scoreB: match.away_score ? parseInt(match.away_score) : null,
                venue: stadiumMap[match.stadium_id] || 'TBD',
                date: match.local_date,
                time: match.local_date.split(' ')[1] || '00:00',
                isLive: isLive,
                minute: isLive && match.time_elapsed !== 'notstarted' ? parseInt(match.time_elapsed) : 0,
                flagUrlA: flagMap[match.home_team_name_en] || null,
                flagUrlB: flagMap[match.away_team_name_en] || null,
              }
            })
          
          setMatches(transformedMatches)
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoadingMatches(false)
      }
    }

    const fetchPlayers = async () => {
      try {
        // Use static JSON data for top players
        const transformedPlayers = topPlayersData.topPlayers.map((player: any) => ({
          id: player.id,
          name: player.name,
          team: player.team,
          teamFlag: player.teamFlag,
          jersey: player.jersey,
          position: player.position,
          club: player.club,
          birthDate: player.birthDate,
          height: player.height,
          weight: player.weight,
          internationalCaps: player.internationalCaps,
          internationalGoals: player.internationalGoals,
          wcAppearances: player.wcAppearances,
          wcGoals: player.wcGoals,
        }))
        setPlayers(transformedPlayers)

        // Fetch player photos from Wikipedia
        const photoPromises = transformedPlayers.map(async (player) => {
          const photo = await getPlayerPhoto(player.name)
          return { name: player.name, photo }
        })
        const photos = await Promise.all(photoPromises)
        const photoMap: Record<string, string> = {}
        photos.forEach(({ name, photo }) => {
          if (photo) photoMap[name] = photo
        })
        setPlayerPhotos(photoMap)
      } catch (error) {
        console.error('Error fetching players:', error)
      } finally {
        setLoadingPlayers(false)
      }
    }

    fetchMatches()
    fetchPlayers()
  }, [])

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/worldcupintro.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Volume Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Background 26 Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-[30vw] text-wc-gold/[0.04] leading-none">
            26
          </span>
        </div>

        <div className="relative z-10 max-w-[1280px] px-4 py-12 md:py-20 text-center">
          <SectionTag>FIFA World Cup</SectionTag>

          <h1 className="mt-6 font-[family-name:var(--font-barlow-condensed)] font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight text-foreground">
            WE ARE 26
          </h1>

          <p className="mt-4 font-sans text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            The biggest FIFA World Cup in history. 48 teams, 16 venues, 3 nations.
            <br className="hidden sm:block" />
            United States, Canada, and Mexico welcome the world.
          </p>

          {/* Countdown */}
          <div className="mt-10 md:mt-14">
            <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest mb-4">
              Countdown to the Final
            </p>
            <CountdownBlock />
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="py-12 md:py-20 bg-card border-y border-border rounded-b-[5rem]">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-10">
            <SectionTag>WC26 Venues</SectionTag>
            <h2 className="mt-3 font-[family-name:var(--font-barlow-condensed)] font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-foreground">
              16 Venues Across 3 Nations
            </h2>
          </div>

          <WorldGlobe />

          {/* Stats Below Globe */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatBlock
              icon={<Users className="w-6 h-6 text-wc-gold" />}
              value={tournamentStats.teams}
              label="Teams"
            />
            <StatBlock
              icon={<Calendar className="w-6 h-6 text-wc-gold" />}
              value={tournamentStats.matches}
              label="Matches"
            />
            <StatBlock
              icon={<MapPin className="w-6 h-6 text-wc-gold" />}
              value={tournamentStats.venues}
              label="Venues"
            />
            <StatBlock
              icon={<Globe className="w-6 h-6 text-wc-gold" />}
              value={tournamentStats.hostNations}
              label="Host Nations"
            />
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <SectionTag>Match Center</SectionTag>
              <h2 className="mt-3 font-[family-name:var(--font-barlow-condensed)] font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-foreground">
                Latest Matches
              </h2>
            </div>
            <Link href="/matches" className="text-sm font-semibold text-wc-gold hover:text-wc-gold/80 transition-colors">
              See More →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingMatches ? (
              // Skeleton loading
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded animate-pulse" />
                      <div className="w-16 h-4 bg-secondary rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary rounded animate-pulse" />
                      <div className="w-8 h-8 bg-secondary rounded animate-pulse" />
                    </div>
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <div className="w-16 h-4 bg-secondary rounded animate-pulse" />
                      <div className="w-8 h-8 bg-secondary rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="w-24 h-3 bg-secondary rounded animate-pulse" />
                    <div className="w-16 h-3 bg-secondary rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Top Players Section */}
      <section className="py-12 md:py-20 bg-card border-y border-border">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-10">
            <SectionTag>Star Players</SectionTag>
            <h2 className="mt-3 font-[family-name:var(--font-barlow-condensed)] font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-foreground">
              World Cup STARS
            </h2>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              The greatest players to ever grace the World Cup stage.
            </p>
            <Link href="/players" className="inline-block mt-4 text-sm font-semibold text-wc-gold hover:text-wc-gold/80 transition-colors">
              See More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {loadingPlayers ? (
              // Skeleton loading
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6">
                  <div className="w-3/4 h-6 bg-secondary rounded animate-pulse mb-2" />
                  <div className="w-1/2 h-4 bg-secondary rounded animate-pulse mb-4" />
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="w-8 h-8 bg-secondary rounded animate-pulse" />
                    <div className="w-8 h-8 bg-secondary rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              players.map((player) => (
                <PlayerCard key={player.name} player={player} photo={playerPhotos[player.name] || null} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Logo */}
            <div className="flex flex-col items-center md:items-start">
              <img 
                src="/img/logoworldcupputih.webp" 
                alt="FIFA World Cup 2026"
                className="h-16 w-auto mb-4"
              />
              <p className="font-sans text-sm text-muted-foreground text-center md:text-left">
                Fan-made World Cup 2026 Hub. Not affiliated with FIFA.,<br />
                Created by Hilmi Farrel Firjatullah
              </p>
            </div>

            {/* Middle: Navigation */}
            <div className="flex flex-col items-center">
              <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground mb-4">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/bracket" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                    Bracket
                  </Link>
                </li>
                <li>
                  <Link href="/groups" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                    Groups
                  </Link>
                </li>
                <li>
                  <Link href="/venues" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                    Venues
                  </Link>
                </li>
                <li>
                  <Link href="/predict" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                    Predict
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                    Quiz
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right: Social Media */}
            <div className="flex flex-col items-center md:items-end">
              <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="font-sans text-xs text-muted-foreground">
              © 2026 FIFA World Cup Fan Hub | Hilmi Farrel Firjatullah | All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </PageTransition>
  )
}

function StatBlock({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-secondary/50 rounded-xl">
      {icon}
      <AnimatedNumber
        value={value}
        className="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl text-wc-gold"
      />
      <span className="font-sans text-sm text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  )
}

function HostNationCard({ flag, name, venues }: { flag: string; name: string; venues: number }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-secondary/30 rounded-xl border border-border transition-all duration-150 hover:border-wc-gold hover:-translate-y-0.5">
      <span className="text-6xl">{flag}</span>
      <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xl uppercase tracking-wide text-foreground">
        {name}
      </h3>
      <p className="font-sans text-sm text-muted-foreground">
        {venues} Venues
      </p>
    </div>
  )
}
