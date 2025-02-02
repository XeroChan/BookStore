import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 64px)', // Adjust height to account for AppBar
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