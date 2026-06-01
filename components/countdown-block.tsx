'use client'

import { useState, useEffect } from 'react'
import { finalDate } from '@/lib/data'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownBlock() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = finalDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-card border border-wc-gold/30 rounded-lg px-3 py-2 sm:px-5 sm:py-3 min-w-[60px] sm:min-w-[80px]">
              <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-2xl sm:text-4xl md:text-5xl text-wc-gold tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="font-sans text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-2">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-2xl sm:text-4xl text-wc-gold/50 -mt-6">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
