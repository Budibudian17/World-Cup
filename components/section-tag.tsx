interface SectionTagProps {
  children: React.ReactNode
}

export function SectionTag({ children }: SectionTagProps) {
  return (
    <span className="inline-block px-3 py-1 bg-wc-gold/10 rounded font-[family-name:var(--font-barlow-condensed)] font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] text-wc-gold">
      {children}
    </span>
  )
}
