import { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, createTheme, CircularProgress, Box, Stack } from '@mui/material';
import { Statistics } from './components/statistics';
import { loadAllYearData, calculateParticipantStats, calculateTeamStats } from './utils/dataUtils';
import { YearData } from './types';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearData, setYearData] = useState<YearData[]>([]);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div>{error}</div>
      </Box>
    );
  }

  const participantStats = calculateParticipantStats(yearData);
  const teamStats = calculateTeamStats(yearData);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack sx={{ width: '100%', height: '100%' }}>
        <Statistics 
          participantStats={participantStats}
          teamStats={teamStats}
        />
        </Stack>
    </ThemeProvider>
  );
}

export default App;
