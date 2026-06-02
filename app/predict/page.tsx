'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { PredictSelector } from '@/components/predict-selector'
import { getTeamsList, getSquadStats } from '@/lib/predict-loader'
import { cn } from '@/lib/utils'
import { Loader2, RefreshCw, User } from 'lucide-react'

interface Team {
  id: string
  name_en: string
  flag: string
  group: string
}

interface SquadStats {
  team: string
  squad: any[]
  totalGoals: number
  totalCaps: number
  avgGoals: string
  avgCaps: string
  coach: string
}

export default function PredictPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [selectedHome, setSelectedHome] = useState<SquadStats | null>(null)
  const [selectedAway, setSelectedAway] = useState<SquadStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    async function loadTeams() {
      try {
        const teamsList = await getTeamsList()
        console.log('Teams loaded:', teamsList)
        setTeams(teamsList)
      } catch (error) {
        console.error('Error loading teams:', error)
        setError('Failed to load teams. Please refresh the page.')
      } finally {
        setLoadingTeams(false)
      }
    }
    loadTeams()
  }, [])

  const handlePredict = async (homeTeam: Team, awayTeam: Team) => {
    if (cooldown) return

    setLoading(true)
    setError(null)
    setSelectedHome(null)
    setSelectedAway(null)
    setCooldown(true)

    try {
      const [homeStats, awayStats] = await Promise.all([
        getSquadStats(homeTeam.name_en),
        getSquadStats(awayTeam.name_en)
      ])

      setSelectedHome(homeStats)
      setSelectedAway(awayStats)
    } catch (error) {
      console.error('Error fetching prediction data:', error)
      setError('Failed to fetch team stats. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => setCooldown(false), 3000)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[800px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionTag>AI Powered</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              Match Predictor
            </h1>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              Select two teams and compare their squad statistics to predict the potential matchup outcome.
            </p>
          </div>

          {/* Team Selection */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            {loadingTeams ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <PredictSelector teams={teams} onSelect={handlePredict} />
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-8 bg-card border border-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-wc-gold/10 to-transparent animate-scan" />
              <div className="relative z-10 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="font-sans text-muted-foreground">Analysing squad statistics...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-8 bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
              <p className="font-sans text-destructive mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-sans text-sm">Retry</span>
              </button>
            </div>
          )}

          {/* Results */}
          {selectedHome && selectedAway && (
            <div className="mt-8 space-y-6">
              {/* Stats Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team Stats */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] font-black text-2xl uppercase tracking-wide text-foreground mb-4">
                    {selectedHome.team}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Squad Size</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedHome.squad.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Total Goals</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedHome.totalGoals}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Total Caps</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedHome.totalCaps}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Avg Goals/Player</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedHome.avgGoals}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Avg Caps/Player</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedHome.avgCaps}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Coach</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedHome.coach}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Away Team Stats */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] font-black text-2xl uppercase tracking-wide text-foreground mb-4">
                    {selectedAway.team}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Squad Size</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedAway.squad.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Total Goals</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedAway.totalGoals}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Total Caps</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedAway.totalCaps}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Avg Goals/Player</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedAway.avgGoals}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Avg Caps/Player</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedAway.avgCaps}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-foreground">Coach</span>
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                        {selectedAway.coach}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground block mb-4">
                  Squad Comparison
                </span>
                <div className="space-y-4">
                  <StatComparison
                    label="Total Goals"
                    valueA={selectedHome.totalGoals}
                    valueB={selectedAway.totalGoals}
                    teamA={selectedHome.team}
                    teamB={selectedAway.team}
                  />
                  <StatComparison
                    label="Total Caps"
                    valueA={selectedHome.totalCaps}
                    valueB={selectedAway.totalCaps}
                    teamA={selectedHome.team}
                    teamB={selectedAway.team}
                  />
                  <StatComparison
                    label="Squad Size"
                    valueA={selectedHome.squad.length}
                    valueB={selectedAway.squad.length}
                    teamA={selectedHome.team}
                    teamB={selectedAway.team}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

function StatComparison({
  label,
  valueA,
  valueB,
  teamA,
  teamB,
}: {
  label: string
  valueA: number
  valueB: number
  teamA: string
  teamB: string
}) {
  const total = valueA + valueB
  const percentA = total > 0 ? (valueA / total) * 100 : 50
  const percentB = total > 0 ? (valueB / total) * 100 : 50

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
          {valueA}
        </span>
        <span className="font-sans text-xs text-muted-foreground">{label}</span>
        <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
          {valueB}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
        <div
          className="bg-wc-black transition-all"
          style={{ width: `${percentA}%` }}
        />
        <div
          className="bg-wc-gold transition-all"
          style={{ width: `${percentB}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-sans text-[10px] text-muted-foreground">{teamA}</span>
        <span className="font-sans text-[10px] text-muted-foreground">{teamB}</span>
      </div>
    </div>
  )
}
