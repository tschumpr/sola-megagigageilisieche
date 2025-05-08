import { FC, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TableSortLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ParticipantStats } from '../types';

interface ParticipantDetailsProps {
  participant: ParticipantStats;
  onBack: () => void;
}

type SortField = 'year' | 'track' | 'distance' | 'time' | 'rank';
type SortOrder = 'asc' | 'desc';

export const ParticipantDetails: FC<ParticipantDetailsProps> = ({ participant, onBack }) => {
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedRaces = useMemo(() => {
    return [...participant.races].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'track':
          comparison = a.track - b.track;
          break;
        case 'distance':
          comparison = a.distance - b.distance;
          break;
        case 'time':
          if (a.time === 0 && b.time === 0) comparison = 0;
          else if (a.time === 0) comparison = 1;
          else if (b.time === 0) comparison = -1;
          else comparison = a.time - b.time;
          break;
        case 'rank':
          if (a.rank === null && b.rank === null) comparison = 0;
          else if (a.rank === null) comparison = 1;
          else if (b.rank === null) comparison = -1;
          else comparison = a.rank - b.rank;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [participant.races, sortField, sortOrder]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'background.paper',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h5">
          SOLA-Rückblick von {participant.name}
        </Typography>
        <IconButton onClick={onBack} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Gesamtdistanz</Typography>
            <Typography variant="h6">{participant.totalDistance.toFixed(1)} km</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Gesamtzeit</Typography>
            <Typography variant="h6">{formatTime(participant.totalTime)}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Teilnahmen</Typography>
            <Typography variant="h6">{participant.participationCount}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Erfolgreich</Typography>
            <Typography variant="h6">{participant.completedRaces}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Disqualifiziert</Typography>
            <Typography variant="h6">{participant.disqualifiedRaces}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Bester Rang</Typography>
            <Typography variant="h6">{participant.bestRank ?? '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Durchschnittlicher Rang</Typography>
            <Typography variant="h6">{participant.averageRank?.toFixed(1) ?? '-'}</Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'year'}
                  direction={sortField === 'year' ? sortOrder : 'asc'}
                  onClick={() => handleSort('year')}
                >
                  Jahr
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'track'}
                  direction={sortField === 'track' ? sortOrder : 'asc'}
                  onClick={() => handleSort('track')}
                >
                  Strecke
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'distance'}
                  direction={sortField === 'distance' ? sortOrder : 'asc'}
                  onClick={() => handleSort('distance')}
                >
                  Distanz (km)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'time'}
                  direction={sortField === 'time' ? sortOrder : 'asc'}
                  onClick={() => handleSort('time')}
                >
                  Zeit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'rank'}
                  direction={sortField === 'rank' ? sortOrder : 'asc'}
                  onClick={() => handleSort('rank')}
                >
                  Rang
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRaces.map((race) => (
              <TableRow key={`${race.year}-${race.track}`}>
                <TableCell>{race.year}</TableCell>
                <TableCell>{race.track}</TableCell>
                <TableCell align="right">{race.distance.toFixed(1)}</TableCell>
                <TableCell align="right">{race.time ? formatTime(race.time) : '-'}</TableCell>
                <TableCell align="right">{race.rank ?? '-'}</TableCell>
                <TableCell align="right">
                  {race.isDisqualified ? (
                    <Chip label="Disqualifiziert" color="error" />
                  ) : (
                    <Chip label="Erfolgreich" color="success" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 