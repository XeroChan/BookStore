import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StorePage } from "./pages/StorePage";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { UserProfile } from './pages/UserProfile';
import { HomePage } from './pages/HomePage';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { getUserInfo } from './api/data.js';
import './App.css'; // Import the CSS file

function App({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      getUserInfo(setUser);
    }
  }, [setIsAuthenticated, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Typography variant="h6" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              BookStore
            </Typography>
          </Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/store">
                Store
              </Button>
              <Button color="inherit" component={Link} to="/userpage" state={{ user }}>
                My Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/registration">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This is to offset the fixed AppBar */}
      <Container className="centered-container-grid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/store" element={<StorePage isAuthenticated={isAuthenticated} user={user} setUser={setUser} />} />
          <Route path="/userpage" element={<UserProfile user={user} setUser={setUser} />} />
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