import type { Team, Match, Group, Venue, QuizQuestion } from './types';

export const teams: Team[] = [
  // Group A
  { name: 'United States', code: 'USA', flag: '🇺🇸', group: 'A' },
  { name: 'Morocco', code: 'MAR', flag: '🇲🇦', group: 'A' },
  { name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'A' },
  { name: 'Serbia', code: 'SRB', flag: '🇷🇸', group: 'A' },
  // Group B
  { name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'B' },
  { name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'B' },
  { name: 'Denmark', code: 'DEN', flag: '🇩🇰', group: 'B' },
  { name: 'Peru', code: 'PER', flag: '🇵🇪', group: 'B' },
  // Group C
  { name: 'France', code: 'FRA', flag: '🇫🇷', group: 'C' },
  { name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'C' },
  { name: 'Senegal', code: 'SEN', flag: '🇸🇳', group: 'C' },
  { name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', group: 'C' },
  // Group D
  { name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'D' },
  { name: 'Italy', code: 'ITA', flag: '🇮🇹', group: 'D' },
  { name: 'Albania', code: 'ALB', flag: '🇦🇱', group: 'D' },
  { name: 'Paraguay', code: 'PAR', flag: '🇵🇾', group: 'D' },
  // Group E
  { name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'E' },
  { name: 'Netherlands', code: 'NED', flag: '🇳🇱', group: 'E' },
  { name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', group: 'E' },
  { name: 'Ecuador', code: 'ECU', flag: '🇪🇨', group: 'E' },
  // Group F
  { name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'F' },
  { name: 'Mexico', code: 'MEX', flag: '🇲🇽', group: 'F' },
  { name: 'Japan', code: 'JPN', flag: '🇯🇵', group: 'F' },
  { name: 'Slovenia', code: 'SVN', flag: '🇸🇮', group: 'F' },
  // Group G
  { name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'G' },
  { name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'G' },
  { name: 'South Korea', code: 'KOR', flag: '🇰🇷', group: 'G' },
  { name: 'Cameroon', code: 'CMR', flag: '🇨🇲', group: 'G' },
  // Group H
  { name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'H' },
  { name: 'Poland', code: 'POL', flag: '🇵🇱', group: 'H' },
  { name: 'Ukraine', code: 'UKR', flag: '🇺🇦', group: 'H' },
  { name: 'Bolivia', code: 'BOL', flag: '🇧🇴', group: 'H' },
  // Group I
  { name: 'Belgium', code: 'BEL', flag: '🇧🇪', group: 'I' },
  { name: 'Canada', code: 'CAN', flag: '🇨🇦', group: 'I' },
  { name: 'Iran', code: 'IRN', flag: '🇮🇷', group: 'I' },
  { name: 'Ghana', code: 'GHA', flag: '🇬🇭', group: 'I' },
  // Group J
  { name: 'Croatia', code: 'CRO', flag: '🇭🇷', group: 'J' },
  { name: 'Switzerland', code: 'SUI', flag: '🇨🇭', group: 'J' },
  { name: 'Nigeria', code: 'NGA', flag: '🇳🇬', group: 'J' },
  { name: 'Costa Rica', code: 'CRC', flag: '🇨🇷', group: 'J' },
  // Group K
  { name: 'Chile', code: 'CHI', flag: '🇨🇱', group: 'K' },
  { name: 'Egypt', code: 'EGY', flag: '🇪🇬', group: 'K' },
  { name: 'Wales', code: 'WAL', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', group: 'K' },
  { name: 'Panama', code: 'PAN', flag: '🇵🇦', group: 'K' },
  // Group L
  { name: 'Austria', code: 'AUT', flag: '🇦🇹', group: 'L' },
  { name: 'Turkey', code: 'TUR', flag: '🇹🇷', group: 'L' },
  { name: 'Venezuela', code: 'VEN', flag: '🇻🇪', group: 'L' },
  { name: 'New Zealand', code: 'NZL', flag: '🇳🇿', group: 'L' },
];

export const liveMatches: Match[] = [
  {
    id: '1',
    teamA: teams[0], // USA
    teamB: teams[1], // Morocco
    scoreA: null,
    scoreB: null,
    venue: 'MetLife Stadium',
    date: '2026-06-11',
    time: '18:00',
    isLive: false,
    minute: 0,
  },
  {
    id: '2',
    teamA: teams[4], // Argentina
    teamB: teams[5], // Australia
    venue: 'AT&T Stadium',
    date: '2026-06-11',
    time: '21:00',
    isLive: false,
  },
  {
    id: '3',
    teamA: teams[8], // France
    teamB: teams[9], // Colombia
    venue: 'SoFi Stadium',
    date: '2026-06-12',
    time: '15:00',
    isLive: false,
  },
];

export const groups: Group[] = [
  {
    name: 'A',
    standings: [
      { team: teams[0], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 7 },
      { team: teams[1], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
      { team: teams[2], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
      { team: teams[3], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 4, goalDifference: -3, points: 1 },
    ],
  },
  {
    name: 'B',
    standings: [
      { team: teams[4], played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 8, goalsAgainst: 1, goalDifference: 7, points: 9 },
      { team: teams[5], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { team: teams[6], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3 },
      { team: teams[7], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 1 },
    ],
  },
  {
    name: 'C',
    standings: [
      { team: teams[8], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, points: 7 },
      { team: teams[9], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
      { team: teams[10], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
      { team: teams[11], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 },
    ],
  },
  {
    name: 'D',
    standings: [
      { team: teams[12], played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 7, goalsAgainst: 0, goalDifference: 7, points: 9 },
      { team: teams[13], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
      { team: teams[14], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 3 },
      { team: teams[15], played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 0, goalsAgainst: 6, goalDifference: -6, points: 0 },
    ],
  },
  {
    name: 'E',
    standings: [
      { team: teams[16], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 7 },
      { team: teams[17], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
      { team: teams[18], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 3, goalDifference: -1, points: 3 },
      { team: teams[19], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 },
    ],
  },
  {
    name: 'F',
    standings: [
      { team: teams[20], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 7 },
      { team: teams[21], played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 5 },
      { team: teams[22], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { team: teams[23], played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 0 },
    ],
  },
  {
    name: 'G',
    standings: [
      { team: teams[24], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, points: 7 },
      { team: teams[25], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
      { team: teams[26], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { team: teams[27], played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 },
    ],
  },
  {
    name: 'H',
    standings: [
      { team: teams[28], played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 8, goalsAgainst: 2, goalDifference: 6, points: 9 },
      { team: teams[29], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { team: teams[30], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3 },
      { team: teams[31], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 },
    ],
  },
  {
    name: 'I',
    standings: [
      { team: teams[32], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 6 },
      { team: teams[33], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 6 },
      { team: teams[34], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 2, goalsAgainst: 2, goalDifference: 0, points: 4 },
      { team: teams[35], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 1 },
    ],
  },
  {
    name: 'J',
    standings: [
      { team: teams[36], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 7 },
      { team: teams[37], played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 5 },
      { team: teams[38], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { team: teams[39], played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 0 },
    ],
  },
  {
    name: 'K',
    standings: [
      { team: teams[40], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 6 },
      { team: teams[41], played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
      { team: teams[42], played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { team: teams[43], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 1 },
    ],
  },
  {
    name: 'L',
    standings: [
      { team: teams[44], played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 7 },
      { team: teams[45], played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 5 },
      { team: teams[46], played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 3, goalDifference: -1, points: 3 },
      { team: teams[47], played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 4, goalDifference: -3, points: 1 },
    ],
  },
];

export const venues: Venue[] = [
  {
    id: '1',
    name: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    country: 'USA',
    capacity: 82500,
    timezone: 'EST',
    matchesHosted: 8,
    image: '/venues/metlife.jpg',
    description: 'Home of the 2026 World Cup Final. The largest stadium in the tournament.',
  },
  {
    id: '2',
    name: 'AT&T Stadium',
    city: 'Arlington, TX',
    country: 'USA',
    capacity: 80000,
    timezone: 'CST',
    matchesHosted: 7,
    image: '/venues/att.jpg',
    description: 'Features the world\'s largest column-free interior and massive video board.',
  },
  {
    id: '3',
    name: 'SoFi Stadium',
    city: 'Los Angeles, CA',
    country: 'USA',
    capacity: 70240,
    timezone: 'PST',
    matchesHosted: 7,
    image: '/venues/sofi.jpg',
    description: 'State-of-the-art venue with a translucent roof and cutting-edge technology.',
  },
  {
    id: '4',
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens, FL',
    country: 'USA',
    capacity: 65326,
    timezone: 'EST',
    matchesHosted: 6,
    image: '/venues/hardrock.jpg',
    description: 'Features a unique canopy roof and tropical Florida atmosphere.',
  },
  {
    id: '5',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta, GA',
    country: 'USA',
    capacity: 71000,
    timezone: 'EST',
    matchesHosted: 6,
    image: '/venues/mercedes.jpg',
    description: 'Known for its retractable roof and unique pinwheel design.',
  },
  {
    id: '6',
    name: 'Levi\'s Stadium',
    city: 'Santa Clara, CA',
    country: 'USA',
    capacity: 68500,
    timezone: 'PST',
    matchesHosted: 6,
    image: '/venues/levis.jpg',
    description: 'Silicon Valley\'s premier sports venue with cutting-edge sustainability features.',
  },
  {
    id: '7',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia, PA',
    country: 'USA',
    capacity: 69176,
    timezone: 'EST',
    matchesHosted: 6,
    image: '/venues/lincoln.jpg',
    description: 'Historic venue in the City of Brotherly Love.',
  },
  {
    id: '8',
    name: 'NRG Stadium',
    city: 'Houston, TX',
    country: 'USA',
    capacity: 72220,
    timezone: 'CST',
    matchesHosted: 6,
    image: '/venues/nrg.jpg',
    description: 'Retractable roof stadium in the heart of Texas.',
  },
  {
    id: '9',
    name: 'Gillette Stadium',
    city: 'Foxborough, MA',
    country: 'USA',
    capacity: 65878,
    timezone: 'EST',
    matchesHosted: 6,
    image: '/venues/gillette.jpg',
    description: 'New England\'s premier outdoor stadium.',
  },
  {
    id: '10',
    name: 'Arrowhead Stadium',
    city: 'Kansas City, MO',
    country: 'USA',
    capacity: 76416,
    timezone: 'CST',
    matchesHosted: 6,
    image: '/venues/arrowhead.jpg',
    description: 'Famous for being one of the loudest stadiums in the world.',
  },
  {
    id: '11',
    name: 'CenturyLink Field',
    city: 'Seattle, WA',
    country: 'USA',
    capacity: 69000,
    timezone: 'PST',
    matchesHosted: 6,
    image: '/venues/centurylink.jpg',
    description: 'Pacific Northwest\'s soccer-mad stadium.',
  },
  {
    id: '12',
    name: 'BMO Field',
    city: 'Toronto, ON',
    country: 'Canada',
    capacity: 45736,
    timezone: 'EST',
    matchesHosted: 5,
    image: '/venues/bmo.jpg',
    description: 'Canada\'s premier soccer-specific stadium.',
  },
  {
    id: '13',
    name: 'BC Place',
    city: 'Vancouver, BC',
    country: 'Canada',
    capacity: 54500,
    timezone: 'PST',
    matchesHosted: 5,
    image: '/venues/bcplace.jpg',
    description: 'Features a retractable roof with stunning views of the mountains.',
  },
  {
    id: '14',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: 87523,
    timezone: 'CST',
    matchesHosted: 7,
    image: '/venues/azteca.jpg',
    description: 'Legendary stadium that has hosted two World Cup Finals.',
  },
  {
    id: '15',
    name: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'Mexico',
    capacity: 53500,
    timezone: 'CST',
    matchesHosted: 5,
    image: '/venues/bbva.jpg',
    description: 'Modern stadium nestled in the Sierra Madre mountains.',
  },
  {
    id: '16',
    name: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'Mexico',
    capacity: 49850,
    timezone: 'CST',
    matchesHosted: 5,
    image: '/venues/akron.jpg',
    description: 'Known for its volcano-inspired design and passionate atmosphere.',
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'How many teams will compete in the 2026 FIFA World Cup?',
    options: ['32', '40', '48', '64'],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: 'Which three countries are hosting the 2026 World Cup?',
    options: ['USA, Canada, Brazil', 'USA, Mexico, Canada', 'USA, Argentina, Mexico', 'Canada, Mexico, Brazil'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'In which stadium will the 2026 World Cup Final be held?',
    options: ['Estadio Azteca', 'AT&T Stadium', 'MetLife Stadium', 'SoFi Stadium'],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'How many groups will there be in the 2026 World Cup?',
    options: ['8', '10', '12', '16'],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: 'What is the total number of matches in the 2026 World Cup?',
    options: ['64', '80', '104', '128'],
    correctAnswer: 2,
  },
];

export const tournamentStats = {
  teams: 48,
  matches: 104,
  venues: 16,
  hostNations: 3,
};

export const finalDate = new Date('2026-07-19T19:00:00-05:00');
