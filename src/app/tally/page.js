"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';


const LicenseButton = styled(Button)(({ theme, highlighted = false }) => ({
  width: '180px',
  height: '50px',
  margin: '0 8px',
  borderRadius: '4px',
  textTransform: 'none',
  border: '1px solid #ccc',
  backgroundColor: highlighted ? '#FFEBB3' : 'white',
  color: 'black',
  '&:hover': {
    backgroundColor: highlighted ? '#FFE29C' : '#F5F5F5',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
}));
const KeyboardShortcut = styled('span')({
    marginRight: '8px',
    fontWeight: 'bold',
  });
  const QuitButton = styled(Button)({
    borderRadius: 0,
    height: '30px',
    textTransform: 'none',
    borderRight: '1px solid #ccc',
    color: 'black',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
    
  
  });

export default function TallyLicenseScreen() {
  const router = useRouter();
  
  const move = () => {
    router.push('/tally/creation');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#B8C1C8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: '700px',
            padding: '24px',
            backgroundColor: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderBottom: '1px solid #E0E0E0',
              paddingBottom: '8px',
              marginBottom: '24px',
              fontWeight: 'normal',
            }}
          >
            License
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1">
              Unable to access the configured Tally Gateway Server (localhost:9999).
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Select one of the following options:
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 3,
              mb: 2,
            }}
          >
            <LicenseButton onClick={move} highlighted>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <KeyboardShortcut>T:</KeyboardShortcut>Continue In
              </Box>
              <Typography variant="body2">Educational Mode</Typography>
            </LicenseButton>
            <LicenseButton>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <KeyboardShortcut>U:</KeyboardShortcut>Use License
              </Box>
              <Typography variant="body2">From Network</Typography>
            </LicenseButton>
            <LicenseButton>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <KeyboardShortcut>R:</KeyboardShortcut>Reactivate
              </Box>
              <Typography variant="body2">Existing License</Typography>
            </LicenseButton>
            <LicenseButton>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <KeyboardShortcut>A:</KeyboardShortcut>Activate
              </Box>
              <Typography variant="body2">New License</Typography>
            </LicenseButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}









