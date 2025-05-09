import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateParticipantStats, calculateTeamStats, loadAllYearData } from '../utils/dataUtils';
import { ParticipantStats, TeamStats, YearData } from '../types';

interface DataContextProps {
  yearData: YearData[];
  participantStats: ParticipantStats[];
  teamStats: TeamStats[];
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [yearData, setYearData] = useState<YearData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantStats, setParticipantStats] = useState<ParticipantStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadAllYearData();
        setYearData(data);
      } catch (err) {
        setError('Failed to load race data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (yearData && yearData.length) {
        setParticipantStats(calculateParticipantStats(yearData));
        setTeamStats(calculateTeamStats(yearData));
    }
  }, [yearData]);

  return (
    <DataContext.Provider value={{ yearData, participantStats, teamStats, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
