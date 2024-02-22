import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";

const RegistrationContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
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

  const navigate = useNavigate(); // Get the history object

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      isAdmin: formData.isAdmin ? 1 : 0, // Convert isAdmin to 1 or 0
    };

    try {
      // Step 1: Create the client
      const clientResponse = await fetch("http://localhost:5088/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registrationData.name,
          surname: registrationData.surname,
          email: registrationData.email,
          telephone: registrationData.telephone,
        }),
      });

      const clientData = await clientResponse.json();

      if (!clientResponse.ok) {
        console.error("Błąd rejestracji klienta:", clientResponse.statusText);
        console.error("Dodatkowe informacje:", clientData); // Log additional information
        return;
      }

      const clientId = clientData.id;

      // Step 2: Create user credentials
      const userRegistrationResponse = await fetch(
        "http://localhost:5088/credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: clientId,
            username: registrationData.username,
            password: registrationData.password,
            isAdmin: registrationData.isAdmin,
          }),
        }
      );

      if (!userRegistrationResponse.ok) {
        console.error(
          "Błąd rejestracji użytkownika:",
          userRegistrationResponse.statusText
        );
        return;
      }
      setRegistrationSuccess(true);
      // Redirect after successful registration
      setTimeout(() => {
        navigate("/");
      }, 2000); // Adjust the delay time as needed
    } catch (error) {
      console.error("Błąd podczas rejestracji:", error.message);
    }
  };
  const handleSnackbarClose = () => {
    setRegistrationSuccess(false);
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
        />
        <TextField
          label="Nazwisko"
          variant="outlined"
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Telefon"
          variant="outlined"
          type="text"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
        <TextField
          label="Nazwa użytkownika"
          variant="outlined"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Hasło"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
            checked={Boolean(formData.isAdmin)}
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
      {/* Snackbar to display success message */}
      <Snackbar
        open={registrationSuccess}
        autoHideDuration={1800}
        onClose={handleSnackbarClose}
        message="Pomyślnie zarejestrowano. Zaloguj się."
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Centered at the top
      />
    </RegistrationContainer>
  );
};
