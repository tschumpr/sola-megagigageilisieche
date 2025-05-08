import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  TableSortLabel,
  Box,
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { ParticipantStats as ParticipantStatsType, TeamStats } from '../types';
import { ParticipantDetails } from './participantDetails';

interface StatisticsProps {
  participantStats: ParticipantStatsType[];
  teamStats: TeamStats[];
}

type SortField = 'name' | 'totalDistance' | 'totalTime' | 'participationCount' | 'completedRaces' | 'disqualifiedRaces' | 'bestRank' | 'averageRank';
type SortOrder = 'asc' | 'desc';

export const Statistics: React.FC<StatisticsProps> = ({ participantStats, teamStats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantStatsType | null>(null);
  const [activeTab, setActiveTab] = useState(0);

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

  const filteredAndSortedStats = useMemo(() => {
    return participantStats
      .filter(stat => 
        stat.participationCount > 0 &&
        stat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [participantStats, searchTerm, sortField, sortOrder]);

  const renderParticipantStats = () => (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Nach Namen suchen"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      </Box>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'totalDistance'}
                  direction={sortField === 'totalDistance' ? sortOrder : 'asc'}
                  onClick={() => handleSort('totalDistance')}
                >
                  Gesamtdistanz (km)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'totalTime'}
                  direction={sortField === 'totalTime' ? sortOrder : 'asc'}
                  onClick={() => handleSort('totalTime')}
                >
                  Gesamtzeit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'participationCount'}
                  direction={sortField === 'participationCount' ? sortOrder : 'asc'}
                  onClick={() => handleSort('participationCount')}
                >
                  Teilnahmen
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'completedRaces'}
                  direction={sortField === 'completedRaces' ? sortOrder : 'asc'}
                  onClick={() => handleSort('completedRaces')}
                >
                  Erfolgreich
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'disqualifiedRaces'}
                  direction={sortField === 'disqualifiedRaces' ? sortOrder : 'asc'}
                  onClick={() => handleSort('disqualifiedRaces')}
                >
                  Disqualifiziert
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'bestRank'}
                  direction={sortField === 'bestRank' ? sortOrder : 'asc'}
                  onClick={() => handleSort('bestRank')}
                >
                  Bester Rang
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'averageRank'}
                  direction={sortField === 'averageRank' ? sortOrder : 'asc'}
                  onClick={() => handleSort('averageRank')}
                >
                  Durchschnittlicher Rang
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedStats.map((stat) => (
              <TableRow 
                key={stat.name}
                onClick={() => setSelectedParticipant(stat)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  {stat.name}
                </TableCell>
                <TableCell align="right">{stat.totalDistance.toFixed(1)}</TableCell>
                <TableCell align="right">{formatTime(stat.totalTime)}</TableCell>
                <TableCell align="right">{stat.participationCount}</TableCell>
                <TableCell align="right">{stat.completedRaces}</TableCell>
                <TableCell align="right">{stat.disqualifiedRaces}</TableCell>
                <TableCell align="right">{stat.bestRank ?? '-'}</TableCell>
                <TableCell align="right">{stat.averageRank ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderTeamStats = () => (
    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jahr</TableCell>
            <TableCell>Kategorie</TableCell>
            <TableCell align="right">Zeit</TableCell>
            <TableCell align="right">Rang</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamStats.map((stat) => (
            <TableRow key={stat.year}>
              <TableCell>{stat.year}</TableCell>
              <TableCell>{stat.category}</TableCell>
              <TableCell align="right">{stat.totalTime ?? '-'}</TableCell>
              <TableCell align="right">{stat.rank ?? '-'}</TableCell>
              <TableCell align="right">
                {stat.isCancelled ? (
                  <Chip label="Abgesagt" color="warning" />
                ) : stat.isDisqualified ? (
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
  );

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Statistiken
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Team-Statistik" />
          <Tab label="Läufer:innen-Statistik" />
        </Tabs>
      </Box>

      {activeTab === 0 ? renderTeamStats() : renderParticipantStats()}

      <Dialog 
        open={selectedParticipant !== null} 
        onClose={() => setSelectedParticipant(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          {selectedParticipant && (
            <ParticipantDetails
              participant={selectedParticipant}
              onBack={() => setSelectedParticipant(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 