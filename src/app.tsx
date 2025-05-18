import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./appTheme";
import { DataProvider } from "./components/dataContext";
import { LandingPage } from "./components/landingPage";
import { Statistics } from "./components/statistics";

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
};

export default App;
