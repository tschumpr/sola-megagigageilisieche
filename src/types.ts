export interface Run {
  track: number;
  name: string;
  distance: number;
  altitude: number;
  time: string | null;
  rank: number | null;
}

export interface TeamResult {
  time: string | null;
  rank: number | null;
  category: string;
}

export interface YearData {
  year: number;
  runs: Run[];
  total: TeamResult;
}

export interface ParticipantStatsCalculation {
  name: string;
  totalDistance: number;
  totalTime: number; // in minutes
  totalAltitude: number;
  participationCount: number;
  completedRaces: number;
  cancelledRaces: number;
  disqualifiedRaces: number;
  bestRank: number | null;
  averageRank: number | null;
  rankSum: number;
  rankCount: number;
}

export interface Race {
  year: number;
  track: number;
  distance: number;
  altitude: number | null;
  time: number;
  rank: number | null;
  isDisqualified: boolean;
  isCancelled: boolean;
  pace?: number; // min/km
}

export interface ParticipantStats {
  name: string;
  totalDistance: number;
  totalTime: number;
  totalAltitude: number;
  participationCount: number;
  completedRaces: number;
  disqualifiedRaces: number;
  bestRank: number | null;
  averageRank: number | null;
  races: Race[];
}

export interface TeamStats {
  year: number;
  category: string;
  totalTime: string | null;
  rank: number | null;
  isDisqualified: boolean;
  isCancelled: boolean;
}
