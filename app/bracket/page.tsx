'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-react'

const ROUNDS = ['round_of_16', 'quarter_final', 'semi_final', 'final'] as const
type Round = typeof ROUNDS[number]

const ROUND_LABELS: Record<Round, string> = {
  round_of_16: 'Round of 16',
  quarter_final: 'Quarter-Finals',
  semi_final: 'Semi-Finals',
  final: 'Final',
}

const MATCHES_PER_ROUND: Record<Round, number> = {
  round_of_16: 8,
  quarter_final: 4,
  semi_final: 2,
  final: 1,
}

interface BracketGame {
  id: string
  home_team_id: string | null
  away_team_id: string | null
  home_team_name_en: string
  away_team_name_en: string
  home_score: number | null
  away_score: number | null
  local_date: string
  type: Round
  stadium_id: string
  finished: string
  time_elapsed: string
}

export default function BracketPage() {
  const [games, setGames] = useState<BracketGame[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBracketGames = async () => {
      try {
        const response = await fetch('/api/games')
        if (response.ok) {
          const data = await response.json()
          
          // Filter games by bracket types
          const bracketGames = data.games.filter((game: any) => 
            ROUNDS.includes(game.type)
          )
                  
          // Fill in missing matches with placeholders
          const completeGames: BracketGame[] = []
          
          for (const round of ROUNDS) {
            const roundGames = bracketGames.filter((g: any) => g.type === round)
            const expectedCount = MATCHES_PER_ROUND[round]
            
            // Add actual games
            completeGames.push(...roundGames)
            
            // Add placeholder matches if needed
            if (roundGames.length < expectedCount) {
              const missingCount = expectedCount - roundGames.length
              for (let i = 0; i < missingCount; i++) {
                completeGames.push({
                  id: `${round}-placeholder-${i}`,
                  home_team_id: null,
                  away_team_id: null,
                  home_team_name_en: 'TBA',
                  away_team_name_en: 'TBA',
                  home_score: null,
                  away_score: null,
                  local_date: 'TBA',
                  type: round,
                  stadium_id: '',
                  finished: 'FALSE',
                  time_elapsed: 'notstarted',
                })
              }
            }
          }
          
          setGames(completeGames)
        }
      } catch (error) {
        console.error('Error fetching bracket games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBracketGames()
  }, [])

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 md:py-20">
          <div className="w-full px-4 md:px-8">
            <div className="text-center mb-8">
              <SectionTag>Knockout Stage</SectionTag>
              <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
                Bracket
              </h1>
            </div>
            <div className="flex gap-6 md:gap-10 lg:gap-12 px-4 md:px-8 min-h-screen justify-between items-stretch">
              {ROUNDS.map((round) => (
                <div key={round} className="flex flex-col flex-1 min-w-[120px]">
                  <div className="h-8 bg-secondary rounded mb-4" />
                  <div className="space-y-4">
                    {Array.from({ length: MATCHES_PER_ROUND[round] }).map((_, i) => (
                      <div key={i} className="h-20 bg-secondary rounded animate-pulse" />
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
        <div className="w-full px-4 md:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <SectionTag>Knockout Stage</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              Bracket
            </h1>
            <p className="mt-2 font-sans text-muted-foreground">
              Road to the World Cup 2026 Final
            </p>
          </div>

          {/* Bracket Display */}
          <div className="overflow-x-auto pb-4 -mx-4 md:-mx-8">
            <div className="flex gap-6 md:gap-10 lg:gap-12 px-4 md:px-8 min-h-screen justify-between items-stretch">
              {ROUNDS.map((round) => (
                <RoundColumn
                  key={round}
                  round={round}
                  games={games.filter((g) => g.type === round)}
                />
              ))}

              {/* Champion Display */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 min-w-[140px]">
                <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs uppercase tracking-widest text-wc-gold mb-4">
                  Champion
                </span>
                <div className="flex flex-col items-center gap-4 p-6 bg-card border-2 border-wc-gold rounded-xl">
                  <Trophy className="w-12 h-12 text-wc-gold" />
                  <span className="font-sans text-sm text-muted-foreground">TBA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function RoundColumn({ 
  round, 
  games 
}: { 
  round: Round
  games: BracketGame[]
}) {
  const sortedGames = games.sort((a, b) => a.id.localeCompare(b.id))

  return (
    <div className="flex flex-col flex-1 min-w-[120px]">
      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs uppercase tracking-widest text-wc-gold mb-4 text-center whitespace-nowrap">
        {ROUND_LABELS[round]}
      </span>
      <div 
        className="flex flex-col gap-4 justify-around flex-1"
        style={{ 
          paddingTop: round === 'quarter_final' ? '24px' : round === 'semi_final' ? '56px' : round === 'final' ? '120px' : '0',
          paddingBottom: round === 'quarter_final' ? '24px' : round === 'semi_final' ? '56px' : round === 'final' ? '120px' : '0'
        }}
      >
        {sortedGames.map((game) => (
          <BracketMatchCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

function BracketMatchCard({ game }: { game: BracketGame }) {
  const isFinished = game.finished === 'TRUE'
  const formatDate = (dateStr: string) => {
    const [date, time] = dateStr.split(' ')
    return `${date} ${time}`
  }

  const homeTeam = game.home_team_name_en || 'TBA'
  const awayTeam = game.away_team_name_en || 'TBA'
  const homeScore = isFinished && game.home_score !== null ? game.home_score : null
  const awayScore = isFinished && game.away_score !== null ? game.away_score : null

  return (
    <div className="bg-card border border-wc-gold/30 rounded-lg overflow-hidden">
      <TeamSlot
        teamName={homeTeam}
        score={homeScore}
        isWinner={false}
      />
      <div className="h-px bg-wc-gold/20" />
      <TeamSlot
        teamName={awayTeam}
        score={awayScore}
        isWinner={false}
      />
      <div className="px-3 py-1.5 bg-secondary/30">
        <p className="font-sans text-[10px] text-muted-foreground text-center">
          {formatDate(game.local_date)}
        </p>
      </div>
    </div>
  )
}

function TeamSlot({
  teamName,
  score,
  isWinner,
}: {
  teamName: string
  score: number | null
  isWinner: boolean
}) {
  return (
    <div className="w-full px-3 py-2 flex items-center justify-between">
      <span className={cn(
        'font-[family-name:var(--font-barlow-condensed)] font-bold text-xs uppercase tracking-wide truncate',
        isWinner && 'text-wc-gold',
        !isWinner && 'text-foreground'
      )}>
        {teamName}
      </span>
      {score !== null && (
        <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-sm text-wc-gold ml-2">
          {score}
        </span>
      )}
    </div>
  )
}
