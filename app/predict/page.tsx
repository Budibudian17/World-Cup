'use client'

import { useState } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import { teams } from '@/lib/data'
import type { Team, PredictionResult } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Loader2, RefreshCw, User } from 'lucide-react'

export default function PredictPage() {
  const [teamA, setTeamA] = useState<Team | null>(null)
  const [teamB, setTeamB] = useState<Team | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(false)

  const handleAnalyse = async () => {
    if (!teamA || !teamB || cooldown) return

    setLoading(true)
    setError(null)
    setResult(null)
    setCooldown(true)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamA: teamA.name, teamB: teamB.name }),
      })

      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }

      const data = await response.json()
      setResult(data)
    } catch {
      setError('Failed to analyse match. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => setCooldown(false), 3000)
    }
  }

  const canAnalyse = teamA && teamB && teamA.code !== teamB.code && !loading && !cooldown

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
              Select two teams and let AI analyse the potential matchup with predicted scores and tactical insights.
            </p>
          </div>

          {/* Team Selection */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Team A Selector */}
              <div className="flex-1 w-full">
                <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Team A
                </label>
                <TeamSelector
                  value={teamA}
                  onChange={setTeamA}
                  excludeTeam={teamB}
                />
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center">
                <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl text-wc-gold">
                  VS
                </span>
              </div>

              {/* Team B Selector */}
              <div className="flex-1 w-full">
                <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Team B
                </label>
                <TeamSelector
                  value={teamB}
                  onChange={setTeamB}
                  excludeTeam={teamA}
                />
              </div>
            </div>

            {/* Analyse Button */}
            <button
              onClick={handleAnalyse}
              disabled={!canAnalyse}
              className={cn(
                'w-full mt-6 py-4 rounded-lg font-[family-name:var(--font-barlow-condensed)] font-black text-lg uppercase tracking-wider transition-all',
                canAnalyse
                  ? 'bg-wc-gold text-wc-black hover:bg-wc-gold-light'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analysing...
                </span>
              ) : cooldown ? (
                'Please wait...'
              ) : (
                'Analyse Match'
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-8 bg-card border border-border rounded-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-wc-gold/10 to-transparent animate-scan" />
              <div className="relative z-10 text-center">
                <p className="font-sans text-muted-foreground">Analysing tactical data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-8 bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
              <p className="font-sans text-destructive mb-4">{error}</p>
              <button
                onClick={handleAnalyse}
                disabled={cooldown}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-sans text-sm">Retry</span>
              </button>
            </div>
          )}

          {/* Results */}
          {result && teamA && teamB && (
            <div className="mt-8 space-y-6">
              {/* Predicted Score */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 text-center">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Predicted Score
                </span>
                <div className="mt-4 flex items-center justify-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <span className="text-4xl block mb-2">{teamA.flag}</span>
                    <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground">
                      {teamA.code}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-4xl sm:text-6xl text-wc-gold">
                    {result.predictedScore}
                  </span>
                  <div className="text-center">
                    <span className="text-4xl block mb-2">{teamB.flag}</span>
                    <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground">
                      {teamB.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Win Probability */}
              <div className="bg-card border border-border rounded-xl p-6">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground block mb-4">
                  Win Probability
                </span>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-wc-black flex items-center justify-center transition-all"
                    style={{ width: `${result.teamAWin}%` }}
                  >
                    {result.teamAWin >= 15 && (
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-white">
                        {result.teamAWin}%
                      </span>
                    )}
                  </div>
                  <div
                    className="bg-wc-gray-3 flex items-center justify-center transition-all"
                    style={{ width: `${result.draw}%` }}
                  >
                    {result.draw >= 10 && (
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-white">
                        {result.draw}%
                      </span>
                    )}
                  </div>
                  <div
                    className="bg-wc-gold flex items-center justify-center transition-all"
                    style={{ width: `${result.teamBWin}%` }}
                  >
                    {result.teamBWin >= 15 && (
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-wc-black">
                        {result.teamBWin}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-sans text-xs text-muted-foreground">{teamA.code}</span>
                  <span className="font-sans text-xs text-muted-foreground">Draw</span>
                  <span className="font-sans text-xs text-muted-foreground">{teamB.code}</span>
                </div>
              </div>

              {/* Stats Comparison */}
              <div className="bg-card border border-border rounded-xl p-6">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground block mb-4">
                  Match Statistics
                </span>
                <div className="space-y-4">
                  <StatComparison
                    label="Expected Goals (xG)"
                    valueA={result.teamAxG}
                    valueB={result.teamBxG}
                    teamA={teamA.code}
                    teamB={teamB.code}
                  />
                  <StatComparison
                    label="Shots on Target"
                    valueA={result.teamAShotsOnTarget}
                    valueB={result.teamBShotsOnTarget}
                    teamA={teamA.code}
                    teamB={teamB.code}
                  />
                  <StatComparison
                    label="Possession %"
                    valueA={result.teamAPossession}
                    valueB={result.teamBPossession}
                    teamA={teamA.code}
                    teamB={teamB.code}
                  />
                </div>
              </div>

              {/* Key Players */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KeyPlayerCard team={teamA} playerName={result.teamAKeyPlayer} />
                <KeyPlayerCard team={teamB} playerName={result.teamBKeyPlayer} />
              </div>

              {/* Tactical Summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground block mb-4">
                  Tactical Analysis
                </span>
                <p className="font-sans text-foreground leading-relaxed">
                  {result.tacticalSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

function TeamSelector({
  value,
  onChange,
  excludeTeam,
}: {
  value: Team | null
  onChange: (team: Team) => void
  excludeTeam: Team | null
}) {
  return (
    <select
      value={value?.code || ''}
      onChange={(e) => {
        const team = teams.find((t) => t.code === e.target.value)
        if (team) onChange(team)
      }}
      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-sans text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-wc-gold"
    >
      <option value="">Select a team...</option>
      {teams
        .filter((t) => t.code !== excludeTeam?.code)
        .map((team) => (
          <option key={team.code} value={team.code}>
            {team.flag} {team.name}
          </option>
        ))}
    </select>
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
          {valueA.toFixed(1)}
        </span>
        <span className="font-sans text-xs text-muted-foreground">{label}</span>
        <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
          {valueB.toFixed(1)}
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

function KeyPlayerCard({ team, playerName }: { team: Team; playerName: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
        <User className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground block">
          Key Player - {team.code}
        </span>
        <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg text-foreground">
          {playerName}
        </span>
      </div>
    </div>
  )
}
