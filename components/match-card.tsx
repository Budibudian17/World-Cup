import type { Match } from '@/lib/types'
import { MapPin, HelpCircle, Lock, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const [showModal, setShowModal] = useState(false)

  // Calculate if match is within H-1 (1 day before match)
  const isWithinH1 = (() => {
    // If match is finished, always allow access
    if (match.finished === 'TRUE') {
      return true
    }

    // If match is live, always allow access
    if (match.isLive) {
      return true
    }

    // Parse the date (format: YYYY-MM-DD from the API transformation)
    const dateStr = match.date
    const timeStr = match.time

    // Create match date object
    const matchDate = new Date(`${dateStr}T${timeStr}:00`)
    const now = new Date()
    const hoursUntilMatch = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilMatch <= 24 && hoursUntilMatch > -48
  })()

  const hoursUntilMatch = (() => {
    // If match is finished, return 0
    if (match.finished === 'TRUE') {
      return 0
    }

    // If match is live, return 0
    if (match.isLive) {
      return 0
    }

    // Parse the date (format: YYYY-MM-DD from the API transformation)
    const dateStr = match.date
    const timeStr = match.time

    // Create match date object
    const matchDate = new Date(`${dateStr}T${timeStr}:00`)
    const now = new Date()
    return (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  })()

  const handleClick = () => {
    if (isWithinH1) {
      // Navigate to detail page
      window.location.href = `/matches/${match.id}`
    } else {
      // Show modal
      setShowModal(true)
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-card border border-border rounded-lg p-4 transition-all duration-150 hover:border-wc-gold hover:-translate-y-0.5 group min-w-[320px] cursor-pointer"
      >
      {/* Live badge */}
      {match.isLive && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-wc-live-red animate-pulse-live" />
          <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs uppercase text-wc-live-red">
            Live {match.minute && !isNaN(match.minute) ? `${match.minute}'` : ''}
          </span>
        </div>
      )}

      {/* Teams and Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Team A */}
        <div className={`flex-1 flex items-center gap-3 ${match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreA! > match.scoreB! ? 'opacity-100' : match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreA! < match.scoreB! ? 'opacity-50' : ''}`}>
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
          <span className={`font-[family-name:var(--font-barlow-condensed)] font-bold text-sm sm:text-base uppercase tracking-wide ${match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreA! > match.scoreB! ? 'text-wc-gold' : match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreA! < match.scoreB! ? 'text-muted-foreground' : 'text-foreground'}`}>
            {match.teamA.code}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            {(match.finished === 'TRUE' || match.isLive) && match.scoreA !== null && match.scoreB !== null ? (
              <>
                <span className={`font-[family-name:var(--font-barlow-condensed)] font-black text-xl sm:text-2xl ${match.scoreA! > match.scoreB! ? 'text-wc-gold' : match.scoreA! < match.scoreB! ? 'text-muted-foreground' : 'text-foreground'} bg-secondary px-3 py-1 rounded`}>
                  {match.scoreA}
                </span>
                <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-muted-foreground">-</span>
                <span className={`font-[family-name:var(--font-barlow-condensed)] font-black text-xl sm:text-2xl ${match.scoreB! > match.scoreA! ? 'text-wc-gold' : match.scoreB! < match.scoreA! ? 'text-muted-foreground' : 'text-foreground'} bg-secondary px-3 py-1 rounded`}>
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
        <div className={`flex-1 flex items-center justify-end gap-3 ${match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreB! > match.scoreA! ? 'opacity-100' : match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreB! < match.scoreA! ? 'opacity-50' : ''}`}>
          <span className={`font-[family-name:var(--font-barlow-condensed)] font-bold text-sm sm:text-base uppercase tracking-wide ${match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreB! > match.scoreA! ? 'text-wc-gold' : match.finished === 'TRUE' && match.scoreA !== null && match.scoreB !== null && match.scoreB! < match.scoreA! ? 'text-muted-foreground' : 'text-foreground'}`}>
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
            <span className="text-xs text-wc-live-red font-bold">Live {match.minute && !isNaN(match.minute) ? `${match.minute}'` : ''}</span>
          ) : match.finished === 'TRUE' ? (
            <span className="text-xs">Finished</span>
          ) : (
            <span className="text-xs">Not Played</span>
          )}
        </div>
      </div>
    </div>

    {/* Modal Popup */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase text-foreground mb-2">
              Match Details Coming Soon
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Detailed information will be available 1 day before the match.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-wc-gold/10 rounded-md">
              <span className="text-xs font-semibold text-wc-gold">
                Available in {hoursUntilMatch > 0 ? `${Math.ceil(hoursUntilMatch / 24)} day${Math.ceil(hoursUntilMatch / 24) > 1 ? 's' : ''}` : 'less than a day'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
