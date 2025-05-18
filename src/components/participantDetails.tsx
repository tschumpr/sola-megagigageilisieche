import { FC, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from 'recharts';
import { ParticipantStats } from '../types';
import { CommonTableContainer } from './styledComponents';

interface ParticipantDetailsProps {
  participant: ParticipantStats;
}

type SortField = 'year' | 'track' | 'distance' | 'altitude' | 'time' | 'pace' | 'rank';
type SortOrder = 'asc' | 'desc';

export const ParticipantDetails: FC<ParticipantDetailsProps> = ({ participant }) => {
  const theme = useTheme();
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
        case 'altitude':
          if (a.altitude === null && b.altitude === null) comparison = 0;
          else if (a.altitude === null) comparison = 1;
          else if (b.altitude === null) comparison = -1;
          else comparison = a.altitude - b.altitude;
          break;
        case 'time':
          if (a.time === 0 && b.time === 0) comparison = 0;
          else if (a.time === 0) comparison = 1;
          else if (b.time === 0) comparison = -1;
          else comparison = a.time - b.time;
          break;
        case 'pace':
          if (a.pace === undefined && b.pace === undefined) comparison = 0;
          else if (a.pace === undefined) comparison = 1;
          else if (b.pace === undefined) comparison = -1;
          else comparison = a.pace - b.pace;
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

  const trackProgressions = useMemo(() => {
    // Group races by track
    const trackGroups = participant.races.reduce((acc, race) => {
      if (!race.isDisqualified) {
        const track = race.track;
        if (!acc[track]) {
          acc[track] = [];
        }
        acc[track].push(race);
      }
      return acc;
    }, {} as Record<number, typeof participant.races>);

    // Filter tracks with multiple runs and sort by year
    return Object.entries(trackGroups)
      .filter(([_, races]) => races.length > 1)
      .map(([track, races]) => {
        const sortedRaces = races.sort((a, b) => a.year - b.year);
        const times = sortedRaces.map(r => r.time).filter((t): t is number => t !== 0);
        const min = Math.floor(Math.min(...times) / 5) * 5; // Round down to nearest 5 minutes
        const max = Math.ceil(Math.max(...times) / 5) * 5; // Round up to nearest 5 minutes
        
        return {
          track: Number(track),
          data: sortedRaces.map(race => ({
            year: race.year,
            time: race.time,
            rank: race.rank,
          })),
          timeRange: { min, max }
        };
      })
      .sort((a, b) => a.track - b.track);
  }, [participant.races]);

  const formatTooltipTime = (value: number) => {
    if (!value) return '-';
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    const seconds = Math.floor((value * 60) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatAxisTime = (value: number) => {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        [theme.breakpoints.down('sm')]: {
          p: 1.5,
          mb: 2,
        }
      }}>
        <Stack spacing={2}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 2,
            [theme.breakpoints.down('sm')]: {
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1
            }
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Gesamtdistanz</Typography>
              <Typography variant="h6">{participant.totalDistance.toFixed(1)} km</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Gesamtzeit</Typography>
              <Typography variant="h6">{formatTime(participant.totalTime)}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Bester Rang</Typography>
              <Typography variant="h6">{participant.bestRank ?? '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Durchschnittlicher Rang</Typography>
              <Typography variant="h6">{participant.averageRank?.toFixed(0) ?? '-'}</Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 2,
            [theme.breakpoints.down('sm')]: {
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1
            }
          }}>
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
            <Box></Box>
          </Box>
        </Stack>
      </Paper>

      <CommonTableContainer>
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
                  Distanz
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'altitude'}
                  direction={sortField === 'altitude' ? sortOrder : 'asc'}
                  onClick={() => handleSort('altitude')}
                >
                  Höhenmeter
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
                  active={sortField === 'pace'}
                  direction={sortField === 'pace' ? sortOrder : 'asc'}
                  onClick={() => handleSort('pace')}
                >
                  Pace (min/km)
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRaces.map((race, index) => (
              <TableRow key={index}>
                <TableCell>{race.year}</TableCell>
                <TableCell>{race.track}</TableCell>
                <TableCell align="right">{race.distance.toFixed(1)}</TableCell>
                <TableCell align="right">{race.altitude !== null ? race.altitude.toFixed(0) : '-'}</TableCell>
                <TableCell align="right">
                  {race.isDisqualified ? (
                    <span style={{ color: 'red' }}>Disqualifiziert</span>
                  ) : race.isCancelled ? (
                    <span style={{ color: 'orange' }}>Abgesagt</span>
                  ) : race.time !== null ? (
                    formatTime(race.time)
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell align="right">
                  {race.pace !== undefined ? race.pace.toFixed(1) : '-'}
                </TableCell>
                <TableCell align="right">{race.rank !== null ? race.rank : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CommonTableContainer>

      {trackProgressions.length > 0 && (
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Streckenverlauf</Typography>
          <Stack 
            direction="row"
            flexWrap="wrap"
            spacing={3}
            sx={{
              '& > *': { 
                flex: '1 1 400px',
                overflow: 'hidden'
              }
            }}
          >
            {trackProgressions.map(({ track, data, timeRange }) => (
              <Stack key={track} spacing={1} sx={{ height: 250 }}>
                <Typography variant="subtitle1">Strecke {track}</Typography>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <ResponsiveContainer>
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ 
                          value: 'Jahr', 
                          position: 'insideBottom', 
                          offset: -5
                        }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        orientation="left" 
                        label={{ 
                          value: 'Zeit', 
                          angle: -90, 
                          position: 'insideLeft',
                          offset: 0
                        }}
                        domain={[timeRange.min, timeRange.max]}
                        tickFormatter={formatAxisTime}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        label={{ 
                          value: 'Rang', 
                          angle: 90, 
                          position: 'insideRight',
                          offset: 0
                        }}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => {
                          if (name === 'Zeit') return formatTooltipTime(value);
                          return value;
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar yAxisId="right" dataKey="rank" name="Rang" fill={theme.palette.primary.main} />
                      <Line yAxisId="left" type="monotone" dataKey="time" name="Zeit" stroke={theme.palette.secondary.main} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}; 
