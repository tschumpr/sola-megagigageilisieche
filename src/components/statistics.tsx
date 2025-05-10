import { SyntheticEvent, useState, useEffect } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ParticipantStatistics } from './participantStatistics';
import { TeamStatistics } from './teamStatistics';
import { useData } from './dataContext';

const CAPTCHA_COMPLETED_KEY = 'captcha_completed';

export const Statistics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error } = useData();
  const theme = useTheme();

  useEffect(() => {
    const captchaCompleted = localStorage.getItem(CAPTCHA_COMPLETED_KEY);
    if (!captchaCompleted) {
      navigate(`${import.meta.env.BASE_URL}`);
      return;
    }

    if (location.hash === '#participants') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
      if (!location.hash) {
        navigate({ pathname: location.pathname, hash: 'team' }, { replace: true });
      }
    }
  }, [location.hash, location.pathname, navigate]);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    navigate({ pathname: location.pathname, hash: newValue === 0 ? 'team' : 'participants' });
  };

  return (
    <Stack sx={{ 
      height: "100vh",
      "@supports (height: 100dvh)": {
        height: "100dvh"
      },
      overflow: "hidden" 
    }}>
      <Stack
        sx={{
          width: '100%',
          flex: '0 0 72px',
          justifyContent: 'flex-end',
          zIndex: 1000,
          bgcolor: theme.palette.primary.main,
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: '0 8px 6px -6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Team" />
          <Tab label="Läufer:innen" />
        </Tabs>
      </Stack>
      <Stack
        id="content"
        flexGrow={1}
        overflow="hidden"
        p={2}
        bgcolor="#ffffff"
      >
        {loading || error ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <Typography color="error">{error}</Typography>
            )}
          </Stack>
        ) : activeTab === 0 ? (
          <TeamStatistics />
        ) : (
          <ParticipantStatistics />
        )}
      </Stack>
    </Stack>
  );
};
