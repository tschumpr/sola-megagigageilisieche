import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const correctSequence = [1, 3, 4, 8];
const CAPTCHA_COMPLETED_KEY = 'captcha_completed';

export const LandingPage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shuffledImages] = useState(() => {
    const images = Array.from({ length: 9 }, (_, i) => i + 1);
    return images.sort(() => Math.random() - 0.5);
  });
  const navigate = useNavigate();
  const theme = useTheme();

  const isImageSelected = (num: number) => selectedImages.includes(num);

  const handleImageClick = (num: number) => {
    if (isImageSelected(num)) {
      setSelectedImages(selectedImages.filter(n => n !== num));
    } else {
      setSelectedImages([...selectedImages, num]);
    }
  };

  useEffect(() => {
    if (selectedImages.length === correctSequence.length) {
      const isCorrect = selectedImages.every((num, index) => num === correctSequence[index]);
      if (isCorrect) {
        localStorage.setItem(CAPTCHA_COMPLETED_KEY, 'true');
        navigate(`${import.meta.env.BASE_URL}statistics`);
      } else {
        setError('Falsche Reihenfolge. Versuch es erneut.');
        setSelectedImages([]);
      }
    }
  }, [selectedImages, navigate]);

  return (
    <Box sx={{
      height: `calc(100vh - ${theme.spacing(12)})`,
      "@supports (height: 100dvh)": {
        height: `calc(100dvh - ${theme.spacing(12)})`
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      bgcolor: theme.palette.primary.main,
    }}>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2,
        maxWidth: 600,
        width: '100%',
        aspectRatio: '1',
        pt: error ? 0 : 3,
      }}>
        {shuffledImages.map((num) => (
          <Box
            key={num}
            sx={{
              position: "relative",
              width: '100%',
              aspectRatio: '1',
              cursor: 'pointer',
              border: isImageSelected(num)
                ? `3px solid ${theme.palette.primary.dark}`
                : '3px solid transparent',
              borderRadius: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: isImageSelected(num) ? theme.palette.primary.dark : theme.palette.secondary.light,
              },
              '&:active': {
                borderColor: theme.palette.secondary.main,
              },
              overflow: 'hidden',
            }}
            onClick={() => handleImageClick(num)}
          >
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}captcha/${num}.png`}
              alt={`Captcha ${num}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                p: 1,
                boxSizing: 'border-box',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}; 
