import { YearData, ParticipantStats, TeamStats, ParticipantStatsCalculation, Race } from '../types';

// Function to convert time string to minutes
export const timeToMinutes = (time: string | null): number => {
  if (!time) return 0;
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
};

// Function to load all year data
export const loadAllYearData = async (): Promise<YearData[]> => {
  const years = Array.from({ length: 11 }, (_, i) => 2014 + i);
  const dataPromises = years.map(async (year) => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/${year}.json`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) throw new Error(`Failed to load ${year}.json`);
      const data = await response.json();
      return { ...data, year };
    } catch (error) {
      console.error(`Error loading ${year}.json:`, error);
      return null;
    }
  });

  const results = await Promise.all(dataPromises);
  return results.filter((data): data is YearData => data !== null);
};

// Function to calculate participant statistics
export const calculateParticipantStats = (allYearData: YearData[]): ParticipantStats[] => {
  const statsMap = new Map<string, ParticipantStatsCalculation & { races: Race[] }>();

  allYearData.forEach((yearData, yearIndex) => {
    const year = 2014 + yearIndex;
    const allRunsCancelled = yearData.runs.every(run => run.time === null && run.rank === null);
    
    yearData.runs.forEach((run) => {
      const existingStats = statsMap.get(run.name) || {
        name: run.name,
        totalDistance: 0,
        totalTime: 0,
        totalAltitude: 0,
        participationCount: 0,
        completedRaces: 0,
        cancelledRaces: 0,
        disqualifiedRaces: 0,
        bestRank: null,
        averageRank: 0,
        rankSum: 0,
        rankCount: 0,
        races: [],
      };

      if (!allRunsCancelled) {
        existingStats.participationCount++;
        existingStats.totalDistance += run.distance;
        if (run.altitude !== null) {
          existingStats.totalAltitude += run.altitude;
        }

        const timeInMinutes = timeToMinutes(run.time);
        const pace = run.time && run.distance ? timeInMinutes / run.distance : undefined;
        const pace3D = run.time && run.distance && run.altitude ? 
          timeInMinutes / (Math.sqrt(Math.pow(run.distance * 1000, 2) + Math.pow(run.altitude, 2)) / 1000) : undefined;

        existingStats.races.push({
          year: year,
          track: run.track,
          distance: run.distance,
          altitude: run.altitude,
          time: timeInMinutes,
          rank: run.rank,
          isDisqualified: run.time === null && run.rank === null,
          isCancelled: false,
          pace,
          pace3D
        });

        if (run.time === null && run.rank === null) {
          existingStats.disqualifiedRaces++;
        } else {
          existingStats.completedRaces++;
          existingStats.totalTime += timeInMinutes;
        }

        if (run.rank !== null) {
          existingStats.rankSum += run.rank;
          existingStats.rankCount++;
          if (existingStats.bestRank === null || run.rank < existingStats.bestRank) {
            existingStats.bestRank = run.rank;
          }
        }
      }

      statsMap.set(run.name, existingStats);
    });
  });

  return Array.from(statsMap.values()).map(({ rankSum, rankCount, ...stats }) => ({
    ...stats,
    averageRank: rankCount > 0 ? Math.round(rankSum / rankCount) : null,
  }));
};

// Function to calculate team statistics
export const calculateTeamStats = (allYearData: YearData[]): TeamStats[] => {
  return allYearData.map((yearData, index) => {
    const hasCompletedRuns = yearData.runs.some(run => run.time !== null);
    const allRunsCancelled = yearData.runs.every(run => run.time === null && run.rank === null);
    
    return {
      year: 2014 + index,
      category: yearData.total.category,
      totalTime: yearData.total.time,
      rank: yearData.total.rank,
      isDisqualified: yearData.total.rank === null && hasCompletedRuns && !allRunsCancelled,
      isCancelled: yearData.total.time === null && yearData.total.rank === null && allRunsCancelled,
    };
  });
}; 