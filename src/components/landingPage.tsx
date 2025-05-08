import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../appTheme';

const correctSequence = [1, 3, 4, 8];

export const LandingPage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shuffledImages, setShuffledImages] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const images = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  const handleImageClick = (imageNumber: number) => {
    const newSequence = [...selectedImages, imageNumber];
    setSelectedImages(newSequence);

    if (newSequence.length === correctSequence.length) {
      const isCorrect = newSequence.every((num, index) => num === correctSequence[index]);
      if (isCorrect) {
        navigate('/statistics');
      } else {
        setError('Falsche Reihenfolge. Versuch es erneut.');
        setSelectedImages([]);
      }
    }
  };

  const isImageSelected = (imageNumber: number) => {
    return selectedImages.includes(imageNumber);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      bgcolor: theme.palette.primary.main,
    }}>
      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2,
        maxWidth: 600,
        width: '100%'
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
              }
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
                p: 1
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}; 