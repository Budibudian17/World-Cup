'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { liveMatches } from '@/lib/data'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/groups', label: 'Groups' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/predict', label: 'Predict' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/venues', label: 'Venues' },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const hasLiveMatch = liveMatches.some((m) => m.isLive)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 h-24 bg-card border-b-2 border-wc-gold">
      <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            {mounted && (
              <img
                src={theme === 'dark' ? '/img/logoworldcupbaru.webp' : '/img/logoworldcupbaru.webp'}
                alt="World Cup 2026 Logo"
                className="h-12 w-auto sm:h-14"
              />
            )}
          </div>
          <span className="font-(family-name:--font-barlow-condensed) font-bold text-lg text-foreground uppercase tracking-wider hidden sm:block">
            World Cup 2026
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-(family-name:--font-barlow-condensed) font-bold text-sm uppercase tracking-wider transition-colors hover:text-wc-gold',
                pathname === link.href ? 'text-wc-gold' : 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Live Badge */}
          {hasLiveMatch && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-wc-live-red/10 rounded">
              <span className="w-2 h-2 rounded-full bg-wc-live-red animate-pulse-live" />
              <span className="font-(family-name:--font-barlow-condensed) font-bold text-xs uppercase text-wc-live-red">
                Live
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-wc-gold" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b-2 border-wc-gold">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'font-(family-name:--font-barlow-condensed) font-bold text-base uppercase tracking-wider py-2 transition-colors hover:text-wc-gold',
                  pathname === link.href ? 'text-wc-gold' : 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
