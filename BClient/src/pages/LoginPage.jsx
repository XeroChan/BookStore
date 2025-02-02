import { Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from 'react-router-dom';

const LoginContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
});

const LoginForm = styled("form")({
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const LoginPage = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch('http://localhost:5088/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
        navigate('/store');
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <LoginContainer>
      <Typography variant="h4" gutterBottom>
        Logowanie
      </Typography>
      <LoginForm onSubmit={handleLogin}>
        <TextField
          label="Nazwa użytkownika"
          variant="outlined"
          type="text"
          required
          name="username"
        />
        <TextField
          label="Hasło"
          variant="outlined"
          type="password"
          required
          name="password"
        />
        <Button type="submit" variant="contained" color="primary">
          Zaloguj się
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};