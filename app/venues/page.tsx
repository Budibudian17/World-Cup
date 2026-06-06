'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { venues } from '@/lib/data'
import type { Venue } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MapPin, Users, Clock, Calendar, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function VenuesPage() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [filter, setFilter] = useState<'all' | 'USA' | 'Mexico' | 'Canada'>('all')

  // Fetch stadiums with React Query for caching
  const { data: stadiumsData, isLoading: loadingStadiums } = useQuery({
    queryKey: ['stadiums'],
    queryFn: async () => {
      const response = await fetch('/api/stadiums')
      if (!response.ok) throw new Error('Failed to fetch stadiums')
      const data = await response.json()

      // Transform API data to match Venue type
      const stadiumsApi = data.stadiums || []
      const transformedStadiums = stadiumsApi.map((stadium: any) => ({
        id: stadium.id,
        name: stadium.fifa_name || stadium.name_en,
        city: stadium.city_en,
        country: stadium.country_en,
        capacity: stadium.capacity,
        timezone: 'UTC',
        matchesHosted: 0,
        image: '',
        description: `${stadium.name_en || stadium.fifa_name || 'Stadium'}${stadium.yearOpened ? ` opened in ${stadium.yearOpened}` : ''}${stadium.address ? `. Located at ${stadium.address}` : ''}.`,
        imageUrl: null,
        surfaceType: stadium.surface,
        opened: stadium.yearOpened,
        elevationM: 0,
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
        historicTournaments: [],
      }))

      // Fetch stadium images from Unsplash
      const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      const imageMap: Record<string, string> = {}

      if (unsplashKey) {
        const imagePromises = transformedStadiums.map(async (stadium: Venue) => {
          try {
            const query = encodeURIComponent(`${stadium.name} stadium`)
            const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashKey}&per_page=1&orientation=landscape`)
            if (unsplashResponse.ok) {
              const unsplashData = await unsplashResponse.json()
              if (unsplashData.results?.[0]?.urls?.regular) {
                imageMap[stadium.id] = unsplashData.results[0].urls.regular
              }
            }
          } catch (error) {
            console.error(`Error fetching Unsplash image for ${stadium.name}:`, error)
          }
        })

        await Promise.all(imagePromises)
      }

      // Update stadiums with images
      const stadiumsWithImages = transformedStadiums.map((stadium: Venue) => ({
        ...stadium,
        imageUrl: imageMap[stadium.id] || null,
        image: imageMap[stadium.id] || '',
      }))

      // Fetch flag URLs for unique countries
      const uniqueCountries = new Set(transformedStadiums.map((s: Venue) => s.country))
      const flagMap: Record<string, string> = {}
      const flagPromises = Array.from(uniqueCountries).map(async (countryName: unknown) => {
        const name = String(countryName)
        try {
          const teamsResponse = await fetch('/api/teams')
          if (teamsResponse.ok) {
            const teamsData = await teamsResponse.json()
            const team = teamsData.teams?.find((t: any) => t.name_en === name)
            if (team?.flag) {
              flagMap[name] = typeof team.flag === 'string' ? team.flag : team.flag?.flagUrl
            }
          }
        } catch (error) {
          console.error(`Error fetching flag for ${name}:`, error)
        }
      })

      await Promise.all(flagPromises)

      return {
        stadiums: stadiumsWithImages,
        countryFlags: flagMap,
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const stadiums = stadiumsData?.stadiums || venues
  const countryFlags = stadiumsData?.countryFlags || {}

  const filteredVenues = filter === 'all'
    ? stadiums
    : stadiums.filter((v: Venue) => v.country === filter || (filter === 'USA' && v.country === 'United States'))

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <SectionTag>Stadiums</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              16 World-Class Venues
            </h1>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              Explore the iconic stadiums across USA, Canada, and Mexico hosting the 2026 World Cup.
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2 mb-10">
            {(['all', 'USA', 'Mexico', 'Canada'] as const).map((country) => (
              <button
                key={country}
                onClick={() => setFilter(country)}
                className={cn(
                  'px-4 py-2 rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wider transition-all',
                  filter === country
                    ? 'bg-wc-gold text-wc-black'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
              >
                {country === 'all' ? 'All' : country}
              </button>
            ))}
          </div>

          {/* Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loadingStadiums ? (
              // Skeleton loading
              Array.from({ length: 16 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="aspect-video bg-secondary animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="w-3/4 h-5 bg-secondary rounded animate-pulse" />
                    <div className="w-1/2 h-4 bg-secondary rounded animate-pulse" />
                    <div className="flex justify-between pt-3 border-t border-border">
                      <div className="w-16 h-3 bg-secondary rounded animate-pulse" />
                      <div className="w-16 h-3 bg-secondary rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredVenues.map((venue: Venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={() => setSelectedVenue(venue)}
                  flagUrl={countryFlags[venue.country]}
                />
              ))
            )}
          </div>

          {/* Venue Detail Modal */}
          <AnimatePresence>
            {selectedVenue && (
              <VenueModal
                venue={selectedVenue}
                onClose={() => setSelectedVenue(null)}
                flagUrl={countryFlags[selectedVenue.country]}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

function VenueCard({ venue, onClick, flagUrl }: { venue: Venue; onClick: () => void; flagUrl?: string }) {
  const getFlagEmoji = (country: string) => {
    switch (country) {
      case 'USA': return '🇺🇸'
      case 'Mexico': return '🇲🇽'
      case 'Canada': return '🇨🇦'
      case 'United States': return '🇺🇸'
      default: return ''
    }
  }

  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-xl overflow-hidden text-left transition-all duration-150 hover:border-wc-gold hover:-translate-y-1 group"
    >
      {/* Placeholder Image */}
      <div className="aspect-video bg-gradient-to-br from-wc-gray-1 to-wc-gray-2 relative overflow-hidden">
        {venue.imageUrl ? (
          <img 
            src={venue.imageUrl} 
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-6xl text-wc-gold/10">
              26
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-wc-black/80 rounded text-sm">
          {flagUrl ? (
            <img 
              src={flagUrl} 
              alt={venue.country}
              className="w-6 h-4 object-cover rounded"
            />
          ) : (
            <span>{getFlagEmoji(venue.country)}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground group-hover:text-wc-gold transition-colors line-clamp-1">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="font-sans text-sm">{venue.city}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="font-sans text-xs">{venue.capacity.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className="font-sans text-xs">{venue.matchesHosted} matches</span>
          </div>
        </div>
      </div>
    </button>
  )
}

function VenueModal({ venue, onClose, flagUrl }: { venue: Venue; onClose: () => void; flagUrl?: string }) {
  const getFlagEmoji = (country: string) => {
    switch (country) {
      case 'USA': return '🇺🇸'
      case 'Mexico': return '🇲🇽'
      case 'Canada': return '🇨🇦'
      case 'United States': return '🇺🇸'
      default: return ''
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-card border border-border rounded-2xl overflow-hidden z-50 flex flex-col max-h-[90vh]"
      >
        {/* Header Image */}
        <div className="aspect-video bg-gradient-to-br from-wc-gray-1 to-wc-gray-2 relative shrink-0">
          {venue.imageUrl ? (
            <img 
              src={venue.imageUrl} 
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-8xl text-wc-gold/10">
                26
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-wc-black/80 rounded-full hover:bg-wc-black transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-barlow-condensed)] font-black text-2xl uppercase tracking-wide text-foreground">
                {venue.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                {flagUrl ? (
                  <img 
                    src={flagUrl} 
                    alt={venue.country}
                    className="w-6 h-4 object-cover rounded"
                  />
                ) : (
                  <span className="text-xl">{getFlagEmoji(venue.country)}</span>
                )}
                <span className="font-sans text-muted-foreground">{venue.city}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 font-sans text-foreground leading-relaxed">
            {venue.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <StatItem
              icon={<Users className="w-5 h-5 text-wc-gold" />}
              label="Capacity"
              value={venue.capacity.toLocaleString()}
            />
            <StatItem
              icon={<Calendar className="w-5 h-5 text-wc-gold" />}
              label="Matches"
              value={`${venue.matchesHosted} games`}
            />
            <StatItem
              icon={<Clock className="w-5 h-5 text-wc-gold" />}
              label="Timezone"
              value={venue.timezone}
            />
            <StatItem
              icon={<MapPin className="w-5 h-5 text-wc-gold" />}
              label="Country"
              value={venue.country}
            />
            {venue.opened && (
              <StatItem
                icon={<Calendar className="w-5 h-5 text-wc-gold" />}
                label="Opened"
                value={venue.opened.toString()}
              />
            )}
            {venue.surfaceType && (
              <StatItem
                icon={<MapPin className="w-5 h-5 text-wc-gold" />}
                label="Surface"
                value={venue.surfaceType}
              />
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg text-foreground">
        {value}
      </span>
    </div>
  )
}
