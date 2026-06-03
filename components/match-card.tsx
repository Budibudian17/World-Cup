import type { Match } from '@/lib/types'
import { MapPin, HelpCircle } from 'lucide-react'

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 transition-all duration-150 hover:border-wc-gold hover:-translate-y-0.5 group min-w-[320px]">
      {/* Live badge */}
      {match.isLive && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-wc-live-red animate-pulse-live" />
          <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs uppercase text-wc-live-red">
            Live {match.minute}&apos;
          </span>
        </div>
      )}

      {/* Teams and Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Team A */}
        <div className="flex-1 flex items-center gap-3">
          {match.flagUrlA ? (
            <img 
              src={match.flagUrlA} 
              alt={match.teamA.name}
              className="w-8 h-6 object-cover rounded"
            />
          ) : match.teamA.flag === '🏳️' ? (
            <HelpCircle className="w-8 h-6 text-muted-foreground" />
          ) : (
            <span className="text-2xl">{match.teamA.flag}</span>
          )}
          <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm sm:text-base uppercase tracking-wide text-foreground">
            {match.teamA.code}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            {match.scoreA !== null && match.scoreB !== null ? (
              <>
                <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-xl sm:text-2xl text-foreground bg-secondary px-3 py-1 rounded">
                  {match.scoreA}
                </span>
                <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-muted-foreground">-</span>
                <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-xl sm:text-2xl text-foreground bg-secondary px-3 py-1 rounded">
                  {match.scoreB}
                </span>
              </>
            ) : (
              <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg text-wc-gold">
                -
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {match.date} | {match.time}
          </span>
        </div>

        {/* Team B */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm sm:text-base uppercase tracking-wide text-foreground">
            {match.teamB.code}
          </span>
          {match.flagUrlB ? (
            <img 
              src={match.flagUrlB} 
              alt={match.teamB.name}
              className="w-8 h-6 object-cover rounded"
            />
          ) : match.teamB.flag === '🏳️' ? (
            <HelpCircle className="w-8 h-6 text-muted-foreground" />
          ) : (
            <span className="text-2xl">{match.teamB.flag}</span>
          )}
        </div>
      </div>

      {/* Venue and Time */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="text-xs">{match.venue}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {match.isLive ? (
            <span className="text-xs text-wc-live-red font-bold">Live {match.minute}'</span>
          ) : match.finished === 'TRUE' ? (
            <span className="text-xs">Finished</span>
          ) : (
            <span className="text-xs">Not Played</span>
          )}
        </div>
      </div>
    </div>
  )
}
