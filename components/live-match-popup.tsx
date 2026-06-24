'use client'

import { useState, useEffect } from 'react'
import { X, Radio } from 'lucide-react'
import type { Match } from '@/lib/types'

interface LiveMatchPopupProps {
  liveMatches: Match[]
}

export function LiveMatchPopup({ liveMatches }: LiveMatchPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)

  useEffect(() => {
    // Only show if there are live matches
    if (liveMatches.length > 0) {
      setIsVisible(true)
    }
  }, [liveMatches])

  // Auto-rotate through live matches
  useEffect(() => {
    if (liveMatches.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentMatchIndex((prev) => (prev + 1) % liveMatches.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [liveMatches.length, isVisible])

  if (!isVisible || liveMatches.length === 0) return null

  const currentMatch = liveMatches[currentMatchIndex]

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-wc-live-red/20 to-wc-live-red/10 border-2 border-wc-live-red/50 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-wc-live-red/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-wc-live-red animate-pulse" />
            <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs uppercase text-wc-live-red">
              Live Now
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-wc-live-red hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {currentMatch.flagUrlA && (
                <img
                  src={currentMatch.flagUrlA}
                  alt={currentMatch.teamA.name}
                  className="w-6 h-4 object-cover rounded"
                />
              )}
              <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                {currentMatch.teamA.name}
              </span>
              <span className="font-bold text-lg text-wc-gold">
                {currentMatch.scoreA ?? 0}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">vs</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-wc-gold">
                {currentMatch.scoreB ?? 0}
              </span>
              <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-foreground">
                {currentMatch.teamB.name}
              </span>
              {currentMatch.flagUrlB && (
                <img
                  src={currentMatch.flagUrlB}
                  alt={currentMatch.teamB.name}
                  className="w-6 h-4 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold text-wc-live-red">
              {currentMatch.minute && !isNaN(currentMatch.minute) ? `${currentMatch.minute}'` : ''}
            </span>
            <span>{currentMatch.venue}</span>
          </div>

          <a
            href={`/matches/${currentMatch.id}`}
            className="mt-3 block w-full text-center bg-wc-live-red/20 hover:bg-wc-live-red/30 border border-wc-live-red/50 rounded py-2 text-xs font-bold uppercase text-wc-live-red transition-colors"
          >
            View Match
          </a>
        </div>

        {/* Progress indicator for multiple matches */}
        {liveMatches.length > 1 && (
          <div className="flex gap-1 px-4 pb-3">
            {liveMatches.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentMatchIndex ? 'bg-wc-live-red' : 'bg-wc-live-red/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
