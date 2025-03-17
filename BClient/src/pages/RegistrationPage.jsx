import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

const RegistrationContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
});

const RegistrationForm = styled("form")({
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    username: "",
    password: "",
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    digits: false,
    lowercase: false,
    uppercase: false,
    special: false,
    noRepeats: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      validatePasswordHints(value);
    }
  };

  const validatePasswordHints = (password) => {
    setPasswordValidations({
      length: password.length >= 10 && password.length <= 19,
      digits: (password.match(/\d/g) || []).length >= 2,
      lowercase: (password.match(/[a-z]/g) || []).length >= 2,
      uppercase: (password.match(/[A-Z]/g) || []).length >= 2,
      special: (password.match(/[@#$%!]/g) || []).length >= 2,
      noRepeats: !/(.)\1{1}/.test(password),
    });
  };
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?!.*(.)\1{1})(?=(.*[\d]){2,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*[@#$%!]){2,})(?:[\da-zA-Z@#$%!]){10,20}$/;
    return passwordRegex.test(password);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setErrorMessage('Hasło nie jest zgodne z polityką bezpieczeństwa.');
      return;
    }

    const registrationData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      telephone: formData.telephone,
      username: formData.username,
      password: formData.password,
      isAdmin: formData.isAdmin,
    };

    try {
      const response = await fetch("http://localhost:5088/clients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Registration error:", errorData.message);
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      setErrorMessage("An unexpected error occurred. Please try again later."); // generic error message
    }
  };

  const handleSnackbarClose = () => {
    setRegistrationSuccess(false);
  };

  const handleAlertClose = () => {
    setErrorMessage("");
  };

  return (
    <RegistrationContainer>
      <Typography variant="h4" gutterBottom>
        Rejestracja
      </Typography>
      <RegistrationForm onSubmit={handleRegistration}>
        <TextField
          label="Imię"
          variant="outlined"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 50}}
          InputLabelProps={{
            sx: {
              color: '#9bc9db',
            },
          }}
          InputProps={{
            sx: {
              color: '#ffffff',
            },
          }}
        />
        <TextField
          label="Nazwisko"
          variant="outlined"
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 50 }}
          InputLabelProps={{
            sx: {
              color: '#9bc9db',
            },
          }}
          InputProps={{
            sx: {
              color: '#ffffff',
            },
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 100 }}
          InputLabelProps={{
            sx: {
              color: '#9bc9db',
            },
          }}
          InputProps={{
            sx: {
              color: '#ffffff',
            },
          }}
        />
        <TextField
          label="Telefon"
          variant="outlined"
          type="text"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 9, pattern: "[0-9]{9}" }}
          InputLabelProps={{
            sx: {
              color: '#9bc9db',
            },
          }}
          InputProps={{
            sx: {
              color: '#ffffff',
            },
          }}
        />
        <TextField
          label="Nazwa użytkownika"
          variant="outlined"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
          InputLabelProps={{
            sx: {
              color: '#9bc9db',
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
          InputLabelProps={{
            sx: {
              color: '#9bc9db',
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
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Hasło musi mieć od 10 do 20 znaków.</Typography>
            {passwordValidations.length ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Hasło musi zawierać przynajmniej 2 cyfry.</Typography>
            {passwordValidations.digits ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Hasło musi zawierać przynajmniej 2 małe litery.</Typography>
            {passwordValidations.lowercase ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Hasło musi zawierać przynajmniej 2 duże litery.</Typography>
            {passwordValidations.uppercase ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Hasło musi zawierać przynajmniej 2 z następujących znaków specjalnych (@#$%!).</Typography>
            {passwordValidations.special ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Hasło nie może posiadać następujących po sobie powtarzających się znaków.</Typography>
            {passwordValidations.noRepeats ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          </Box>
        </Box>
        <Button type="submit" variant="contained" color="primary"
        sx={{
          textDecoration: 'inherit',
          '&:hover': {
            color: '#000000',
            backgroundColor: '#89c7fa',
          },
        }}
        >
          Zarejestruj się
        </Button>
      </RegistrationForm>
      <Snackbar
        open={registrationSuccess}
        autoHideDuration={1800}
        onClose={handleSnackbarClose}
        message="Pomyślnie zarejestrowano. Zaloguj się."
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Box mt={2}>
      {errorMessage && (
        <Alert severity="error" onClose={handleAlertClose} style={{ padding: '1rem' }}>
          {errorMessage}
        </Alert>
      )}
      </Box>
    </RegistrationContainer>
  );
};