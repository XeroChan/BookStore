import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

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
    isAdmin: false,
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

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
          inputProps={{ maxLength: 50 }}
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
        />
        <TextField
          label="Hasło"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          inputProps={{ maxLength: 20 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isAdmin}
              onChange={handleChange}
              name="isAdmin"
            />
          }
          label="Admin"
        />
        <Button type="submit" variant="contained" color="primary">
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
      <br></br>
      {errorMessage && (
        <Alert severity="error" onClose={handleAlertClose}>
          {errorMessage}
        </Alert>
      )}
    </RegistrationContainer>
  );
};