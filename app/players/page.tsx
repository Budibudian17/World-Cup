'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { cn } from '@/lib/utils'
import { Users, Calendar, DollarSign, MapPin, Search } from 'lucide-react'

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

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [positionFilter, setPositionFilter] = useState<'all' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const PLAYERS_PER_PAGE = 12

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/wc26-players')
        if (response.ok) {
          const data = await response.json()
          setPlayers(data.players || [])
          setFilteredPlayers(data.players || [])
        }
      } catch (error) {
        console.error('Error fetching players:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  useEffect(() => {
    let filtered = players

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (player) =>
          player.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.teamName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by position
    if (positionFilter !== 'all') {
      filtered = filtered.filter((player) => player.position === positionFilter)
    }

    setFilteredPlayers(filtered)
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [searchQuery, positionFilter, players])

  const positions: Array<'all' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'> = [
    'all',
    'Goalkeeper',
    'Defender',
    'Midfielder',
    'Forward',
  ]

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE)
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE
  const endIndex = startIndex + PLAYERS_PER_PAGE
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers with sliding window
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const windowSize = 2 // Number of pages to show on each side of current page

    if (totalPages <= 7) {
      // If total pages is small, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Show ellipsis if current page is far from start
      if (currentPage > windowSize + 2) {
        pages.push('...')
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - windowSize)
      const endPage = Math.min(totalPages - 1, currentPage + windowSize)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - windowSize - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionTag>All Players</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              World Cup Squad
            </h1>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              Explore all {players.length} players from 48 nations competing in FIFA World Cup 2026.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search players or teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-wc-gold transition-colors"
                />
              </div>

              {/* Position Filter */}
              <div className="flex gap-2 flex-wrap">
                {positions.map((position) => (
                  <button
                    key={position}
                    onClick={() => setPositionFilter(position)}
                    className={cn(
                      'px-4 py-2 rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wider transition-all',
                      positionFilter === position
                        ? 'bg-wc-gold text-wc-black'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    )}
                  >
                    {position === 'all' ? 'All' : position.substring(0, 4)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Players Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 16 }).map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                  <div className="w-16 h-16 bg-secondary rounded-full mb-3" />
                  <div className="w-3/4 h-4 bg-secondary rounded mb-2" />
                  <div className="w-1/2 h-3 bg-secondary rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedPlayers.map((player) => (
                  <Link
                    key={player.id}
                    href={`/teams/${player.teamId}`}
                    className="bg-card border border-border rounded-xl p-4 hover:border-wc-gold transition-colors group"
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
                        ) : (
                          <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-xl text-wc-gold/30">
                            {player.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground line-clamp-1 group-hover:text-wc-gold transition-colors">
                          {player.fullName}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground mt-1">
                          {player.position}
                        </p>
                        <p className="font-sans text-xs text-wc-gold mt-1">
                          {player.teamName}
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
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        'px-4 py-2 rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wider transition-all',
                        currentPage === 1
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      )}
                    >
                      Previous
                    </button>

                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-4 py-2 text-muted-foreground"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={cn(
                            'px-4 py-2 rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wider transition-all min-w-[40px]',
                            currentPage === page
                              ? 'bg-wc-gold text-wc-black'
                              : 'bg-secondary text-foreground hover:bg-secondary/80'
                          )}
                        >
                          {page}
                        </button>
                      )
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={cn(
                        'px-4 py-2 rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wider transition-all',
                        currentPage === totalPages
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      )}
                    >
                      Next
                    </button>
                  </div>

                  <p className="font-sans text-sm text-muted-foreground">
                    Showing {startIndex + 1} - {Math.min(endIndex, filteredPlayers.length)} of {filteredPlayers.length} players
                  </p>
                </div>
              )}

              {filteredPlayers.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-sans text-muted-foreground">
                    No players found matching your search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
