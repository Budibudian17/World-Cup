import Link from 'next/link'
import { Coffee, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="/img/logoworldcupbaru.webp" 
              alt="FIFA World Cup 2026"
              className="h-16 w-auto mb-4"
            />
            <p className="font-sans text-sm text-muted-foreground text-center md:text-left">
              Fan-made World Cup 2026 Hub. Not affiliated with FIFA.<br />
              Created by Hilmi Farrel Firjatullah
            </p>
          </div>

          {/* Middle: Navigation */}
          <div className="flex flex-col items-center">
            <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/bracket" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                  Bracket
                </Link>
              </li>
              <li>
                <Link href="/groups" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                  Groups
                </Link>
              </li>
              <li>
                <Link href="/venues" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                  Venues
                </Link>
              </li>
              <li>
                <Link href="/predict" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                  Predict
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="font-sans text-sm text-muted-foreground hover:text-wc-gold transition-colors">
                  Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Social Media */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase tracking-wide text-foreground mb-4">
              Follow & SUPPORT ME
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://saweria.co/NgideInteractive" 
                className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                aria-label="Saweria"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Coffee className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/hilmifarrelfirjatullah/" 
                className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@budibudian17" 
                className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full hover:bg-wc-gold hover:text-background transition-colors"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="font-sans text-xs text-muted-foreground">
            © 2026 FIFA World Cup Fan Hub | Hilmi Farrel Firjatullah | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
