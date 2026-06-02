interface Team {
  id: string;
  name_en: string;
  flag: string;
  group: string;
}

interface TeamStats {
  team: string;
  appearances: number;
  championships: number;
  totalGoals: number;
  avgGoals: number;
}

export async function getTeamsList(): Promise<Team[]> {
  const response = await fetch('/api/teams');
  const data = await response.json();
  return data.teams;
}

export async function getTeamStats(teamName: string): Promise<TeamStats> {
  const response = await fetch(
    `https://api.zafronix.com/fifa/worldcup/v1/teams/${teamName}`,
    {
      headers: { 'X-API-Key': process.env.NEXT_PUBLIC_ZAFRONIX_API_KEY || '' },
      next: { revalidate: 86400 }
    }
  );

  const data = await response.json();
  
  return {
    team: data.name,
    appearances: data.totalAppearances || 0,
    championships: data.championships || 0,
    totalGoals: data.totalGoals || 0,
    avgGoals: data.totalGoals ? Math.round(data.totalGoals / (data.totalAppearances || 1) * 10) / 10 : 0
  };
}

export async function getSquadStats(teamName: string) {
  try {
    const response = await fetch(
      `https://api.zafronix.com/fifa/worldcup/v1/teams/${teamName}/roster?year=2026`,
      {
        headers: { 'X-API-Key': process.env.NEXT_PUBLIC_ZAFRONIX_API_KEY || '' },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch squad stats for ${teamName}`);
    }

    const data = await response.json();
    
    if (!data.players || !Array.isArray(data.players)) {
      throw new Error(`Invalid squad data for ${teamName}`);
    }
    
    const totalGoals = data.players.reduce((sum: number, p: any) => sum + (p.internationalGoals || 0), 0);
    const totalCaps = data.players.reduce((sum: number, p: any) => sum + (p.caps || 0), 0);

    return {
      team: data.team || teamName,
      squad: data.players,
      totalGoals,
      totalCaps,
      avgGoals: data.players.length > 0 ? (totalGoals / data.players.length).toFixed(1) : '0',
      avgCaps: data.players.length > 0 ? (totalCaps / data.players.length).toFixed(1) : '0',
      coach: data.coach?.name || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching squad stats for ${teamName}:`, error);
    // Return fallback data
    return {
      team: teamName,
      squad: [],
      totalGoals: 0,
      totalCaps: 0,
      avgGoals: '0',
      avgCaps: '0',
      coach: 'Unknown'
    };
  }
}
