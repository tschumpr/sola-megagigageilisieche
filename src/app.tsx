import { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, CircularProgress, Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Statistics } from './components/statistics';
import { LandingPage } from './components/landingPage';
import { loadAllYearData, calculateParticipantStats, calculateTeamStats } from './utils/dataUtils';
import { YearData } from './types';
import { theme } from './appTheme';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/statistics" 
            element={
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Statistics 
                  participantStats={participantStats}
                  teamStats={teamStats}
                />
              </Container>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
