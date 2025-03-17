import { Box, Container, Typography, TextField, Button, Alert } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

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

export const LoginPage = ({ setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://localhost:5088/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const token = await response.text();
        sessionStorage.setItem("authToken", token);
        setIsAuthenticated(true);
        navigate("/store");
      } else {
        const errorData = await response.json();
        console.error("Login error:", errorData.message);
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const handleAlertClose = () => {
    setErrorMessage("");
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
          InputLabelProps={{
            sx: {
              color: "#9bc9db",
            },
          }}
          InputProps={{
            sx: {
              color: '#ffffff',
            },
          }}
        />
        <TextField
          label="Hasło"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          required
          name="password"
          InputLabelProps={{
            sx: {
              color: "#9bc9db",
            },
          }}
          InputProps={{
            sx: {
              color: '#ffffff',
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary"
        sx={{
          textDecoration: 'inherit',
          '&:hover': {
            color: '#000000',
            backgroundColor: '#89c7fa',
          },
        }}
        >
          Zaloguj się
        </Button>
      </LoginForm>
      {errorMessage && (
        <Box mt={2}>
          <Alert severity="error" style={{ padding: '1rem' }} onClose={handleAlertClose}>
            {errorMessage}
          </Alert>
        </Box>
      )}
    </LoginContainer>
  );
};
