import { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Stack,
} from '@mui/material';
import { useData } from './dataContext';
import { handleSort, SortOrder } from '../utils/tableUtils';
import { ParticipantDetails } from './participantDetails';
import { CommonDialog } from './commonDialog';
import { CommonTableContainer } from './styledComponents';
import { useNavigate, useSearchParams } from 'react-router-dom';

type SortField = 'name' | 'totalDistance' | 'totalTime' | 'participationCount' | 'completedRaces' | 'disqualifiedRaces' | 'bestRank' | 'averageRank' | 'tracks';

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  return `${hours}h ${mins}m ${secs}s`;
};

export const ParticipantStatistics = () => {
  const { participantStats } = useData();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      navigate({ pathname: location.pathname, hash: 'participants', search: `?search=${value}` }, { replace: true });
    } else {
      navigate({ pathname: location.pathname, hash: 'participants', search: '' }, { replace: true });
    }
  };

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, []);

  const handleRowClick = (name: string) => {
    setSelectedParticipant(name);
  };

  const handleCloseModal = () => {
    setSelectedParticipant(null);
  };

  const selectedParticipantData = useMemo(() => {
    if (!selectedParticipant) return null;
    return participantStats.find(stat => stat.name === selectedParticipant) ?? null;
  }, [selectedParticipant, participantStats]);

  const filteredAndSortedStats = useMemo(() => {
    return participantStats
      .filter(stat => 
        stat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        stat.races.some(race => !race.isCancelled)
      )
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'totalDistance':
            comparison = a.totalDistance - b.totalDistance;
            break;
          case 'totalTime':
            comparison = a.totalTime - b.totalTime;
            break;
          case 'participationCount':
            comparison = a.participationCount - b.participationCount;
            break;
          case 'completedRaces':
            comparison = a.completedRaces - b.completedRaces;
            break;
          case 'disqualifiedRaces':
            comparison = a.disqualifiedRaces - b.disqualifiedRaces;
            break;
          case 'bestRank':
            if (a.bestRank === null && b.bestRank === null) comparison = 0;
            else if (a.bestRank === null) comparison = 1;
            else if (b.bestRank === null) comparison = -1;
            else comparison = a.bestRank - b.bestRank;
            break;
          case 'averageRank':
            if (a.averageRank === null && b.averageRank === null) comparison = 0;
            else if (a.averageRank === null) comparison = 1;
            else if (b.averageRank === null) comparison = -1;
            else comparison = a.averageRank - b.averageRank;
            break;
          case 'tracks':
            const aTracks = [...new Set(a.races.map(r => r.track))].sort((x, y) => x - y);
            const bTracks = [...new Set(b.races.map(r => r.track))].sort((x, y) => x - y);
            comparison = aTracks.length - bTracks.length;
            if (comparison === 0) {
              comparison = aTracks[0] - bTracks[0];
            }
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [participantStats, sortField, sortOrder, searchTerm]);

  return (
    <>
      <Stack sx={{ mb: 2 }}>
        <TextField
          label="Nach Namen suchen"
          variant="outlined"
          size="small"
          color='secondary'
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          fullWidth
        />
      </Stack>
      <CommonTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'totalDistance'}
                  direction={sortField === 'totalDistance' ? sortOrder : 'asc'}
                  onClick={() => handleSort('totalDistance', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Distanz
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'totalTime'}
                  direction={sortField === 'totalTime' ? sortOrder : 'asc'}
                  onClick={() => handleSort('totalTime', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Zeit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'participationCount'}
                  direction={sortField === 'participationCount' ? sortOrder : 'asc'}
                  onClick={() => handleSort('participationCount', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Teilnahmen
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'completedRaces'}
                  direction={sortField === 'completedRaces' ? sortOrder : 'asc'}
                  onClick={() => handleSort('completedRaces', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Erfolgreich
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'disqualifiedRaces'}
                  direction={sortField === 'disqualifiedRaces' ? sortOrder : 'asc'}
                  onClick={() => handleSort('disqualifiedRaces', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Disqualifiziert
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'tracks'}
                  direction={sortField === 'tracks' ? sortOrder : 'asc'}
                  onClick={() => handleSort('tracks', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Strecken
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'bestRank'}
                  direction={sortField === 'bestRank' ? sortOrder : 'asc'}
                  onClick={() => handleSort('bestRank', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Bester Rang
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'averageRank'}
                  direction={sortField === 'averageRank' ? sortOrder : 'asc'}
                  onClick={() => handleSort('averageRank', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Durchschnitt
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedStats.map((stat) => (
              <TableRow 
                key={stat.name}
                onClick={() => handleRowClick(stat.name)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                <TableCell>{stat.name}</TableCell>
                <TableCell align="right">{stat.totalDistance.toFixed(1)}km</TableCell>
                <TableCell align="right">{formatTime(stat.totalTime)}</TableCell>
                <TableCell align="right">{stat.participationCount}</TableCell>
                <TableCell align="right">{stat.completedRaces}</TableCell>
                <TableCell align="right">{stat.disqualifiedRaces}</TableCell>
                <TableCell align="right">{[...new Set(stat.races.map(r => r.track))].sort((a, b) => a - b).join(', ')}</TableCell>
                <TableCell align="right">{stat.bestRank ?? '-'}</TableCell>
                <TableCell align="right">{stat.averageRank ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CommonTableContainer>

      <CommonDialog
        open={selectedParticipant !== null}
        onClose={handleCloseModal}
        title={`SOLA-Rückblick von ${selectedParticipant}`}
        maxWidth="lg"
      >
        {selectedParticipantData && (
          <ParticipantDetails
            participant={selectedParticipantData}
          />
        )}
      </CommonDialog>
    </>
  );
};