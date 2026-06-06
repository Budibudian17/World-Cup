'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Team {
  id: string;
  name_en: string;
  flag: string;
  group: string;
}

interface PredictSelectorProps {
  teams: Team[];
  onSelect: (homeTeam: Team, awayTeam: Team) => void;
}

export function PredictSelector({ teams, onSelect }: PredictSelectorProps) {
  const [homeIndex, setHomeIndex] = useState(0);
  const [awayIndex, setAwayIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePredict = () => {
    if (homeIndex !== awayIndex) {
      onSelect(teams[homeIndex], teams[awayIndex]);
    }
  };

  const handleHomePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setHomeIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleHomeNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setHomeIndex((prev) => (prev === teams.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAwayPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAwayIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAwayNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAwayIndex((prev) => (prev === teams.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const homeTeam = teams[homeIndex];
  const awayTeam = teams[awayIndex];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Team Selection */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full max-w-4xl">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center gap-4 w-full">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Home Team
          </label>
          <div className="relative w-full max-w-xs">
            <button
              onClick={handleHomePrev}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 p-2 bg-card border border-border rounded-full hover:bg-secondary hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className={`
              bg-card border-2 border-border rounded-xl p-4 md:p-6 text-center mx-4 md:mx-8 transition-all duration-300
              ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            `}>
              <img
                src={homeTeam.flag}
                alt={homeTeam.name_en}
                className="w-12 h-9 md:w-16 md:h-12 mx-auto mb-2 md:mb-3 object-cover rounded transition-all duration-300 hover:scale-105"
              />
              <h3 className="font-[family-name:var(--font-barlow-condensed)] font-black text-lg md:text-xl uppercase text-foreground mb-1 transition-all duration-300">
                {homeTeam.name_en}
              </h3>
              <span className="font-sans text-xs text-muted-foreground transition-all duration-300">
                Group {homeTeam.group}
              </span>
            </div>

            <button
              onClick={handleHomeNext}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 p-2 bg-card border border-border rounded-full hover:bg-secondary hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <span className="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl md:text-4xl text-wc-gold transition-all duration-300">
            VS
          </span>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center gap-4 w-full">
          <label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Away Team
          </label>
          <div className="relative w-full max-w-xs">
            <button
              onClick={handleAwayPrev}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 p-2 bg-card border border-border rounded-full hover:bg-secondary hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className={`
              bg-card border-2 border-border rounded-xl p-4 md:p-6 text-center mx-4 md:mx-8 transition-all duration-300
              ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
            `}>
              <img
                src={awayTeam.flag}
                alt={awayTeam.name_en}
                className="w-12 h-9 md:w-16 md:h-12 mx-auto mb-2 md:mb-3 object-cover rounded transition-all duration-300 hover:scale-105"
              />
              <h3 className="font-[family-name:var(--font-barlow-condensed)] font-black text-lg md:text-xl uppercase text-foreground mb-1 transition-all duration-300">
                {awayTeam.name_en}
              </h3>
              <span className="font-sans text-xs text-muted-foreground transition-all duration-300">
                Group {awayTeam.group}
              </span>
            </div>

            <button
              onClick={handleAwayNext}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 p-2 bg-card border border-border rounded-full hover:bg-secondary hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        disabled={homeIndex === awayIndex || isAnimating}
        className="bg-wc-gold text-wc-black font-[family-name:var(--font-barlow-condensed)] font-black text-base md:text-lg uppercase tracking-wider py-3 md:py-4 px-8 md:px-12 rounded-lg hover:bg-wc-gold-light hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full md:w-auto"
      >
        Get Prediction
      </button>
    </div>
  );
}
