'use client'

import type { Player } from '@/lib/types'
import { Trophy, Target, Calendar, Flag } from 'lucide-react'

interface PlayerCardProps {
  player: Player
  photo?: string | null
}

export function PlayerCard({ player, photo }: PlayerCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-wc-gold transition-all duration-150 hover:-translate-y-1 relative overflow-hidden group">
      {/* Player photo background on hover */}
      {photo && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundImage: `url(${photo})` }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <img 
                src={player.teamFlag} 
                alt={player.team}
                className="w-6 h-4 object-cover rounded"
              />
              <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xl uppercase tracking-wide text-foreground">
                {player.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{player.team}</p>
          </div>
          <div className="text-right">
            <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-2xl text-wc-gold">
              {player.internationalGoals}
            </span>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-wc-gold" />
            <div>
              <p className="text-xs text-muted-foreground">WC Appearances</p>
              <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm">{player.wcAppearances}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-wc-gold" />
            <div>
              <p className="text-xs text-muted-foreground">Position</p>
              <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm">{player.position}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Club</p>
          <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm">{player.club}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Jersey #{player.jersey}</p>
          <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm">{player.height}cm • {player.weight}kg</p>
        </div>
      </div>
    </div>
  )
}
