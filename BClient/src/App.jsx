import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StorePage } from "./pages/StorePage";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { UserProfile } from './pages/UserProfile';
import { HomePage } from './pages/HomePage';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { getUserInfo } from './api/data.js';
import LogoutTimer from './components/LogoutTimer';
import './App.css';

function App({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      getUserInfo(setUser);
    }
  }, [setIsAuthenticated, setUser]);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const handleTimeout = () => {
    handleLogout();
    alert('Zostałeś wylogowany z powodu nieaktywności.');
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
              <LogoutTimer initialTime={180} onTimeout={handleTimeout} />
            </Box>
          )}
          <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Typography variant="h6">
              BookStore
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/store"
                sx={{
                  fontWeight: 500,
                  color: 'rgb(255, 255, 255)',
                  textDecoration: 'inherit',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#89c7fa',
                  },
                }}
                >
                  Wypożyczalnia
                </Button>
                <Button color="inherit" component={Link} to="/userpage" state={{ user }}
                sx={{
                  fontWeight: 500,
                  color: 'rgb(255, 255, 255)',
                  textDecoration: 'inherit',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#89c7fa',
                  },
                }}
                >
                  Mój profil
                </Button>
                <Button color="inherit" onClick={handleLogout}
                sx={{
                  fontWeight: 500,
                  color: 'rgb(255, 255, 255)',
                  textDecoration: 'inherit',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#89c7fa',
                  },
                }}
                >
                  Wyloguj się
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login"
                sx={{
                  fontWeight: 500,
                  color: 'rgb(255, 255, 255)',
                  textDecoration: 'inherit',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#89c7fa',
                  },
                }}>
                  Zaloguj się
                </Button>
                <Button color="inherit" component={Link} to="/registration"
                sx={{
                  fontWeight: 500,
                  color: 'rgb(255, 255, 255)',
                  textDecoration: 'inherit',
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: '#89c7fa',
                  },
                }}
                >
                  Zarejestruj się
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This is to offset the fixed AppBar */}
      <Container className="centered-container-grid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/store" element={<StorePage isAuthenticated={isAuthenticated} user={user} setUser={setUser} />} />
          <Route path="/userpage" element={<UserProfile user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/userprofile/:clientId" element={<UserProfile user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </Container>
    </>
  );
}

export default function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <App isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} setUser={setUser} />
    </Router>
  );
}