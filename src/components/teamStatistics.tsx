import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableSortLabel,
} from '@mui/material';
import { useData } from './dataContext';
import { handleSort, SortOrder } from '../utils/tableUtils';
import { RaceDetails } from './raceDetails';
import { CommonDialog } from './commonDialog';
import { CommonTableContainer } from './styledComponents';

type SortField = 'year' | 'category' | 'totalTime' | 'rank';

const formatTime = (timeStr: string | null): string => {
  if (!timeStr) return '-';
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const TeamStatistics = () => {
  const { teamStats, yearData } = useData();
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleRowClick = (year: number) => {
    setSelectedYear(year);
  };

  const handleCloseModal = () => {
    setSelectedYear(null);
  };

  const selectedYearData = useMemo(() => {
    if (!selectedYear) return null;
    const yearDataItem = yearData.find(data => data.year === selectedYear);
    return yearDataItem?.runs ?? null;
  }, [selectedYear, yearData]);

  const sortedStats = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'year':
          comparison = Number(a.year) - Number(b.year);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'totalTime':
          if (a.totalTime === null && b.totalTime === null) comparison = 0;
          else if (a.totalTime === null) comparison = 1;
          else if (b.totalTime === null) comparison = -1;
          else comparison = a.totalTime.localeCompare(b.totalTime);
          break;
        case 'rank':
          if (a.rank === null && b.rank === null) comparison = 0;
          else if (a.rank === null) comparison = 1;
          else if (b.rank === null) comparison = -1;
          else comparison = Number(a.rank) - Number(b.rank);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [teamStats, sortField, sortOrder]);

  return (
    <>
      <CommonTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'year'}
                  direction={sortField === 'year' ? sortOrder : 'asc'}
                  onClick={() => handleSort('year', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Jahr
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'category'}
                  direction={sortField === 'category' ? sortOrder : 'asc'}
                  onClick={() => handleSort('category', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Kategorie
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
                  active={sortField === 'rank'}
                  direction={sortField === 'rank' ? sortOrder : 'asc'}
                  onClick={() => handleSort('rank', sortField, sortOrder, setSortField, setSortOrder)}
                >
                  Rang
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStats.map((stat) => (
              <TableRow 
                key={stat.year}
                onClick={() => handleRowClick(stat.year)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                <TableCell>{stat.year}</TableCell>
                <TableCell>{stat.category}</TableCell>
                <TableCell align="right">{formatTime(stat.totalTime)}</TableCell>
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
      </CommonTableContainer>

      <CommonDialog
        open={selectedYear !== null}
        onClose={handleCloseModal}
        title={`SOLA-Stafette ${selectedYear}`}
        maxWidth="lg"
      >
        {selectedYear && (
          <RaceDetails
            runs={selectedYearData}
          />
        )}
      </CommonDialog>
    </>
  );
};