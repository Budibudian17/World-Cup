'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'

interface Team {
  id: string
  name: string
  shortName: string
  abbreviation: string
  logo: string
  image: string
  slug: string
  color: string
  teamPhoto: string
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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/wc26-teams')
        if (response.ok) {
          const data = await response.json()
          setTeams(data.teams || [])
        }
      } catch (error) {
        console.error('Error fetching teams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionTag>Participating Nations</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              48 Teams
            </h1>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              Explore all 48 nations competing in the FIFA World Cup 2026.
            </p>
          </div>

          {/* Teams Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 48 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                  <div className="w-16 h-16 mx-auto mb-3 bg-secondary rounded-full" />
                  <div className="w-3/4 h-4 mx-auto bg-secondary rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="bg-card border border-border rounded-xl p-4 text-center transition-all duration-200 hover:border-wc-gold hover:-translate-y-1 group"
                >
                  {/* Team Logo */}
                  <div className="w-16 h-16 mx-auto mb-3 bg-secondary rounded-full overflow-hidden flex items-center justify-center">
                    {team.logo ? (
                      <img 
                        src={team.logo} 
                        alt={team.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <img 
                        src={getCountryFlag(team.name)} 
                        alt={team.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = `<span class="font-[family-name:var(--font-barlow-condensed)] font-black text-xl text-wc-gold/30">${team.abbreviation}</span>`
                        }}
                      />
                    )}
                  </div>

                  {/* Team Name */}
                  <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wide text-foreground group-hover:text-wc-gold transition-colors line-clamp-2">
                    {team.name}
                  </h3>

                  {/* View Squad Button */}
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground group-hover:text-wc-gold transition-colors">
                    <Users className="w-3 h-3" />
                    <span className="font-sans">View Squad</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
