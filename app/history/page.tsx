'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { Trophy, MapPin, Target, Users, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

// Since world-cup-history is a CommonJS package, we'll use dynamic import
interface WorldCupData {
  hostCountry: string
  winner: string
  runnerUp: string
  topGoalScorer: Array<{
    name: string
    country: string
    numberOfGoals: number
  }>
  totalAttendance: number
  numberOfMatches: number
}

const WORLD_CUP_YEARS = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022]

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<Record<number, WorldCupData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Dynamic import for CommonJS package
        const worldCupHistory = (await import('world-cup-history')).default
        
        const data: Record<number, WorldCupData> = {}
        WORLD_CUP_YEARS.forEach(year => {
          try {
            data[year] = worldCupHistory.year(year)
          } catch (error) {
            console.error(`Error fetching data for ${year}:`, error)
          }
        })
        
        setHistoryData(data)
      } catch (error) {
        console.error('Error loading world-cup-history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

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
    }
    
    // Handle co-hosts (2002)
    if (countryName.includes(',')) {
      const countries = countryName.split(',').map(c => c.trim())
      const codes = countries.map(c => countryCodeMap[c] || 'un')
      return codes.map(code => `https://flagcdn.com/w40/${code}.png`).join(',')
    }
    
    const code = countryCodeMap[countryName] || 'un'
    return `https://flagcdn.com/w40/${code}.png`
  }

  const formatAttendance = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M'
    }
    return (num / 1000).toFixed(0) + 'K'
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-12">
              <SectionTag>World Cup History</SectionTag>
              <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
                Previous Winners
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                  <div className="h-8 bg-secondary rounded mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-secondary rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionTag>World Cup History</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              Previous Winners
            </h1>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              A complete timeline of FIFA World Cup champions from 1930 to 2022
            </p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...WORLD_CUP_YEARS].reverse().map((year) => {
              const data = historyData[year]
              if (!data) return null

              return (
                <div key={year} className="bg-card border border-border rounded-xl overflow-hidden">
                  {/* Year Header */}
                  <div className="bg-wc-gold px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-wc-black" />
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-lg uppercase tracking-wide text-wc-black">
                        {year}
                      </span>
                    </div>
                    <span className="font-sans text-xs text-wc-black/80">
                      {data.numberOfMatches} Matches
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Host */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-wc-gold shrink-0" />
                      <div className="flex items-center gap-2 min-w-0">
                        {getCountryFlag(data.hostCountry).startsWith('http') ? (
                          <img 
                            src={getCountryFlag(data.hostCountry)} 
                            alt={data.hostCountry}
                            className="w-5 h-3 object-cover rounded shrink-0"
                          />
                        ) : (
                          <span className="text-lg shrink-0">{getCountryFlag(data.hostCountry)}</span>
                        )}
                        <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground truncate">
                          {data.hostCountry}
                        </p>
                      </div>
                    </div>

                    {/* Winner */}
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-wc-gold shrink-0" />
                      <div className="flex items-center gap-2 min-w-0">
                        {getCountryFlag(data.winner).startsWith('http') ? (
                          <img 
                            src={getCountryFlag(data.winner)} 
                            alt={data.winner}
                            className="w-5 h-3 object-cover rounded shrink-0"
                          />
                        ) : (
                          <span className="text-lg shrink-0">{getCountryFlag(data.winner)}</span>
                        )}
                        <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground truncate">
                          {data.winner}
                        </p>
                      </div>
                    </div>

                    {/* Runner-up */}
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex items-center gap-2 min-w-0">
                        {getCountryFlag(data.runnerUp).startsWith('http') ? (
                          <img 
                            src={getCountryFlag(data.runnerUp)} 
                            alt={data.runnerUp}
                            className="w-5 h-3 object-cover rounded shrink-0"
                          />
                        ) : (
                          <span className="text-lg shrink-0">{getCountryFlag(data.runnerUp)}</span>
                        )}
                        <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground truncate">
                          {data.runnerUp}
                        </p>
                      </div>
                    </div>

                    {/* Top Scorer */}
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-wc-gold shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        {data.topGoalScorer.map((scorer, idx) => (
                          <p key={idx} className="font-sans text-xs text-foreground truncate">
                            {scorer.name} <span className="text-wc-gold font-bold">({scorer.numberOfGoals})</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Attendance */}
                    <div className="flex items-center gap-2 text-xs pt-2 border-t border-border">
                      <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="font-sans text-muted-foreground">
                        {formatAttendance(data.totalAttendance)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
