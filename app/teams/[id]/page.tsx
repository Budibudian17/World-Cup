'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { cn } from '@/lib/utils'
import { getPlayerPhoto } from '@/lib/player-photos'
import { ArrowLeft, Users, Calendar, DollarSign, MapPin } from 'lucide-react'

interface Player {
  id: string
  fullName: string
  position: string
  image: string | null
  age: number
  citizenship: string
  teamId: string
  teamName: string
  marketValue: {
    valueM: number
    display: string
  }
}

interface Team {
  id: string
  name: string
  logo: string
  image: string
}

const getCountryFlag = (countryName: string): string => {
  // ISO country code mapping for flagcdn.com
  const countryCodeMap: Record<string, string> = {
    'Uruguay': 'uy',
    'Italy': 'it',
    'Argentina': 'ar',
    'Brazil': 'br',
    'West Germany': 'de',
    'Germany': 'de',
    'England': 'gb-eng',
    'France': 'fr',
    'Spain': 'es',
    'Netherlands': 'nl',
    'Mexico': 'mx',
    'USA': 'us',
    'United States': 'us',
    'South Korea': 'kr',
    'Japan': 'jp',
    'Switzerland': 'ch',
    'Sweden': 'se',
    'Chile': 'cl',
    'Austria': 'at',
    'Belgium': 'be',
    'Colombia': 'co',
    'Morocco': 'ma',
    'Qatar': 'qa',
    'Russia': 'ru',
    'South Africa': 'za',
    'Czechoslovakia': 'cs',
    'Hungary': 'hu',
    'Yugoslavia': 'yu',
    'Poland': 'pl',
    'Scotland': 'gb-sct',
    'Peru': 'pe',
    'Turkey': 'tr',
    'Paraguay': 'py',
    'Bulgaria': 'bg',
    'Romania': 'ro',
    'Norway': 'no',
    'Nigeria': 'ng',
    'Croatia': 'hr',
    'Denmark': 'dk',
    'Senegal': 'sn',
    'Ukraine': 'ua',
    'Greece': 'gr',
    'Portugal': 'pt',
    'China': 'cn',
    'Ecuador': 'ec',
    'Costa Rica': 'cr',
    'Saudi Arabia': 'sa',
    'Tunisia': 'tn',
    'Iran': 'ir',
    'Australia': 'au',
    'Algeria': 'dz',
    'Cameroon': 'cm',
    'Ivory Coast': 'ci',
    'Ghana': 'gh',
    'Slovakia': 'sk',
    'Slovenia': 'si',
    'Serbia': 'rs',
    'New Zealand': 'nz',
    'Honduras': 'hn',
    'Bosnia and Herzegovina': 'ba',
    'Egypt': 'eg',
    'Iceland': 'is',
    'Panama': 'pa',
    'Canada': 'ca',
    'Wales': 'gb-wls',
    'Northern Ireland': 'gb-nir',
    'Republic of Ireland': 'ie',
  }
  
  const code = countryCodeMap[countryName] || 'un'
  return `https://flagcdn.com/w40/${code}.png`
}

export default function TeamDetailPage() {
  const params = useParams()
  const teamId = params.id as string
  
  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [playerPhotos, setPlayerPhotos] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Fetch team details
        const teamsResponse = await fetch('/api/wc26-teams')
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json()
          const foundTeam = teamsData.teams?.find((t: Team) => t.id === teamId)
          if (foundTeam) {
            setTeam(foundTeam)
          }
        }

        // Fetch players for this team
        const playersResponse = await fetch(`/api/wc26-players?teamId=${teamId}`)
        if (playersResponse.ok) {
          const playersData = await playersResponse.json()
          setPlayers(playersData.players || [])

          // Fetch Wikipedia photos for players without images
          const playersWithoutPhotos = (playersData.players || []).filter((p: Player) => !p.image)
          const photoPromises = playersWithoutPhotos.map(async (player: Player) => {
            const photo = await getPlayerPhoto(player.fullName)
            return { name: player.fullName, photo }
          })
          const photos = await Promise.all(photoPromises)
          const photoMap: Record<string, string> = {}
          photos.forEach(({ name, photo }) => {
            if (photo) photoMap[name] = photo
          })
          setPlayerPhotos(photoMap)
        }
      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [teamId])

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="mb-8">
              <div className="w-32 h-8 bg-secondary rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                  <div className="w-16 h-16 bg-secondary rounded-full mb-3" />
                  <div className="w-3/4 h-4 bg-secondary rounded mb-2" />
                  <div className="w-1/2 h-3 bg-secondary rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!team) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4 text-center">
            <h1 className="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl uppercase text-foreground mb-4">
              Team Not Found
            </h1>
            <Link href="/teams" className="text-wc-gold hover:underline">
              Back to Teams
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/teams"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-sans text-sm">Back to Teams</span>
          </Link>

          {/* Team Header */}
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Team Logo */}
              <div className="w-24 h-24 bg-secondary rounded-full overflow-hidden flex items-center justify-center shrink-0">
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt={team.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <img 
                    src={getCountryFlag(team.name)} 
                    alt={team.name}
                    className="w-20 h-20 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<span class="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl text-wc-gold/30">${team.name.substring(0, 3).toUpperCase()}</span>`
                    }}
                  />
                )}
              </div>

              {/* Team Info */}
              <div className="text-center md:text-left">
                <SectionTag>Team Squad</SectionTag>
                <h1 className="mt-2 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground">
                  {team.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="font-sans text-sm">{players.length} Players</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-card border border-border rounded-xl p-4 hover:border-wc-gold transition-colors"
              >
                {/* Player Header */}
                <div className="flex items-start gap-4">
                  {/* Player Image */}
                  <div className="w-16 h-16 bg-secondary rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    {player.image ? (
                      <img 
                        src={player.image} 
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : playerPhotos[player.fullName] ? (
                      <img 
                        src={playerPhotos[player.fullName]} 
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-xl text-wc-gold/30">
                        {player.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="min-w-0">
                    <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground line-clamp-1">
                      {player.fullName}
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground mt-1">
                      {player.position}
                    </p>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <Calendar className="w-4 h-4 text-wc-gold mx-auto mb-1" />
                    <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                      {player.age}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">Age</p>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-4 h-4 text-wc-gold mx-auto mb-1" />
                    <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground line-clamp-1">
                      {player.citizenship ? player.citizenship.substring(0, 3).toUpperCase() : 'N/A'}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">Nation</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-4 h-4 text-wc-gold mx-auto mb-1" />
                    <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                      {player.marketValue?.display || 'N/A'}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">Value</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-muted-foreground">
                No players data available for this team.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
