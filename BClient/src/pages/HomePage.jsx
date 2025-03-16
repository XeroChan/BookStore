import React from 'react';
import { Container, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 64px)',
  textAlign: 'center',
});

export const HomePage = () => {
  return (
    <CenteredContainer>
      <Typography variant="h4" gutterBottom>
        Witamy w księgarni
      </Typography>
      <Typography variant="body1" gutterBottom>
        Zarejestruj się albo zaloguj, aby kontynuować.
      </Typography>
    </CenteredContainer>
  );
};