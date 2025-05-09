import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Statistics } from './components/statistics';
import { LandingPage } from './components/landingPage';
import { theme } from './appTheme';
import { DataProvider } from './components/dataContext';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path={`${import.meta.env.BASE_URL}`} element={<LandingPage />} />
          <Route 
            path={`${import.meta.env.BASE_URL}statistics`}
            element={
              <DataProvider>
                <Statistics />
              </DataProvider>
            } 
          />
          <Route path="*" element={<Navigate to={`${import.meta.env.BASE_URL}`} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
