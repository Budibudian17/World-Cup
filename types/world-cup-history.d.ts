declare module 'world-cup-history' {
  interface TopGoalScorer {
    name: string;
    country: string;
    numberOfGoals: number;
  }

  interface WorldCupYearData {
    hostCountry: string;
    winner: string;
    runnerUp: string;
    topGoalScorer: TopGoalScorer[];
    totalAttendance: number;
    numberOfMatches: number;
  }

  interface WorldCupHistory {
    year(year: number): WorldCupYearData;
  }

  const worldCupHistory: WorldCupHistory;
  export default worldCupHistory;
}
