'use client'

import { useState, useEffect } from 'react'
import { X, Heart, Handshake } from 'lucide-react'

export function SupportModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('supportModalShown')
    if (!hasSeenModal) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem('supportModalShown', 'true')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-wc-gold/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-wc-gold" />
          </div>
          <h3 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-2xl uppercase text-foreground mb-2">
            Support This Project
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Help me unlock the Premium API for instant World Cup 2026 stats, live events, and player updates !
          </p>

          {/* Payment Methods */}
          <div className="space-y-3">
            <a
              href="https://paypal.me/HilmiFarrel?locale.x=id_ID&country.x=ID"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-card border border-border rounded-lg p-4 hover:border-wc-gold transition-colors"
            >
              <img
                src="/img/paypallogo.webp"
                alt="PayPal"
                className="w-24 h-8 mx-auto object-contain"
              />
              <p className="text-xs text-muted-foreground mt-2">International users</p>
            </a>

            <a
              href="https://saweria.co/NgideInteractive"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-card border border-border rounded-lg p-4 hover:border-wc-gold transition-colors"
            >
              <img
                src="/img/sawerialogo.webp"
                alt="Saweria"
                className="w-24 h-8 mx-auto object-contain"
              />
              <p className="text-xs text-muted-foreground mt-2">Indonesian users</p>
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
            Thank you for your support! <Handshake className="w-3 h-3" />
          </p>
        </div>
      </div>
    </div>
  )
}
