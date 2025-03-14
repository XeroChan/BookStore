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
        Welcome to BookStore
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please login or register to continue.
      </Typography>
    </CenteredContainer>
  );
};