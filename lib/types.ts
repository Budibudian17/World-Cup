export interface Team {
  name: string;
  code: string;
  flag: string;
  group: string;
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  scoreA?: number | null;
  scoreB?: number | null;
  venue: string;
  date: string;
  time: string;
  isLive: boolean;
  minute?: number;
  flagUrlA?: string | null;
  flagUrlB?: string | null;
}

export interface GroupStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Group {
  name: string;
  standings: GroupStanding[];
}

export interface BracketMatch {
  id: string;
  round: string;
  matchNumber: number;
  teamA: Team | null;
  teamB: Team | null;
  winner: Team | null;
}

export interface BracketState {
  [key: string]: BracketMatch;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  timezone: string;
  matchesHosted: number;
  image: string;
  description: string;
  imageUrl?: string;
  surfaceType?: string;
  opened?: number;
  elevationM?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  historicTournaments?: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface PredictionResult {
  predictedScore: string;
  teamAWin: number;
  draw: number;
  teamBWin: number;
  teamAxG: number;
  teamBxG: number;
  teamAShotsOnTarget: number;
  teamBShotsOnTarget: number;
  teamAPossession: number;
  teamBPossession: number;
  teamAKeyPlayer: string;
  teamBKeyPlayer: string;
  tacticalSummary: string;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  teamFlag: string;
  jersey: number;
  position: string;
  club: string;
  birthDate: string;
  height: number;
  weight: number;
  internationalCaps: number;
  internationalGoals: number;
  wcAppearances: number;
  wcGoals: number;
}

export interface PlayerAppearance {
  year: number;
  team: string;
  position: string;
  jersey: number;
  goals: number;
  captain: boolean;
  club: {
    name: string;
    country: string;
  };
}
