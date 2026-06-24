import Image from 'next/image'

interface Player {
  id: number
  name: string
  number: number
  photo: string
  pos: string
  grid?: string
}

interface LineupPlayer {
  player: Player
  position?: {
    x: number
    y: number
  }
}

interface TeamLineup {
  team: {
    id: number
    name: string
    logo: string
  }
  coach: {
    id: number
    name: string
    photo: string | null
  }
  formation: string
  startXI: LineupPlayer[]
  substitutes: LineupPlayer[]
}

interface LineupFieldProps {
  homeTeam: TeamLineup
  awayTeam: TeamLineup
  betweenFieldAndSubstitutes?: React.ReactNode
  homeFlagUrl?: string | null
  awayFlagUrl?: string | null
  homeTeamName?: string
  awayTeamName?: string
}

// Parse grid position string (e.g., "2:4") to row and column
function parseGridPosition(grid: string): { row: number; col: number } {
  const [row, col] = grid.split(':').map(Number)
  return { row, col }
}

// Convert grid position to percentage coordinates
function gridToPercentage(grid: string, isHome: boolean): { x: number; y: number } {
  const { row, col } = parseGridPosition(grid)

  // Grid system: row = depth (1=GK, higher=forwards), col = width (1=left, higher=right)
  // Assuming max grid is 5x5 based on typical formations

  const maxRow = 5
  const maxCol = 5

  // Convert to percentage (0-100)
  // For horizontal field:
  // col (width) maps to y (top to bottom) - spread players vertically
  // row (depth) maps to x (left to right) - GK to forwards
  const depthPercent = ((row - 1) / (maxRow - 1)) * 100
  const widthPercent = ((col - 1) / (maxCol - 1)) * 100

  if (isHome) {
    // Home team on left half: GK at left edge (x=2.5%), forwards at center (x=47.5%)
    // Spread players across full height (y)
    const x = depthPercent * 0.45 + 2.5
    const y = widthPercent * 0.8 + 10
    return { x, y }
  } else {
    // Away team on right half: GK at right edge (x=97.5%), forwards at center (x=52.5%)
    // Spread players across full height (y)
    const x = 100 - (depthPercent * 0.45 + 2.5)
    const y = widthPercent * 0.8 + 10
    return { x, y }
  }
}

// Generate positions based on formation string
function generatePositionsFromFormation(formation: string, isHome: boolean) {
  const positions: Array<{ x: number; y: number }> = []

  // Parse formation (e.g., "4-3-3" -> [4, 3, 3])
  const formationParts = formation.split('-').map(Number)

  // Goalkeeper (always at center of goal line)
  if (isHome) {
    positions.push({ x: 5, y: 50 }) // Home GK at left
  } else {
    positions.push({ x: 95, y: 50 }) // Away GK at right
  }

  // Generate positions for each line
  let currentY = 20
  const yStep = 80 / (formationParts.length + 1)

  formationParts.forEach((count, lineIndex) => {
    const lineY = 20 + (lineIndex + 1) * yStep
    const xStep = isHome ? 40 / (count + 1) : 40 / (count + 1)
    const startX = isHome ? 10 : 50

    for (let i = 0; i < count; i++) {
      const x = startX + (i + 1) * xStep
      positions.push({ x, y: lineY })
    }
  })

  return positions
}

export function LineupField({ homeTeam, awayTeam, betweenFieldAndSubstitutes, homeFlagUrl, awayFlagUrl, homeTeamName, awayTeamName }: LineupFieldProps) {
  // Generate positions from grid if available, otherwise use fallback
  const homePositions = homeTeam.startXI.map((player, index) => {
    if (player.player?.grid) {
      return gridToPercentage(player.player.grid, true)
    }
    if (player.position) {
      return player.position
    }
    const allPositions = generatePositionsFromFormation(homeTeam.formation, true)
    return allPositions[index] || { x: 50, y: 50 }
  })

  const awayPositions = awayTeam.startXI.map((player, index) => {
    if (player.player?.grid) {
      return gridToPercentage(player.player.grid, false)
    }
    if (player.position) {
      return player.position
    }
    const allPositions = generatePositionsFromFormation(awayTeam.formation, false)
    return allPositions[index] || { x: 50, y: 50 }
  })

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Team flags above field */}
      <div className="flex justify-between items-center px-8">
        <div className="flex items-center gap-4">
          {homeFlagUrl && (
            <img
              src={homeFlagUrl}
              alt={homeTeamName || homeTeam.team.name}
              className="w-16 h-12 object-contain"
            />
          )}
          <div>
            <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xl text-foreground">
              {homeTeamName || homeTeam.team.name}
            </span>
            {homeTeam.coach && homeTeam.coach.name && homeTeam.coach.name !== 'TBA Coach' && (
              <div className="text-xs text-muted-foreground">
                Coach: {homeTeam.coach.name}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xl text-foreground">
              {awayTeamName || awayTeam.team.name}
            </span>
            {awayTeam.coach && awayTeam.coach.name && awayTeam.coach.name !== 'TBA Coach' && (
              <div className="text-xs text-muted-foreground">
                Coach: {awayTeam.coach.name}
              </div>
            )}
          </div>
          {awayFlagUrl && (
            <img
              src={awayFlagUrl}
              alt={awayTeamName || awayTeam.team.name}
              className="w-16 h-12 object-contain"
            />
          )}
        </div>
      </div>

      {/* Single Field with Both Teams */}
      <div className="relative bg-green-900/30 border-2 border-green-700/50 rounded-lg overflow-hidden">
        {/* Field markings */}
        <div className="absolute inset-0">
          {/* Center line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20" />
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full" />
          
          {/* Penalty areas */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 border-2 border-white/20 border-l-0" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 border-2 border-white/20 border-r-0" />
          
          {/* Goal areas */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 border-2 border-white/20 border-l-0" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-16 border-2 border-white/20 border-r-0" />
        </div>

        {/* Players on field - teams facing each other horizontally (home left, away right) */}
        <div className="relative h-[400px]">
          {/* Home team players (left half, facing right) */}
          {homeTeam.startXI.map((lineupPlayer, index) => {
            const position = homePositions[index] || { x: 50, y: 50 }
            return (
              <div
                key={lineupPlayer.player.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
              >
                <div className="relative w-12 h-12 mb-1">
                  {lineupPlayer.player.photo ? (
                    <Image
                      src={lineupPlayer.player.photo}
                      alt={lineupPlayer.player.name}
                      fill
                      className="rounded-full object-cover border-2 border-wc-gold"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-wc-gold/20 border-2 border-wc-gold flex items-center justify-center">
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs text-wc-gold">
                        {lineupPlayer.player.number}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs text-foreground">
                    {lineupPlayer.player.number}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                    {lineupPlayer.player.name}
                  </p>
                  <p className="text-[10px] text-wc-gold">
                    {lineupPlayer.player.pos}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Away team players (right half, facing left) */}
          {awayTeam.startXI.map((lineupPlayer, index) => {
            const position = awayPositions[index] || { x: 50, y: 50 }
            return (
              <div
                key={lineupPlayer.player.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
              >
                <div className="relative w-12 h-12 mb-1">
                  {lineupPlayer.player.photo ? (
                    <Image
                      src={lineupPlayer.player.photo}
                      alt={lineupPlayer.player.name}
                      fill
                      className="rounded-full object-cover border-2 border-blue-400"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 border-2 border-blue-400 flex items-center justify-center">
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs text-blue-400">
                        {lineupPlayer.player.number}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs text-foreground">
                    {lineupPlayer.player.number}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                    {lineupPlayer.player.name}
                  </p>
                  <p className="text-[10px] text-blue-400">
                    {lineupPlayer.player.pos}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content between field and substitutes */}
      {betweenFieldAndSubstitutes}

      {/* Substitutes - Side by Side */}
      <div className="grid grid-cols-2 gap-8">
        {/* Home Team Substitutes - Bench Style */}
        <div className="bg-gradient-to-b from-amber-900/20 to-amber-950/30 border-2 border-amber-700/50 rounded-lg p-4 relative overflow-hidden">
          {/* Bench texture */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)'
            }} />
          </div>
          <div className="relative">
            <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase text-amber-200 mb-3">
              Home Bench
            </h4>
          <div className="flex flex-wrap gap-2">
            {homeTeam.substitutes.map((lineupPlayer) => (
              <div
                key={lineupPlayer.player.id}
                className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg group cursor-pointer hover:bg-secondary transition-colors"
              >
                <div className="relative w-8 h-8">
                  {lineupPlayer.player.photo ? (
                    <Image
                      src={lineupPlayer.player.photo}
                      alt={lineupPlayer.player.name}
                      fill
                      className="rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-wc-gold/20 border border-wc-gold flex items-center justify-center">
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-[10px] text-wc-gold">
                        {lineupPlayer.player.number}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs text-foreground">
                    {lineupPlayer.player.number}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {lineupPlayer.player.name}
                  </p>
                </div>
                <span className="text-[10px] text-wc-gold ml-1">
                  {lineupPlayer.player.pos}
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Away Team Substitutes - Bench Style */}
        <div className="bg-gradient-to-b from-blue-900/20 to-blue-950/30 border-2 border-blue-700/50 rounded-lg p-4 relative overflow-hidden">
          {/* Bench texture */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)'
            }} />
          </div>
          <div className="relative">
            <h4 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm uppercase text-blue-200 mb-3">
              Away Bench
            </h4>
          <div className="flex flex-wrap gap-2">
            {awayTeam.substitutes.map((lineupPlayer) => (
              <div
                key={lineupPlayer.player.id}
                className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-lg group cursor-pointer hover:bg-secondary transition-colors"
              >
                <div className="relative w-8 h-8">
                  {lineupPlayer.player.photo ? (
                    <Image
                      src={lineupPlayer.player.photo}
                      alt={lineupPlayer.player.name}
                      fill
                      className="rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-400/20 border border-blue-400 flex items-center justify-center">
                      <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-[10px] text-blue-400">
                        {lineupPlayer.player.number}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xs text-foreground">
                    {lineupPlayer.player.number}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {lineupPlayer.player.name}
                  </p>
                </div>
                <span className="text-[10px] text-blue-400 ml-1">
                  {lineupPlayer.player.pos}
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
