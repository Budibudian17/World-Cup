'use client'

import { useState, useEffect } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import type { Group, GroupStanding } from '@/lib/types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type SortKey = 'points' | 'goalDifference'
type SortOrder = 'asc' | 'desc'

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups')
        if (response.ok) {
          const data = await response.json()
          
          // Transform API data to Group interface
          const transformedGroups = data.groups.map((group: any) => ({
            name: group.name,
            standings: group.teams.map((team: any) => ({
              team: {
                name: team.team_name,
                code: team.team_name?.substring(0, 3).toUpperCase() || 'TBA',
                flag: team.flag || '🏳️',
                group: group.name
              },
              played: parseInt(team.mp) || 0,
              won: parseInt(team.w) || 0,
              drawn: parseInt(team.d) || 0,
              lost: parseInt(team.l) || 0,
              goalsFor: parseInt(team.gf) || 0,
              goalsAgainst: parseInt(team.ga) || 0,
              goalDifference: parseInt(team.gd) || 0,
              points: parseInt(team.pts) || 0
            }))
          })).sort((a: any, b: any) => a.name.localeCompare(b.name))
          
          setGroups(transformedGroups)
        }
      } catch (error) {
        console.error('Error fetching groups:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-12">
              <SectionTag>Group Stage</SectionTag>
              <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
                All 12 Groups
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                  <div className="h-8 bg-secondary rounded mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-12 bg-secondary rounded" />
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
            <SectionTag>Group Stage</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              All 12 Groups
            </h1>
            <p className="mt-3 font-sans text-muted-foreground max-w-xl mx-auto">
              Top 2 teams from each group advance to the Round of 32. Plus 8 best third-placed teams.
            </p>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupTable key={group.name} group={group} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function GroupTable({ group }: { group: Group }) {
  const [sortKey, setSortKey] = useState<SortKey>('points')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const sortedStandings = [...group.standings].sort((a, b) => {
    const multiplier = sortOrder === 'desc' ? -1 : 1
    if (sortKey === 'points') {
      if (a.points !== b.points) return multiplier * (a.points - b.points)
      return multiplier * (a.goalDifference - b.goalDifference)
    }
    return multiplier * (a.goalDifference - b.goalDifference)
  })

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Group Header */}
      <div className="bg-wc-gold px-4 py-3">
        <h3 className="font-[family-name:var(--font-barlow-condensed)] font-black text-xl uppercase tracking-wide text-wc-black">
          Group {group.name}
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-3 text-left font-sans text-xs uppercase tracking-wider text-muted-foreground">
                Team
              </th>
              <th className="px-2 py-3 text-center font-sans text-xs uppercase tracking-wider text-muted-foreground">
                P
              </th>
              <th className="px-2 py-3 text-center font-sans text-xs uppercase tracking-wider text-muted-foreground">
                W
              </th>
              <th className="px-2 py-3 text-center font-sans text-xs uppercase tracking-wider text-muted-foreground">
                D
              </th>
              <th className="px-2 py-3 text-center font-sans text-xs uppercase tracking-wider text-muted-foreground">
                L
              </th>
              <th 
                className="px-2 py-3 text-center font-sans text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-wc-gold transition-colors"
                onClick={() => handleSort('goalDifference')}
              >
                <span className="flex items-center justify-center gap-1">
                  GD
                  <SortIndicator active={sortKey === 'goalDifference'} order={sortOrder} />
                </span>
              </th>
              <th 
                className="px-2 py-3 text-center font-sans text-xs uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-wc-gold transition-colors"
                onClick={() => handleSort('points')}
              >
                <span className="flex items-center justify-center gap-1">
                  Pts
                  <SortIndicator active={sortKey === 'points'} order={sortOrder} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((standing, index) => (
              <TeamRow key={`${group.name}-${standing.team.name}`} standing={standing} position={index + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TeamRow({ standing, position }: { standing: GroupStanding; position: number }) {
  const isQualifying = position <= 2

  return (
    <tr 
      className={cn(
        'border-b border-border last:border-0 transition-colors',
        isQualifying && 'bg-wc-gold/10'
      )}
    >
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-[family-name:var(--font-barlow-condensed)] font-bold text-sm w-5',
            isQualifying ? 'text-wc-gold' : 'text-muted-foreground'
          )}>
            {position}
          </span>
          {standing.team.flag && standing.team.flag.startsWith('http') ? (
            <img 
              src={standing.team.flag} 
              alt={standing.team.name}
              className="w-6 h-4 object-cover rounded"
            />
          ) : (
            <span className="text-lg">{standing.team.flag}</span>
          )}
          <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase tracking-wide text-foreground">
            {standing.team.name}
          </span>
        </div>
      </td>
      <td className="px-2 py-3 text-center font-sans text-sm text-foreground">
        {standing.played}
      </td>
      <td className="px-2 py-3 text-center font-sans text-sm text-foreground">
        {standing.won}
      </td>
      <td className="px-2 py-3 text-center font-sans text-sm text-foreground">
        {standing.drawn}
      </td>
      <td className="px-2 py-3 text-center font-sans text-sm text-foreground">
        {standing.lost}
      </td>
      <td className={cn(
        'px-2 py-3 text-center font-[family-name:var(--font-barlow-condensed)] font-bold text-sm',
        standing.goalDifference > 0 ? 'text-green-500' : standing.goalDifference < 0 ? 'text-red-500' : 'text-foreground'
      )}>
        {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
      </td>
      <td className="px-2 py-3 text-center">
        <span className={cn(
          'font-[family-name:var(--font-barlow-condensed)] font-black text-lg',
          isQualifying ? 'text-wc-gold' : 'text-foreground'
        )}>
          {standing.points}
        </span>
      </td>
    </tr>
  )
}

function SortIndicator({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return null
  return order === 'desc' ? (
    <ChevronDown className="w-3 h-3 text-wc-gold" />
  ) : (
    <ChevronUp className="w-3 h-3 text-wc-gold" />
  )
}
