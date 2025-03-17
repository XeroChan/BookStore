import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/system';
import { Alert, Box, Button, TextField } from '@mui/material';

const StyledInput = styled('input')({
  '::placeholder': {
    color: '#dbdbdb',
  },
});

const DeleteAccount = ({ clientId, setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("authToken").replace(/"/g, "");
      const response = await fetch(`http://localhost:5088/clients/${clientId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/");
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = { message: response.statusText };
        }
        setErrorMessage(errorData.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const handleAlertClose = () => {
    setErrorMessage("");
  };

  return (
    <div>
      <TextField
        type="password"
        label="Potwierdź hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{
          sx: {
            color: "#9bc9db",
          },
        }}
        InputProps={{
          sx: {
            color: "#ffffff",
          },
        }}
      />
      <Button variant="contained" color="primary" onClick={handleDeleteAccount}>
        Usuń konto
      </Button>
      {errorMessage && (
        <Box mt={2}>
          <Alert severity="error" onClose={handleAlertClose} style={{ padding: '1rem' }}>
            {errorMessage}
          </Alert>
        </Box>
      )}
    </div>
  );
};

export default DeleteAccount;